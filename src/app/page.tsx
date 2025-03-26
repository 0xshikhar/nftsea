import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { FeaturedNFTs } from "@/components/nft/featured-nfts"
import { TopCollections } from "@/components/nft/top-collections"
import { TrendingNFTs } from "@/components/nft/trending-nfts"
import { ChainSelector } from "@/components/blockchain/chain-selector"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_800px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover, Collect, and Sell NFTs on any chain
                </h1>
                <p className="max-w-[600px] text-slate-500 md:text-xl dark:text-slate-400">
                  NFTsea is the world&apos;s first cross-chain NFT marketplace built on Espresso Systems. Buy, sell, create and trade NFTs with ease.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/explore">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Explore NFTs</Button>
                </Link>
                <Link href="/create">
                  <Button variant="outline" className="border-blue-200 bg-white text-blue-600 hover:bg-blue-50">Create NFT</Button>
                </Link>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <ChainSelector />
                <span className="text-slate-500">— Trade across multiple blockchains</span>
              </div>
            </div>
            <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                <div className="grid gap-6 md:gap-8">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src="/nft-samples/nft1.webp"
                      alt="Featured NFT"
                      width={300}
                      height={300}
                      className="aspect-square object-cover w-full transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src="/nft-samples/nft2.webp"
                      alt="Featured NFT"
                      width={300}
                      height={300}
                      className="aspect-square object-cover w-full transition-transform hover:scale-105"
                    />
                  </div>
                </div>
                <div className="grid gap-6 md:gap-8 lg:mt-4">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src="/nft-samples/nft3.webp"
                      alt="Featured NFT"
                      width={300}
                      height={300}
                      className="aspect-square object-cover w-full transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src="/nft-samples/nft4.webp"
                      alt="Featured NFT"
                      width={300}
                      height={300}
                      className="aspect-square object-cover w-full transition-transform hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured NFTs Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Featured NFTs</h2>
              <p className="text-slate-500">Handpicked NFTs curated by our team</p>
            </div>
            <Link href="/explore" className="text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-8">
            <FeaturedNFTs />
          </div>
        </div>
      </section>

      {/* Top Collections Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Top Collections</h2>
              <p className="text-slate-500">The most popular collections across chains</p>
            </div>
            <Link href="/collections" className="text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-8">
            <TopCollections />
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-slate-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Trending NFTs</h2>
              <p className="text-slate-500">What&apos;s hot in the last 24 hours</p>
            </div>
            <Link href="/explore" className="text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-8">
            <TrendingNFTs />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">How NFTsea Works</h2>
            <p className="max-w-[85%] text-slate-500 md:text-xl">
              The first truly cross-chain NFT marketplace powered by Espresso Systems
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:gap-16 mt-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 13V7" />
                  <path d="M9 10h6" />
                  <path d="M9 10h6" />
                  <path d="M12 21.5a9.5 9.5 0 1 1 0-19 9.5 9.5 0 0 1 0 19Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Create & Mint</h3>
              <p className="text-slate-500">
                Create your NFT on your preferred blockchain with just a few clicks
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Buy & Trade</h3>
              <p className="text-slate-500">
                Trade NFTs across different blockchains without complicated bridging steps
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-900">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M21 12V7H5a2 2 0 0 0 0 4h14v4" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Collect & Earn</h3>
              <p className="text-slate-500">
                Build your cross-chain collection and earn from secondary sales royalties
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
