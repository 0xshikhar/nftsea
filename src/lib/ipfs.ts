// This is a simplified implementation for storing files on IPFS using Pinata
// In a production environment, you'd want to use a more robust solution

import axios from 'axios'
import FormData from 'form-data'

// Replace with your actual Pinata API keys
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || ''
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || ''

/**
 * Upload a file or object to IPFS using Pinata
 * @param data File object or JSON string to upload
 * @returns IPFS URL of the uploaded content
 */
export async function uploadToIPFS(data: File | string): Promise<string> {
    try {
        let response

        if (typeof data === 'string') {
            // If data is a string (JSON), upload as JSON
            response = await axios.post(
                'https://api.pinata.cloud/pinning/pinJSONToIPFS',
                JSON.parse(data),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        pinata_api_key: PINATA_API_KEY,
                        pinata_secret_api_key: PINATA_SECRET_API_KEY
                    }
                }
            )
        } else {
            // If data is a File object, upload it directly
            const formData = new FormData()
            formData.append('file', data)

            response = await axios.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                formData,
                {
                    maxBodyLength: Infinity,
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
                        pinata_api_key: PINATA_API_KEY,
                        pinata_secret_api_key: PINATA_SECRET_API_KEY
                    }
                }
            )
        }

        // Return the IPFS URL
        return `ipfs://${response.data.IpfsHash}`
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

    // Remove ipfs:// prefix and convert to HTTP URL using Pinata gateway
    const cid = ipfsUrl.substring(7)
    return `https://gateway.pinata.cloud/ipfs/${cid}`
} 