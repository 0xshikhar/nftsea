"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { WalletConnect } from "@/components/blockchain/wallet-connect"
import { MobileNav } from "./mobile-nav"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
export function Header() {
    const [searchQuery, setSearchQuery] = useState("")
    const pathname = usePathname()
    const { address, isConnected } = useAccount()

    const navItems = [
        { name: "Explore", href: "/explore" },
        { name: "Collections", href: "/collections" },
        { name: "Create", href: "/create" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between py-4">
                <div className="flex items-center gap-2 md:gap-10">
                    <Link href="/" className="hidden items-center space-x-2 md:flex">
                        <Image
                            src="/logo.png"
                            alt="NFTsea logo"
                            width={32}
                            height={32}
                            className="h-8 w-auto"
                        />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                            NFTsea
                        </span>
                    </Link>

                    <MobileNav navItems={navItems} />

                    <nav className="hidden gap-6 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-blue-600",
                                    pathname === item.href
                                        ? "text-blue-600"
                                        : "text-slate-600"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center w-[300px] md:w-[400px] lg:w-[600px] px-5 relative hidden md:flex ">
                    <Search className="absolute left-7 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        type="search"
                        placeholder="Collections and NFTs..."
                        className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && searchQuery.trim())
                                window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
                        }}
                    />
                </div>

                <div className="flex gap-2">
                    {isConnected && (
                        <>
                            <Link href="/settings" className="flex items-center">
                                <Button variant="ghost" size="icon">
                                    <Settings className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href={`/profile/${address}`} className="flex items-center">
                                <Button variant="ghost" size="icon">
                                    <User className="h-4 w-4" />
                                </Button>

                            </Link>
                        </>
                    )}

                    <div className="flex">
                        <ConnectButton />
                    </div>
                </div>


            </div>
        </header>
    )
}