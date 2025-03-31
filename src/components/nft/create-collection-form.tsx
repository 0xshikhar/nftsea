"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { toast } from "sonner"
import { Upload } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SUPPORTED_CHAINS } from "@/lib/constants"
import { uploadToIPFS } from "@/lib/ipfs"
import { contractABIs, contractAddresses } from "@/lib/contracts"

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    symbol: z.string().min(2, "Symbol must be at least 2 characters"),
    description: z.string().optional(),
    chainId: z.string(),
    logo: z.any().refine((file) => file?.length > 0, "Logo is required")
})

export function CreateCollectionForm() {
    const [isUploading, setIsUploading] = useState(false)
    const { address } = useAccount()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            symbol: "",
            description: "",
            chainId: Object.values(SUPPORTED_CHAINS)[0].toString()
        }
    })

    const { writeContract } = useWriteContract()

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsUploading(true)

            // Upload logo to IPFS
            const logoFile = values.logo[0]
            const logoUrl = await uploadToIPFS(logoFile)

            // Create collection metadata
            const metadata = {
                name: values.name,
                symbol: values.symbol,
                description: values.description,
                image: logoUrl,
                chainId: parseInt(values.chainId)
            }

            // Upload metadata to IPFS
            const metadataUrl = await uploadToIPFS(JSON.stringify(metadata))

            // Deploy collection contract
            const hash = await writeContract({
                address: contractAddresses.factoryProxy as `0x${string}`,
                abi: [contractABIs.nft],
                functionName: "createCollection",
                args: [values.name, values.symbol, metadataUrl]
            })

            toast.success("Collection created successfully!")
            form.reset()
        } catch (error) {
            toast.error("Failed to create collection")
            console.error(error)
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Collection Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter collection name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Symbol</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. BAYC" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe your collection" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="chainId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Chain</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select chain" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.entries(SUPPORTED_CHAINS).map(([name, id]) => (
                                        <SelectItem key={id} value={id.toString()}>
                                            {name.replace("_", " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="logo"
                    render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                            <FormLabel>Collection Logo</FormLabel>
                            <FormControl>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 100MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
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

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isUploading || !address}
                >
                    {isUploading ? "Creating Collection..." : "Create Collection"}
                </Button>
            </form>
        </Form>
    )
} 