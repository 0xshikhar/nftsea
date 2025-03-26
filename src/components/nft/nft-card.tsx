import Image from "next/image"
import Link from "next/link"
import { formatEther } from "viem"
import { Heart, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NFTCardProps {
    nft: {
        id: string
        name: string
        image: string
        price: bigint
        currency: string
        chain: string
        ownerAddress: string
        ownerName?: string
        ownerImage?: string
        collectionName: string
        collectionAddress: string
        isVerified?: boolean
    }
}

export function NFTCard({ nft }: NFTCardProps) {
    return (
        <Link href={`/nft/${nft.id}`}>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <Image
                        src={nft.image}
                        alt={nft.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-2 right-2">
                        <ChainBadge chain={nft.chain} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity hover:opacity-100" />
                    <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-3 left-3 opacity-0 bg-white/90 hover:bg-white transition-opacity hover:opacity-100 group-hover:opacity-100"
                        onClick={(e) => {
                            e.preventDefault()
                            // Buy action
                        }}
                    >
                        Quick Buy
                    </Button>
                </div>
                <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-base line-clamp-1">{nft.name}</CardTitle>
                            <CardDescription className="flex items-center text-xs">
                                {nft.collectionName}
                                {nft.isVerified && (
                                    <svg
                                        className="ml-1 h-3 w-3 text-blue-500"
                                        fill="none"
                                        height="24"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                )}
                            </CardDescription>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">More</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.preventDefault()
                                        // Add to favorites
                                    }}
                                >
                                    Add to favorites
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.preventDefault()
                                        // Share
                                    }}
                                >
                                    Share
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.preventDefault()
                                        // Report
                                    }}
                                >
                                    Report
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={nft.ownerImage} />
                                <AvatarFallback>{nft.ownerName?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-slate-500">
                                {nft.ownerName || nft.ownerAddress.substring(0, 6) + "..."}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                                e.preventDefault()
                                // Like
                            }}
                        >
                            <Heart className="h-4 w-4" />
                            <span className="sr-only">Like</span>
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 border-t">
                    <div className="flex justify-between items-center w-full">
                        <div>
                            <p className="text-xs text-slate-500">Price</p>
                            <p className="font-bold">
                                {formatEther(nft.price)} {nft.currency}
                            </p>
                        </div>
                        <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={(e) => {
                                e.preventDefault()
                                // View details
                            }}
                        >
                            View Details
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}

function ChainBadge({ chain }: { chain: string }) {
    const chainColors: Record<string, string> = {
        ethereum: "bg-blue-100 text-blue-800",
        polygon: "bg-purple-100 text-purple-800",
        arbitrum: "bg-blue-100 text-blue-800",
        optimism: "bg-red-100 text-red-800",
        base: "bg-teal-100 text-teal-800",
        sepolia: "bg-slate-100 text-slate-800",
    }

    return (
        <Badge variant="outline" className={`${chainColors[chain.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
            {chain}
        </Badge>
    )
} 