"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { NFTGrid } from "@/components/nft/nft-grid"
import { CollectionGrid } from "@/components/collection/collection-grid"
import { EditProfileModal } from "@/components/profile/edit-profile-modal"
import { useAccount } from "wagmi"

export default function ProfilePage() {
    const { address } = useParams()
    const { address: connectedAddress } = useAccount()
    const [showEditModal, setShowEditModal] = useState(false)
    const isOwner = address === connectedAddress

    return (
        <div className="container py-8">
            {/* Profile Header */}
            <div className="relative h-48 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 mb-16">
                <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                    <Avatar className="w-24 h-24 border-4 border-white">
                        <AvatarImage src="/placeholder-avatar.png" />
                        <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div className="mb-2">
                        <h1 className="text-2xl font-bold text-white">Username</h1>
                        <p className="text-white/80">{address}</p>
                    </div>
                </div>
                {isOwner && (
                    <Button
                        variant="outline"
                        className="absolute top-4 right-4"
                        onClick={() => setShowEditModal(true)}
                    >
                        Edit Profile
                    </Button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">25</p>
                    <p className="text-sm text-gray-500">Items</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-gray-500">Collections</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">1.2K</p>
                    <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">500</p>
                    <p className="text-sm text-gray-500">Following</p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="owned">
                <TabsList>
                    <TabsTrigger value="owned">Owned</TabsTrigger>
                    <TabsTrigger value="created">Created</TabsTrigger>
                    <TabsTrigger value="collections">Collections</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="owned">
                    <NFTGrid
                        filters={{
                            owner: address as string
                        }}
                    />
                </TabsContent>

                <TabsContent value="created">
                    <NFTGrid
                        filters={{
                            creator: address as string
                        }}
                    />
                </TabsContent>

                <TabsContent value="collections">
                    <CollectionGrid
                        filters={{
                            creator: address as string
                        }}
                    />
                </TabsContent>

                <TabsContent value="activity">
                    <div className="space-y-4">
                        {/* Activity items will be mapped here */}
                    </div>
                </TabsContent>
            </Tabs>

            <EditProfileModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
            />
        </div>
    )
} 