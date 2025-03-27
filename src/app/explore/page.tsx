"use client"

import { useState } from "react"
import { NFTGrid } from "@/components/nft/nft-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NFT_CATEGORIES } from "@/lib/constants"

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("recent")

    return (
        <div className="container py-8">
            <h1 className="text-4xl font-bold mb-8">Explore NFTs</h1>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <Input
                    placeholder="Search NFTs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:w-1/3"
                />

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="md:w-1/4">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {NFT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category.toLowerCase()}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="md:w-1/4">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Recently Listed</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="likes">Most Liked</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* NFT Grid */}
            <NFTGrid
                filters={{
                    searchQuery,
                    category: selectedCategory,
                    sortBy
                }}
            />
        </div>
    )
} 