"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface MobileNavProps {
    navItems: {
        name: string
        href: string
    }[]
}

export function MobileNav({ navItems }: MobileNavProps) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <div className="px-7">
                    <Link
                        href="/"
                        className="flex items-center space-x-2"
                        onClick={() => setOpen(false)}
                    >
                        <Image
                            src="/logo.svg"
                            alt="NFTsea logo"
                            width={24}
                            height={24}
                            className="h-6 w-auto"
                        />
                        <span className="font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                            NFTsea
                        </span>
                    </Link>
                </div>
                <div className="mt-8 px-7">
                    <div className="flex flex-col space-y-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center text-sm font-medium text-slate-600 transition-colors hover:text-blue-600",
                                    pathname === item.href && "text-blue-600"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
} 