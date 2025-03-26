"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { chains } from "@/lib/data"

export function ChainSelector() {
    const [open, setOpen] = useState(false)
    const [selectedChain, setSelectedChain] = useState(chains[0])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex items-center justify-between w-[180px] border-blue-200 bg-white text-slate-700"
                >
                    <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 relative overflow-hidden rounded-full">
                            <Image
                                src={selectedChain.logo}
                                alt={selectedChain.name}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span>{selectedChain.name}</span>
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-0">
                <Command>
                    <CommandInput placeholder="Search chain..." />
                    <CommandEmpty>No chain found.</CommandEmpty>
                    <CommandGroup>
                        {chains.map((chain) => (
                            <CommandItem
                                key={chain.id}
                                value={chain.id}
                                onSelect={() => {
                                    setSelectedChain(chain)
                                    setOpen(false)
                                }}
                                className="cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <div className="w-5 h-5 mr-2 relative overflow-hidden rounded-full">
                                        <Image
                                            src={chain.logo}
                                            alt={chain.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <span>{chain.name}</span>
                                </div>
                                <Check
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        selectedChain.id === chain.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
} 