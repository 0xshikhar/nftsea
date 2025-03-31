// Configuration for the relayer service
import { contractAddresses } from "@/lib/contracts";
import { SUPPORTED_CHAINS } from "@/lib/constants";

export const relayerConfig = {
    ethereum: {
        rpc: process.env.NEXT_PUBLIC_ETHEREUM_RPC || "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
        bridgeAddress: process.env.NEXT_PUBLIC_ETH_BRIDGE_ADDRESS || "",
        chainId: SUPPORTED_CHAINS.ETH_SEPOLIA,
        requiredConfirmations: 3
    },
    espresso: {
        rpc: process.env.NEXT_PUBLIC_ESPRESSO_RPC || "https://testnet.espresso.network/v1/YOUR_API_KEY",
        bridgeHubAddress: process.env.NEXT_PUBLIC_ESPRESSO_BRIDGE_HUB || "",
        chainId: parseInt(process.env.NEXT_PUBLIC_ESPRESSO_CHAIN_ID || "336699"),
        requiredConfirmations: 2
    },
    arbitrum: {
        rpc: process.env.NEXT_PUBLIC_ARBITRUM_RPC || "https://sepolia-rollup.arbitrum.io/rpc",
        bridgeReceiverAddress: process.env.NEXT_PUBLIC_ARBITRUM_BRIDGE_RECEIVER || "",
        chainId: SUPPORTED_CHAINS.ARBITRUM_SEPOLIA,
        requiredConfirmations: 2
    }
}; 