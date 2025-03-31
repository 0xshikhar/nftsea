import { Metadata } from "next";
import { RelayerControl } from "@/components/admin/RelayerControl";

export const metadata: Metadata = {
    title: "NFTsea | Relayer Admin",
    description: "Manage the cross-chain relayer service for NFTsea marketplace",
};

export default function RelayerAdminPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Relayer Administration</h1>

            <div className="grid gap-8">
                <RelayerControl />

                <div className="bg-gray-50 p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">About the Relayer Service</h2>
                    <p className="mb-4">
                        The Espresso Relayer service facilitates cross-chain NFT transactions by monitoring events
                        across Ethereum, Espresso, and Arbitrum networks. It processes deposits and executes
                        purchases in a secure and reliable manner.
                    </p>

                    <h3 className="font-medium text-lg mt-6 mb-2">System Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Redis server running for queue management</li>
                        <li>Secure private keys for the relayer wallets</li>
                        <li>Sufficient funds in relayer wallets for gas fees</li>
                        <li>Stable internet connection</li>
                    </ul>

                    <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-yellow-800 text-sm">
                            <strong>Note:</strong> The relayer service requires environment variables to be properly configured.
                            Make sure ESPRESSO_PRIVATE_KEY and ARBITRUM_PRIVATE_KEY are set securely.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 