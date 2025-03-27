import { nftABI } from "../../contract/abi/nftABI";
import { tokenMintABI } from "../../contract/abi/tokenMintABI";

// sepolia testnet
export const contractAddresses = {
    marketplaceProxy: process.env.NEXT_PUBLIC_MARKETPLACE_PROXY_ADDRESS || "",
    factoryProxy: process.env.NEXT_PUBLIC_FACTORY_PROXY_ADDRESS || "",
    profileProxy: process.env.NEXT_PUBLIC_PROFILE_PROXY_ADDRESS || "",
    nft: "0x73E2dCc244FA575C143F886b9804321b4C0061b4",
    tokenMint: "0x3BfaD8D88E5F8f86b9cA1A0A29bcb4f083D1E60A",
};

// block explorer - blockscout
export const blockExplorer = {
    nft: "https://eth-sepolia.blockscout.com/address/0x73E2dCc244FA575C143F886b9804321b4C0061b4?tab=contract",
    tokenMint: "https://eth-sepolia.blockscout.com/address/0x3BfaD8D88E5F8f86b9cA1A0A29bcb4f083D1E60A?tab=contract",
};

export const contractABIs = {
    nft: nftABI,
    tokenMint: tokenMintABI,
};

// NFT Factory Contract ABI (simplified)
export const factoryABI = [
    // Read functions
    {
        "inputs": [],
        "name": "getCollections",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    // Write functions
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_symbol",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_metadataURI",
                "type": "string"
            }
        ],
        "name": "createCollection",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

// NFT Collection Contract ABI (simplified)
export const collectionABI = [
    // Read functions
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    // Write functions
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            }
        ],
        "name": "mint",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

// Marketplace Contract ABI (simplified)
export const marketplaceABI = [
    // Read functions
    {
        "inputs": [],
        "name": "getListings",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "listingId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "nftContract",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "price",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "active",
                        "type": "bool"
                    }
                ],
                "internalType": "struct NFTMarketplace.Listing[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    // Write functions
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_nftContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            }
        ],
        "name": "listNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_listingId",
                "type": "uint256"
            }
        ],
        "name": "buyNFT",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
]

// Profile Contract ABI (simplified)
export const profileABI = [
    // Read functions
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_user",
                "type": "address"
            }
        ],
        "name": "getProfile",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "username",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "bio",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "avatar",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "twitter",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "website",
                        "type": "string"
                    }
                ],
                "internalType": "struct ProfileRegistry.Profile",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    // Write functions
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_username",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_bio",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_avatar",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_twitter",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_website",
                "type": "string"
            }
        ],
        "name": "setProfile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
