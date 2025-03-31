import { ethers } from "ethers";
import { Queue } from "bullmq";
import Redis from "ioredis";
import { relayerConfig } from "./config";
import { ethereumBridgeABI, espressoBridgeABI, arbitrumBridgeABI } from "./abis";
import { logger } from "./logger";

// Initialize Redis connection
const redisOptions = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
};

const redis = new Redis(redisOptions);

// Message queues for job processing
const depositQueue = new Queue("deposits", { connection: redis });
const purchaseQueue = new Queue("purchases", { connection: redis });

// Provider initialization
const providers = {
    ethereum: new ethers.JsonRpcProvider(relayerConfig.ethereum.rpc),
    espresso: new ethers.JsonRpcProvider(relayerConfig.espresso.rpc),
    arbitrum: new ethers.JsonRpcProvider(relayerConfig.arbitrum.rpc)
};

// Contract initialization
const contracts = {
    ethereumBridge: new ethers.Contract(
        relayerConfig.ethereum.bridgeAddress,
        ethereumBridgeABI,
        providers.ethereum
    ),
    espressoBridge: new ethers.Contract(
        relayerConfig.espresso.bridgeHubAddress,
        espressoBridgeABI,
        providers.espresso
    ),
    arbitrumBridge: new ethers.Contract(
        relayerConfig.arbitrum.bridgeReceiverAddress,
        arbitrumBridgeABI,
        providers.arbitrum
    )
};

// Initialize wallets using environment variables
const initializeWallets = () => {
    if (!process.env.ESPRESSO_PRIVATE_KEY || !process.env.ARBITRUM_PRIVATE_KEY) {
        throw new Error("Missing private keys for relayer wallets");
    }

    return {
        espresso: new ethers.Wallet(process.env.ESPRESSO_PRIVATE_KEY, providers.espresso),
        arbitrum: new ethers.Wallet(process.env.ARBITRUM_PRIVATE_KEY, providers.arbitrum)
    };
};

// Create signed contract instances
const createSignedContracts = (wallets: {
    espresso: ethers.Wallet,
    arbitrum: ethers.Wallet
}) => {
    return {
        espressoBridge: contracts.espressoBridge.connect(wallets.espresso),
        arbitrumBridge: contracts.arbitrumBridge.connect(wallets.arbitrum)
    };
};

