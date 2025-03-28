"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAccount } from "wagmi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Upload } from "lucide-react"
import { uploadToIPFS } from "@/lib/ipfs"
import { toast } from "sonner"

const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    bio: z.string().optional(),
    avatarFile: z.any().optional(),
    twitter: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
    website: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional()
})

export default function SettingsPage() {
    const { address, isConnected } = useAccount()
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string>()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            bio: "",
            twitter: "",
            website: ""
        }
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("avatarFile", file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (!address) {
            toast.error("Please connect your wallet")
            return
        }

        try {
            setIsUploading(true)

            let avatarUrl
            if (values.avatarFile) {
                avatarUrl = await uploadToIPFS(values.avatarFile)
            }

            // TODO: Replace with actual API call
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast.success("Profile updated successfully")
        } catch (error) {
            toast.error("Failed to update profile")
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    if (!isConnected) {
        return (
            <div className="container py-12">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>
                            Connect your wallet to update your profile settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-6">
                        <ConnectButton />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Profile</CardTitle>
                        <CardDescription>
                            Update your profile information visible to other users
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Avatar Upload */}
                                <div className="flex flex-col items-center space-y-4">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={previewUrl || "/placeholder-avatar.png"} />
                                        <AvatarFallback>
                                            {address ? address.substring(2, 4).toUpperCase() : "?"}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Input
                                            id="avatar"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="avatar">
                                            <Button type="button" variant="outline" className="cursor-pointer" asChild>
                                                <div className="flex items-center">
                                                    <Upload className="mr-2 h-4 w-4" />
                                                    Change Avatar
                                                </div>
                                            </Button>
                                        </label>
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Your username" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                This is your public display name
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us about yourself"
                                                    className="resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="twitter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Twitter</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://twitter.com/username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Website</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://your-website.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Saving..." : "Save Changes"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 