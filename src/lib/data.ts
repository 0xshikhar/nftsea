export const chains = [
    {
        id: "arbitrum",
        chainId: 42161,
        name: "Arbitrum",
        logo: "/chains/arbitrum.svg",
    },
    {
        id: "ethereum",
        chainId: 1,
        name: "Ethereum",
        logo: "/chains/ethereum.svg",
    },
    {
        id: "polygon",
        chainId: 137,
        name: "Polygon",
        logo: "/chains/polygon.svg",
    },
    {
        id: "optimism",
        chainId: 10,
        name: "Optimism",
        logo: "/chains/optimism.svg",
    },
    {
        id: "base",
        chainId: 8453,
        name: "Base",
        logo: "/chains/base.svg",
    },
    {
        id: "sepolia",
        chainId: 11155111,
        name: "Sepolia",
        logo: "/chains/ethereum.svg",
    },
]

export const mockNFTs = [
    {
        id: "101",
        name: "Cosmic Explorer #42",
        image: "/nft-samples/trending1.webp",
        price: BigInt(12 * 10 ** 18),
        currency: "ETH",
        chain: "Ethereum",
        ownerAddress: "0x9876543210abcdef1234567890abcdef12345678",
        ownerName: "CryptoVisionary",
        ownerImage: "/avatars/user5.png",
        collectionName: "Cosmic Voyagers",
        collectionAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        isVerified: true
    },
    {
        id: "102",
        name: "Virtual Soul #7",
        image: "/nft-samples/trending2.webp",
        price: BigInt(8.5 * 10 ** 18),
        currency: "ETH",
        chain: "Base",
        ownerAddress: "0x8765432109abcdef1234567890abcdef12345678",
        ownerName: "MetaCollector",
        ownerImage: "/avatars/user6.png",
        collectionName: "Digital Souls",
        collectionAddress: "0xfedcba0987654321fedcba0987654321fedcba09",
        isVerified: true
    },
    {
        id: "103",
        name: "Neon Tiger #13",
        image: "/nft-samples/trending3.webp",
        price: BigInt(5.2 * 10 ** 18),
        currency: "ETH",
        chain: "Optimism",
        ownerAddress: "0x7654321098abcdef1234567890abcdef12345678",
        ownerName: "NFTHunter",
        ownerImage: "/avatars/user7.png",
        collectionName: "Neon Horizons",
        collectionAddress: "0xabcdef1234567890abcdef1234567890abcdef15",
        isVerified: true
    },
    {
        id: "104",
        name: "Pixel Universe #99",
        image: "/nft-samples/trending4.webp",
        price: BigInt(3.8 * 10 ** 18),
        currency: "ETH",
        chain: "Polygon",
        ownerAddress: "0x6543210987abcdef1234567890abcdef12345678",
        ownerName: "PixelGod",
        ownerImage: "/avatars/user8.png",
        collectionName: "Futuristic Pixels",
        collectionAddress: "0x0123456789abcdef0123456789abcdef01234567",
        isVerified: false
    }
]

export const mockNFTChart = [
    {
        id: "1",
        name: "Cosmic Voyager #156",
        image: "/nft-samples/nft1.webp",
        price: BigInt(5 * 10 ** 18),
        currency: "ETH",
        chain: "Ethereum",
        ownerAddress: "0x1234567890abcdef1234567890abcdef12345678",
        ownerName: "0xCosmic",
        ownerImage: "/avatars/user1.png",
        collectionName: "Cosmic Voyagers",
        collectionAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
        isVerified: true
    },
    {
        id: "2",
        name: "Digital Dreamscape #42",
        image: "/nft-samples/nft2.webp",
        price: BigInt(2.5 * 10 ** 18),
        currency: "ETH",
        chain: "Optimism",
        ownerAddress: "0x1234567890abcdef1234567890abcdef12345679",
        ownerName: "ArtMaster",
        ownerImage: "/avatars/user2.png",
        collectionName: "Digital Dreamscapes",
        collectionAddress: "0xabcdef1234567890abcdef1234567890abcdef13",
        isVerified: true
    },
    {
        id: "3",
        name: "Abstract Realm #89",
        image: "/nft-samples/nft3.webp",
        price: BigInt(1.2 * 10 ** 18),
        currency: "ETH",
        chain: "Polygon",
        ownerAddress: "0x1234567890abcdef1234567890abcdef12345680",
        ownerName: "NFTWhale",
        ownerImage: "/avatars/user3.png",
        collectionName: "Abstract Realms",
        collectionAddress: "0xabcdef1234567890abcdef1234567890abcdef14",
        isVerified: false
    },
    {
        id: "4",
        name: "Neon Horizon #217",
        image: "/nft-samples/nft4.webp",
        price: BigInt(3.7 * 10 ** 18),
        currency: "ETH",
        chain: "Base",
        ownerAddress: "0x1234567890abcdef1234567890abcdef12345681",
        ownerName: "CryptoCreator",
        ownerImage: "/avatars/user4.png",
        collectionName: "Neon Horizons",
        collectionAddress: "0xabcdef1234567890abcdef1234567890abcdef15",
        isVerified: true
    }
]

export const mockCollections = [
    {
        id: "1",
        name: "Cosmic Voyagers",
        image: "/collections/cosmic.png",
        creator: "0xCosmic",
        creatorAddress: "0x1234567890abcdef1234567890abcdef12345678",
        floorPrice: 5.2,
        volume: 823.5,
        change: 12.4,
        items: 10000,
        isVerified: true,
        chain: "Ethereum"
    },
    {
        id: "2",
        name: "Digital Dreamscapes",
        image: "/collections/digital.png",
        creator: "ArtMaster",
        creatorAddress: "0x1234567890abcdef1234567890abcdef12345679",
        floorPrice: 2.1,
        volume: 421.8,
        change: -5.3,
        items: 5000,
        isVerified: true,
        chain: "Optimism"
    },
    {
        id: "3",
        name: "Abstract Realms",
        image: "/collections/abstract.png",
        creator: "NFTWhale",
        creatorAddress: "0x1234567890abcdef1234567890abcdef12345680",
        floorPrice: 1.8,
        volume: 315.7,
        change: 8.9,
        items: 7500,
        isVerified: false,
        chain: "Polygon"
    },
    {
        id: "4",
        name: "Neon Horizons",
        image: "/collections/neon.png",
        creator: "CryptoCreator",
        creatorAddress: "0x1234567890abcdef1234567890abcdef12345681",
        floorPrice: 3.5,
        volume: 623.2,
        change: 24.7,
        items: 8888,
        isVerified: true,
        chain: "Base"
    },
    {
        id: "5",
        name: "Futuristic Pixels",
        image: "/collections/pixel.png",
        creator: "PixelMaster",
        creatorAddress: "0x1234567890abcdef1234567890abcdef12345682",
        floorPrice: 0.8,
        volume: 127.4,
        change: -12.1,
        items: 12000,
        isVerified: false,
        chain: "Ethereum"
    }
]
