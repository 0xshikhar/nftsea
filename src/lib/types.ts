export interface Chain {
    id: number
    name: string
    network: string
    nativeCurrency: {
        name: string
        symbol: string
        decimals: number
    }
    rpcUrls: {
        default: string
        public: string
    }
    blockExplorers: {
        default: { name: string; url: string }
    }
    testnet: boolean
}

export interface NFTMetadata {
    name: string
    description?: string
    image: string
    external_url?: string
    attributes?: {
        trait_type: string
        value: string | number
    }[]
}

export interface CollectionMetadata {
    name: string
    symbol: string
    description?: string
    image: string
    chainId: number
}

export interface ActionResponse<T = any> {
    data?: T
    error?: string
} 