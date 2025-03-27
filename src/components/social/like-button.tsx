"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAccount } from "wagmi"
import { toast } from "sonner"

interface LikeButtonProps {
    nftId: string
    initialLikes?: number
    initialLiked?: boolean
    size?: "sm" | "md" | "lg"
}

export function LikeButton({
    nftId,
    initialLikes = 0,
    initialLiked = false,
    size = "md"
}: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes)
    const [liked, setLiked] = useState(initialLiked)
    const [isLoading, setIsLoading] = useState(false)
    const { address } = useAccount()

    const handleLike = async () => {
        if (!address) {
            toast.error("Please connect your wallet to like NFTs")
            return
        }

        try {
            setIsLoading(true)

            // TODO: Replace with actual API call
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            if (liked) {
                setLikes(prev => prev - 1)
            } else {
                setLikes(prev => prev + 1)
            }
            setLiked(!liked)
        } catch (error) {
            toast.error("Failed to update like status")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const sizes = {
        sm: {
            button: "h-8 w-8",
            icon: "h-4 w-4",
            text: "text-xs"
        },
        md: {
            button: "h-10 w-10",
            icon: "h-5 w-5",
            text: "text-sm"
        },
        lg: {
            button: "h-12 w-12",
            icon: "h-6 w-6",
            text: "text-base"
        }
    }

    return (
        <div className="flex items-center">
            <Button
                variant={liked ? "default" : "ghost"}
                size="icon"
                className={`${sizes[size].button} ${liked ? "bg-red-100 hover:bg-red-200 text-red-500" : ""}`}
                onClick={handleLike}
                disabled={isLoading}
            >
                <Heart
                    className={`${sizes[size].icon} ${liked ? "fill-red-500" : ""}`}
                />
            </Button>
            <span className={`${sizes[size].text} ml-1`}>{likes}</span>
        </div>
    )
} 