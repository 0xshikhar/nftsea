"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateNFTForm } from "@/components/nft/create-nft-form"
import { CreateCollectionForm } from "@/components/nft/create-collection-form"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function CreatePage() {
    const { isConnected } = useAccount()

    return (
        <div className="container py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Create</h1>

                {!isConnected ? (
                    <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <h2 className="text-xl font-medium mb-4">Connect your wallet</h2>
                        <p className="text-gray-500 mb-6">
                            Connect your wallet to create NFTs and collections
                        </p>
                        <div className="flex justify-center">
                            <ConnectButton />
                        </div>
                    </div>
                ) : (
                    <Tabs defaultValue="nft">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="nft">Create NFT</TabsTrigger>
                            <TabsTrigger value="collection">Create Collection</TabsTrigger>
                        </TabsList>
                        <TabsContent value="nft">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <CreateNFTForm />
                            </div>
                        </TabsContent>
                        <TabsContent value="collection">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <CreateCollectionForm />
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    )
} 