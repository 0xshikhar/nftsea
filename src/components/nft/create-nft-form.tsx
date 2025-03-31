"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAccount, useWriteContract } from "wagmi"
import { toast } from "sonner"
import { Upload, Plus, X } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NFT_CATEGORIES, FILE_TYPES, MAX_FILE_SIZE } from "@/lib/constants"
import { uploadToIPFS } from "@/lib/ipfs"
import { contractABIs, contractAddresses } from "@/lib/contracts"

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    supply: z.number().min(1).default(1),
    collectionId: z.string(),
    file: z.any().refine((file) => file?.length > 0, "File is required"),
    externalLink: z.string().url().optional(),
    category: z.string(),
    traits: z.array(z.object({
        trait_type: z.string(),
        value: z.string()
    })).optional()
})

export function CreateNFTForm() {
    const [isUploading, setIsUploading] = useState(false)
    const [traits, setTraits] = useState<{ trait_type: string; value: string }[]>([])
    const { address } = useAccount()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            supply: 1,
            category: NFT_CATEGORIES[0]
        }
    })

    const { writeContract } = useWriteContract()

    const addTrait = () => {
        setTraits([...traits, { trait_type: "", value: "" }])
    }

    const removeTrait = (index: number) => {
        setTraits(traits.filter((_, i) => i !== index))
    }

    const updateTrait = (index: number, field: "trait_type" | "value", value: string) => {
        const newTraits = [...traits]
        newTraits[index][field] = value
        setTraits(newTraits)
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsUploading(true)

            // Validate file type and size
            const file = values.file[0]
            if (!Object.values(FILE_TYPES).flat().includes(file.type)) {
                toast.error("Invalid file type")
                return
            }

            if (file.size > MAX_FILE_SIZE) {
                toast.error("File size too large")
                return
            }

            // Upload file to IPFS
            const fileUrl = await uploadToIPFS(file)

            // Create NFT metadata
            const metadata = {
                name: values.name,
                description: values.description,
                image: fileUrl,
                external_url: values.externalLink,
                attributes: traits.length > 0 ? traits : undefined
            }

            // Upload metadata to IPFS
            const metadataUrl = await uploadToIPFS(JSON.stringify(metadata))

            // Mint NFT
            const hash = await writeContract({
                address: contractAddresses.nft as `0x${string}`,
                abi: [contractABIs.nft],
                functionName: "mint",
                args: [values.collectionId, values.supply, metadataUrl]
            })

            toast.success("NFT created successfully!")
            form.reset()
            setTraits([])
        } catch (error) {
            toast.error("Failed to create NFT")
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* File Upload */}
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                            <FormLabel>Upload File</FormLabel>
                            <FormControl>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Images, Video, or Audio (MAX. 100MB)
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept={Object.values(FILE_TYPES).flat().join(",")}
                                            onChange={(e) => onChange(e.target.files)}
                                            {...field}
                                        />
                                    </label>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Other form fields */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter NFT name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="supply"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Supply</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder="Enter supply"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe your NFT" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Properties/Traits */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <FormLabel>Properties</FormLabel>
                        <Button type="button" variant="outline" size="sm" onClick={addTrait}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Property
                        </Button>
                    </div>

                    {traits.map((trait, index) => (
                        <div key={index} className="flex gap-4">
                            <Input
                                placeholder="Property name"
                                value={trait.trait_type}
                                onChange={(e) => updateTrait(index, "trait_type", e.target.value)}
                            />
                            <Input
                                placeholder="Property value"
                                value={trait.value}
                                onChange={(e) => updateTrait(index, "value", e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTrait(index)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isUploading || !address}
                >
                    {isUploading ? "Creating NFT..." : "Create NFT"}
                </Button>
            </form>
        </Form>
    )
} 