// This is a simplified implementation for storing files on IPFS
// In a production environment, you'd want to use a more robust solution

import { NFTStorage } from 'nft.storage'

// Replace with your actual NFT.Storage API key
const NFT_STORAGE_API_KEY = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || 'your-api-key-here'

const client = new NFTStorage({ token: NFT_STORAGE_API_KEY })

/**
 * Upload a file or object to IPFS using NFT.Storage
 * @param data File object or JSON string to upload
 * @returns IPFS URL of the uploaded content
 */
export async function uploadToIPFS(data: File | string): Promise<string> {
    try {
        let cid

        if (typeof data === 'string') {
            // If data is a string (JSON), create a blob and upload it
            const blob = new Blob([data], { type: 'application/json' })
            const file = new File([blob], 'metadata.json', { type: 'application/json' })
            const result = await client.storeBlob(file)
            cid = result
        } else {
            // If data is a File object, upload it directly
            const result = await client.storeBlob(data)
            cid = result
        }

        // Return the IPFS URL
        return `ipfs://${cid}`
    } catch (error) {
        console.error('Error uploading to IPFS:', error)
        throw new Error('Failed to upload to IPFS')
    }
}

/**
 * Convert an IPFS URL to an HTTP URL for browser display
 * @param ipfsUrl IPFS URL (ipfs://...)
 * @returns HTTP URL for the same content
 */
export function ipfsToHttp(ipfsUrl: string): string {
    if (!ipfsUrl || !ipfsUrl.startsWith('ipfs://')) {
        return ipfsUrl
    }

    // Remove ipfs:// prefix and convert to HTTP URL
    const cid = ipfsUrl.substring(7)
    return `https://nftstorage.link/ipfs/${cid}`
} 