"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Card,
    CardContent
} from "@/components/ui/card"
import { ArrowRight, ArrowUp, ArrowDown } from "lucide-react"
import { mockCollections } from "@/lib/data"
export function TopCollections() {
    const [isLoading, setIsLoading] = useState(true)
    const [collections, setCollections] = useState<typeof mockCollections>([])

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setCollections(mockCollections)
            setIsLoading(false)
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full">
            <Card>
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-slate-500 border-b pb-2 mb-2">
                        <div className="col-span-5 flex items-center">Collection</div>
                        <div className="col-span-2 text-right">Floor Price</div>
                        <div className="col-span-2 text-right">Volume</div>
                        <div className="col-span-2 text-right">Change</div>
                        <div className="col-span-1 text-right"></div>
                    </div>

                    {isLoading ? (
                        Array(5).fill(null).map((_, i) => (
                            <div key={i} className="grid grid-cols-12 gap-4 py-3 items-center border-b border-slate-100 last:border-0">
                                <div className="col-span-5 flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                                <div className="col-span-2 text-right">
                                    <Skeleton className="h-4 w-12 ml-auto" />
                                </div>
                                <div className="col-span-2 text-right">
                                    <Skeleton className="h-4 w-16 ml-auto" />
                                </div>
                                <div className="col-span-2 text-right">
                                    <Skeleton className="h-4 w-14 ml-auto" />
                                </div>
                                <div className="col-span-1 text-right">
                                    <Skeleton className="h-4 w-4 ml-auto" />
                                </div>
                            </div>
                        ))
                    ) : (
                        collections.map((collection, index) => (
                            <div key={collection.id} className="grid grid-cols-12 gap-4 py-3 items-center border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                <div className="col-span-5 flex items-center gap-3">
                                    <div className="flex-shrink-0 relative">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={collection.image} alt={collection.name} />
                                            <AvatarFallback>{collection.name[0]}</AvatarFallback>
                                        </Avatar>
                                        {collection.isVerified && (
                                            <div className="absolute -right-1 -bottom-1 bg-blue-500 text-white rounded-full p-0.5">
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Link href={`/collections/${collection.id}`} className="font-medium text-slate-900 hover:text-blue-600">
                                            {collection.name}
                                        </Link>
                                        <p className="text-xs text-slate-500">
                                            by {collection.creator}
                                        </p>
                                    </div>
                                </div>
                                <div className="col-span-2 text-right font-medium">
                                    {collection.floorPrice} ETH
                                </div>
                                <div className="col-span-2 text-right font-medium">
                                    {collection.volume.toLocaleString()} ETH
                                </div>
                                <div className={`col-span-2 text-right font-medium flex items-center justify-end ${collection.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {collection.change >= 0 ? (
                                        <ArrowUp className="h-3 w-3 mr-1" />
                                    ) : (
                                        <ArrowDown className="h-3 w-3 mr-1" />
                                    )}
                                    {Math.abs(collection.change)}%
                                </div>
                                <div className="col-span-1 text-right">
                                    <Link href={`/collections/${collection.id}`}>
                                        <ArrowRight className="h-4 w-4 text-slate-400 hover:text-blue-600 inline-block" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    )
} 