"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function CollectionsPage() {
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Collections</h1>
                <Link href="/create">
                    <Button>Create Collection</Button>
                </Link>
            </div>

            <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md mb-8"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Collection cards will be mapped here */}
                {/* This is a placeholder for the collection grid */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <CardTitle>Bored Ape Yacht Club</CardTitle>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Verified
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-square rounded-lg overflow-hidden mb-4">
                            <img
                                src="/placeholder.png"
                                alt="Collection"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            A collection of 10,000 unique Bored Ape NFTs
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src="/creator.png" />
                                <AvatarFallback>CR</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">Created by BAYC</span>
                        </div>
                        <div className="text-sm">
                            Floor: 50 ETH
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
} 