// Monitor Ethereum deposits
async function monitorEthereumDeposits(signedContracts: any) {
    logger.info("Starting Ethereum deposit monitoring...");

    contracts.ethereumBridge.on("TokensDeposited", async (user, token, amount, destinationChainId, depositId, event) => {
        logger.info(`New deposit detected: ${depositId}`);

        // Wait for confirmations
        const receipt = await event.getTransactionReceipt();
        let currentBlock = await providers.ethereum.getBlockNumber();

        while (currentBlock - receipt.blockNumber < relayerConfig.ethereum.requiredConfirmations) {
            logger.info(`Waiting for confirmations: ${currentBlock - receipt.blockNumber}/${relayerConfig.ethereum.requiredConfirmations}`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            currentBlock = await providers.ethereum.getBlockNumber();
        }

        // Queue deposit confirmation job
        await depositQueue.add("confirmDeposit", {
            user,
            token,
            amount: amount.toString(),
            depositId,
            txHash: event.transactionHash,
            timestamp: Date.now()
        });
    });
}

// Monitor Espresso purchases
async function monitorEspressoPurchases(signedContracts: any) {
    logger.info("Starting Espresso purchase monitoring...");

    contracts.espressoBridge.on("PurchaseInitiated", async (user, token, amount, targetChainId, nftContract, nftId, purchaseId, event) => {
        logger.info(`New purchase initiated: ${purchaseId}`);

        // Wait for confirmations
        const receipt = await event.getTransactionReceipt();
        let currentBlock = await providers.espresso.getBlockNumber();

        while (currentBlock - receipt.blockNumber < relayerConfig.espresso.requiredConfirmations) {
            logger.info(`Waiting for confirmations: ${currentBlock - receipt.blockNumber}/${relayerConfig.espresso.requiredConfirmations}`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            currentBlock = await providers.espresso.getBlockNumber();
        }

        // Queue purchase execution job
        await purchaseQueue.add("executePurchase", {
            user,
            token,
            amount: amount.toString(),
            targetChainId: targetChainId.toString(),
            nftContract,
            nftId: nftId.toString(),
            purchaseId,
            txHash: event.transactionHash,
            timestamp: Date.now()
        });
    });
}

// Process deposit confirmations
async function processDepositQueue(signedContracts: any) {
    depositQueue.process(async (job) => {
        const { user, token, amount, depositId } = job.data;
        logger.info(`Processing deposit confirmation: ${depositId}`);

        try {
            // Check if already processed
            const key = `deposit:${depositId}`;
            const exists = await redis.exists(key);
            if (exists) {
                logger.info(`Deposit ${depositId} already processed`);
                return { status: "already_processed" };
            }

            // Confirm deposit on Espresso
            const tx = await signedContracts.espressoBridge.confirmDeposit(
                user,
                token,
                amount,
                depositId,
                { gasLimit: 500000 }
            );

            logger.info(`Deposit confirmation transaction sent: ${tx.hash}`);

            // Wait for transaction confirmation
            const receipt = await tx.wait(relayerConfig.espresso.requiredConfirmations);

            // Record successful processing
            await redis.set(key, JSON.stringify({
                status: "confirmed",
                txHash: tx.hash,
                timestamp: Date.now()
            }));

            return {
                status: "success",
                txHash: tx.hash
            };
        } catch (error: any) {
            logger.error(`Error confirming deposit ${depositId}:`, error);

            // Record failed attempt
            await redis.set(`deposit:${depositId}:error`, JSON.stringify({
                error: error.message,
                timestamp: Date.now()
            }));

            // Throw error to trigger retry
            throw error;
        }
    });
}

// Process purchase executions
async function processPurchaseQueue(signedContracts: any) {
    purchaseQueue.process(async (job) => {
        const { user, nftContract, nftId, amount, purchaseId } = job.data;
        logger.info(`Processing purchase execution: ${purchaseId}`);

        try {
            // Check if already processed
            const key = `purchase:${purchaseId}`;
            const exists = await redis.exists(key);
            if (exists) {
                logger.info(`Purchase ${purchaseId} already processed`);
                return { status: "already_processed" };
            }

            // Execute purchase on Arbitrum
            const tx = await signedContracts.arbitrumBridge.executeNFTPurchase(
                user,
                nftContract,
                nftId,
                amount,
                purchaseId,
                { gasLimit: 500000 }
            );

            logger.info(`Purchase execution transaction sent: ${tx.hash}`);

            // Wait for transaction confirmation
            const receipt = await tx.wait(relayerConfig.arbitrum.requiredConfirmations);

            // Record successful processing
            await redis.set(key, JSON.stringify({
                status: "executed",
                txHash: tx.hash,
                timestamp: Date.now()
            }));

            return {
                status: "success",
                txHash: tx.hash
            };
        } catch (error: any) {
            logger.error(`Error executing purchase ${purchaseId}:`, error);

            // Record failed attempt
            await redis.set(`purchase:${purchaseId}:error`, JSON.stringify({
                error: error.message,
                timestamp: Date.now()
            }));

            // Throw error to trigger retry
            throw error;
        }
    });
}

// Start the relayer service
export async function startRelayerService() {
    try {
        logger.info("Initializing relayer service...");

        // Initialize wallets and contracts
        const wallets = initializeWallets();
        const signedContracts = createSignedContracts(wallets);

        // Start event monitors
        await monitorEthereumDeposits(signedContracts);
        await monitorEspressoPurchases(signedContracts);

        // Start queue processors
        await processDepositQueue(signedContracts);
        await processPurchaseQueue(signedContracts);

        logger.info("Relayer service started successfully");

        return {
            status: "running",
            startTime: new Date().toISOString()
        };
    } catch (error: any) {
        logger.error("Failed to start relayer service:", error);
        throw error;
    }
}

// Shutdown the relayer service
export async function stopRelayerService() {
    try {
        // Close connections and cleanup
        await redis.quit();
        await depositQueue.close();
        await purchaseQueue.close();

        logger.info("Relayer service stopped");

        return {
            status: "stopped",
            stopTime: new Date().toISOString()
        };
    } catch (error: any) {
        logger.error("Error stopping relayer service:", error);
        throw error;
    }
} 