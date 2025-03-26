"use client"

import { useState, useEffect } from "react"
import { NFTCard } from "./nft-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockNFTs } from "@/lib/data"
export function TrendingNFTs() {
    const [isLoading, setIsLoading] = useState(true)
    const [nfts, setNfts] = useState<typeof mockNFTs>([])

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setNfts(mockNFTs)
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full">
            <Tabs defaultValue="24h" className="w-full">
                <TabsList className="mb-6 bg-slate-100">
                    <TabsTrigger value="24h">24h</TabsTrigger>
                    <TabsTrigger value="7d">7d</TabsTrigger>
                    <TabsTrigger value="30d">30d</TabsTrigger>
                    <TabsTrigger value="all">All Time</TabsTrigger>
                </TabsList>

                <TabsContent value="24h" className="mt-0">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {isLoading
                            ? Array(4)
                                .fill(null)
                                .map((_, index) => (
                                    <div key={index} className="space-y-3">
                                        <Skeleton className="aspect-square w-full rounded-lg" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    </div>
                                ))
                            : nfts.map((nft) => <NFTCard key={nft.id} nft={nft} />)}
                    </div>
                </TabsContent>

                {/* Similar TabsContent for other time periods */}
            </Tabs>
        </div>
    )
} 