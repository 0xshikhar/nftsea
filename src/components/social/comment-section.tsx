"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAccount } from "wagmi"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long")
})

interface Comment {
    id: string
    content: string
    createdAt: string
    user: {
        address: string
        username: string
        avatarUrl: string
    }
}

interface CommentSectionProps {
    nftId: string
}

export function CommentSection({ nftId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { address } = useAccount()

    const form = useForm<z.infer<typeof commentSchema>>({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            content: ""
        }
    })

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setIsLoading(true)
                // TODO: Replace with actual API call
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500))

                // Mock data
                setComments([
                    {
                        id: "1",
                        content: "This is an amazing NFT!",
                        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                        user: {
                            address: "0x1234...",
                            username: "NFT Collector",
                            avatarUrl: "/placeholder-avatar.png"
                        }
                    },
                    {
                        id: "2",
                        content: "I really like the colors and composition.",
                        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        user: {
                            address: "0x5678...",
                            username: "Art Lover",
                            avatarUrl: "/placeholder-avatar.png"
                        }
                    }
                ])
            } catch (error) {
                console.error("Error fetching comments:", error)
                toast.error("Failed to load comments")
            } finally {
                setIsLoading(false)
            }
        }

        fetchComments()
    }, [nftId])

    const onSubmit = async (values: z.infer<typeof commentSchema>) => {
        if (!address) {
            toast.error("Please connect your wallet to comment")
            return
        }

        try {
            // TODO: Replace with actual API call
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))

            // Add new comment to the list
            const newComment: Comment = {
                id: Date.now().toString(),
                content: values.content,
                createdAt: new Date().toISOString(),
                user: {
                    address: address,
                    username: "You",
                    avatarUrl: "/placeholder-avatar.png"
                }
            }

            setComments(prev => [newComment, ...prev])
            form.reset()
            toast.success("Comment added successfully")
        } catch (error) {
            console.error("Error adding comment:", error)
            toast.error("Failed to add comment")
        }
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold">Comments ({comments.length})</h3>

            {/* Comment form */}
            {address && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add a comment..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                    </form>
                </Form>
            )}

            {/* Comments list */}
            <div className="space-y-4">
                {isLoading ? (
                    <p>Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="border rounded-lg p-4">
                            <div className="flex items-center mb-2">
                                <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={comment.user.avatarUrl} />
                                    <AvatarFallback>{comment.user.username.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{comment.user.username}</p>
                                    <p className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
} 