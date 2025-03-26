import Link from "next/link"
import Image from "next/image"
import { FaDiscord, FaTwitter, FaInstagram, FaGithub, FaGlobe } from "react-icons/fa"

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="container py-8 md:py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-flex items-center space-x-2">
                            <Image
                                src="/logo.svg"
                                alt="NFTsea logo"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                            />
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                                NFTsea
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-slate-600 max-w-md">
                            The world&apos;s first cross-chain NFT marketplace with seamless trading across multiple blockchains powered by Espresso Systems.
                        </p>
                        <div className="mt-4 flex space-x-4">
                            <Link href="#" className="text-slate-500 hover:text-blue-600">
                                <FaTwitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-slate-500 hover:text-blue-600">
                                <FaInstagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-slate-500 hover:text-blue-600">
                                <FaDiscord className="h-5 w-5" />
                                <span className="sr-only">Discord</span>
                            </Link>
                            <Link href="#" className="text-slate-500 hover:text-blue-600">
                                <FaGithub className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Marketplace</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link href="/explore" className="text-slate-600 hover:text-blue-600">
                                    Explore
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections" className="text-slate-600 hover:text-blue-600">
                                    Collections
                                </Link>
                            </li>
                            <li>
                                <Link href="/create" className="text-slate-600 hover:text-blue-600">
                                    Create
                                </Link>
                            </li>
                            <li>
                                <Link href="/stats" className="text-slate-600 hover:text-blue-600">
                                    Stats
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Resources</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link href="/help" className="text-slate-600 hover:text-blue-600">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/platform" className="text-slate-600 hover:text-blue-600">
                                    Platform Status
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-slate-600 hover:text-blue-600">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/docs" className="text-slate-600 hover:text-blue-600">
                                    Developers
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold">Company</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="text-slate-600 hover:text-blue-600">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-slate-600 hover:text-blue-600">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-slate-600 hover:text-blue-600">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-slate-600 hover:text-blue-600">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} NFTsea. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <Link href="#" className="text-xs text-slate-500 hover:text-blue-600">
                            <FaGlobe className="h-4 w-4 inline-block mr-1" />
                            <span>English (US)</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
} 