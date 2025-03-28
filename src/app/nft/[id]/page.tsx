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
import { LikeButton } from "@/components/social/like-button"
import { CommentSection } from "@/components/social/comment-section"
import { ipfsToHttp } from "@/lib/ipfs"

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
                        className="w-full object-cover"
                    />
                </div>

                {/* NFT Details */}
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <Badge>Collection Name</Badge>
                            <h1 className="text-3xl font-bold mt-2">NFT Name #{id}</h1>
                            <div className="flex items-center mt-2">
                                <span className="text-sm text-gray-500 mr-2">Owned by</span>
                                <Avatar className="h-6 w-6 mr-1">
                                    <AvatarImage src="/placeholder-avatar.png" />
                                    <AvatarFallback>ON</AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium">OwnerName</span>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <LikeButton nftId={id as string} initialLikes={42} size="md" />
                            <Button variant="outline" size="icon">
                                <Share2 className="h-5 w-5" />
                            </Button>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Price and Buy */}
                    <Card className="p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Current Price</p>
                                <p className="text-3xl font-bold">1.5 ETH</p>
                                <p className="text-sm text-gray-500">$2,853.41</p>
                            </div>
                            <Button onClick={() => setShowBuyModal(true)}>Buy Now</Button>
                        </div>
                    </Card>

                    {/* Tabs */}
                    <Tabs defaultValue="details">
                        <TabsList>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="properties">Properties</TabsTrigger>
                            <TabsTrigger value="history">History</TabsTrigger>
                            <TabsTrigger value="comments">Comments</TabsTrigger>
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
                        <TabsContent value="comments">
                            <CommentSection nftId={id as string} />
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