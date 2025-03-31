// rollup-event-listener
const { ethers } = require("ethers");
const fs = require("fs");

// Load ABI
const paymentProcessorABI = JSON.parse(fs.readFileSync("./abis/NFTPaymentProcessor.json"));

// Initialize providers
const sepoliaProvider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");

// Contract addresses
const PAYMENT_PROCESSOR_ADDRESS = "YOUR_PAYMENT_PROCESSOR_ADDRESS";

// Initialize contract instances
const paymentProcessor = new ethers.Contract(
    PAYMENT_PROCESSOR_ADDRESS,
    paymentProcessorABI,
    sepoliaProvider
);

// Espresso confirmation API client
const espressoAPI = "http://localhost:3000/api/confirmations";

async function listenForPayments() {
    console.log("Starting to listen for payment events...");

    paymentProcessor.on("PaymentReceived", async (buyer, amount, nftId, paymentId, event) => {
        console.log(`Payment received from ${buyer} for NFT ID ${nftId.toString()}`);

        try {
            // Submit to Espresso for confirmation
            const response = await fetch(espressoAPI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chainId: 11155111, // Sepolia
                    blockNumber: event.blockNumber,
                    txHash: event.transactionHash,
                    event: {
                        name: "PaymentReceived",
                        buyer,
                        amount: amount.toString(),
                        nftId: nftId.toString(),
                        paymentId
                    }
                })
            });

            const result = await response.json();
            console.log("Event submitted to Espresso:", result);
        } catch (error) {
            console.error("Error submitting to Espresso:", error);
        }
    });

    console.log("Listening for payment events...");
}

listenForPayments().catch(console.error);
