"use client"

import { useState, useEffect } from "react"
import { NFTCard } from "./nft-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockNFTChart } from "@/lib/data"

export function FeaturedNFTs() {
    const [isLoading, setIsLoading] = useState(true)
    const [nfts, setNfts] = useState<typeof mockNFTChart>([])

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setNfts(mockNFTChart)
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 bg-slate-100">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                <TabsTrigger value="polygon">Polygon</TabsTrigger>
                <TabsTrigger value="optimism">Optimism</TabsTrigger>
                <TabsTrigger value="base">Base</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
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

            <TabsContent value="ethereum" className="mt-0">
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
                        : nfts
                            .filter((nft) => nft.chain.toLowerCase() === "ethereum")
                            .map((nft) => <NFTCard key={nft.id} nft={nft} />)}
                </div>
            </TabsContent>

            {/* Similar TabsContent for polygon, optimism, and base */}
        </Tabs>
    )
} 