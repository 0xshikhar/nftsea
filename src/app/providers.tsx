'use client';

import * as React from 'react';
import '@rainbow-me/rainbowkit/styles.css';

import {
    getDefaultConfig,
    RainbowKitProvider,
    connectorsForWallets,
    getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import {
    argentWallet,
    trustWallet,
    ledgerWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { WagmiProvider } from 'wagmi';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import 'dotenv/config'

import {
    arbitrumSepolia,
    sepolia,
    arbitrum,
    mainnet,
} from 'wagmi/chains';

const projectId = '9811958bd307518b364ff7178034c435';


const config = getDefaultConfig({
    appName: 'NFTsea',
    projectId: projectId,
    chains: [arbitrumSepolia, sepolia, arbitrum, mainnet],
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const demoAppInfo = {
    appName: 'NFTsea',
};

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {mounted ? (
                    <RainbowKitProvider appInfo={demoAppInfo}>
                        {children}
                    </RainbowKitProvider>
                ) : (
                    <div style={{ visibility: "hidden" }}>
                        {children}
                    </div>
                )}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
