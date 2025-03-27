"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatEther } from "viem"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NFTGridProps {
    filters?: {
        owner?: string
        creator?: string
        collection?: string
        searchQuery?: string
        category?: string
        sortBy?: string
    }
}

export function NFTGrid({ filters }: NFTGridProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [nfts, setNfts] = useState<any[]>([])

    // Fetch NFTs based on filters
    useEffect(() => {
        const fetchNFTs = async () => {
            try {
                // TODO: Replace with actual API call
                // This is just a placeholder
                setTimeout(() => {
                    setNfts([
                        {
                            id: "1",
                            name: "Awesome NFT #1",
                            description: "This is an awesome NFT",
                            image: "/placeholder.png",
                            price: 1000000000000000000n, // 1 ETH
                            collection: {
                                name: "Awesome Collection",
                                verified: true
                            },
                            creator: {
                                address: "0x123",
                                username: "Creator1",
                                avatar: "/placeholder-avatar.png"
                            },
                            likes: 42
                        },
                        {
                            id: "2",
                            name: "Cool NFT #2",
                            description: "This is a cool NFT",
                            image: "/placeholder.png",
                            price: 500000000000000000n, // 0.5 ETH
                            collection: {
                                name: "Cool Collection",
                                verified: false
                            },
                            creator: {
                                address: "0x456",
                                username: "Creator2",
                                avatar: "/placeholder-avatar.png"
                            },
                            likes: 24
                        }
                    ])
                    setIsLoading(false)
                }, 1000)
            } catch (error) {
                console.error("Failed to fetch NFTs:", error)
                setIsLoading(false)
            }
        }

        fetchNFTs()
    }, [filters])

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array(8).fill(null).map((_, i) => (
                    <Card key={i}>
                        <Skeleton className="h-[300px] rounded-b-none" />
                        <CardContent className="p-4">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardContent>
                        <CardFooter className="flex justify-between p-4">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )
    }

    if (nfts.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-medium">No NFTs found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search query</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {nfts.map((nft) => (
                <Link href={`/nft/${nft.id}`} key={nft.id}>
                    <Card className="overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer">
                        <div className="relative aspect-square">
                            <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-full h-full object-cover"
                            />
                            <Badge className="absolute top-2 right-2">{nft.collection.name}</Badge>
                        </div>
                        <CardContent className="p-4">
                            <h3 className="font-bold truncate">{nft.name}</h3>
                            <div className="flex items-center mt-2">
                                <Avatar className="w-6 h-6 mr-2">
                                    <AvatarImage src={nft.creator.avatar} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-500">{nft.creator.username}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between p-4 border-t">
                            <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="font-bold">{formatEther(nft.price)} ETH</p>
                            </div>
                            <Button variant="ghost" size="icon" className="flex items-center">
                                <Heart className="w-5 h-5" />
                                <span className="ml-1 text-sm">{nft.likes}</span>
                            </Button>
                        </CardFooter>
                    </Card>
                </Link>
            ))}
        </div>
    )
} 