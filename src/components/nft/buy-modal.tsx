"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWriteContract, useAccount } from "wagmi"
import { toast } from "sonner"
import { parseEther } from "viem"

interface BuyModalProps {
    open: boolean
    onClose: () => void
    nftId: string
    price?: string
}

export function BuyModal({ open, onClose, nftId, price = "1.5" }: BuyModalProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const { address } = useAccount()
    const { writeContract } = useWriteContract()

    const handleBuy = async () => {
        if (!address) {
            toast.error("Please connect your wallet")
            return
        }

        try {
            setIsProcessing(true)

            // TODO: Replace with actual contract call
            // Example:
            // const { hash } = await writeContract({
            //   address: "NFT_MARKETPLACE_CONTRACT",
            //   abi: ["NFT_MARKETPLACE_ABI"],
            //   functionName: "buyNFT",
            //   args: [nftId],
            //   value: parseEther(price)
            // })

            // Simulate transaction
            await new Promise(resolve => setTimeout(resolve, 2000))

            toast.success("NFT purchased successfully!")
            onClose()
        } catch (error) {
            toast.error("Failed to purchase NFT")
            console.error(error)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Purchase NFT</DialogTitle>
                    <DialogDescription>
                        You are about to purchase NFT #{nftId}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg">
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="text-2xl font-bold">{price} ETH</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 mb-1">Quantity</p>
                        <Input type="number" value="1" readOnly />
                    </div>

                    <div className="space-y-2">
                        <p className="text-sm font-medium">Total</p>
                        <div className="flex justify-between">
                            <span>Item Price</span>
                            <span>{price} ETH</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                            <span className="font-bold">You Pay</span>
                            <span className="font-bold">{price} ETH</span>
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleBuy}
                        disabled={isProcessing || !address}
                    >
                        {isProcessing ? "Processing..." : "Confirm Purchase"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
} 