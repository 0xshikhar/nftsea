"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, MoreHorizontal } from "lucide-react"
import { BuyModal } from "@/components/nft/buy-modal"

export default function NFTDetailPage() {
    const { id } = useParams()
    const [showBuyModal, setShowBuyModal] = useState(false)

    return (
        <div className="container py-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* NFT Image */}
                <div className="rounded-lg overflow-hidden">
                    <img
                        src="/placeholder.png"
                        alt="NFT"
                        className="w-full aspect-square object-cover"
                    />
                </div>

                {/* NFT Details */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">NFT Name</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge>Collection Name</Badge>
                                <Badge variant="outline">Token ID: {id}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                                <Heart className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <Share2 className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Creator</p>
                            <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src="/creator.png" />
                                    <AvatarFallback>CR</AvatarFallback>
                                </Avatar>
                                <span>Creator Name</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Owner</p>
                            <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src="/owner.png" />
                                    <AvatarFallback>OW</AvatarFallback>
                                </Avatar>
                                <span>Owner Name</span>
                            </div>
                        </div>
                    </div>

                    <Card className="p-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Current Price</p>
                                <p className="text-3xl font-bold">1.5 ETH</p>
                                <p className="text-sm text-gray-500">≈ $2,500 USD</p>
                            </div>
                            <Button size="lg" onClick={() => setShowBuyModal(true)}>
                                Buy Now
                            </Button>
                        </div>
                    </Card>

                    <Tabs defaultValue="details">
                        <TabsList>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="properties">Properties</TabsTrigger>
                            <TabsTrigger value="history">History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="space-y-4">
                            <p>Description of the NFT goes here...</p>
                        </TabsContent>
                        <TabsContent value="properties">
                            <div className="grid grid-cols-3 gap-4">
                                {/* Properties will be mapped here */}
                            </div>
                        </TabsContent>
                        <TabsContent value="history">
                            {/* Transaction history will be displayed here */}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            <BuyModal
                open={showBuyModal}
                onClose={() => setShowBuyModal(false)}
                nftId={id as string}
            />
        </div>
    )
} 