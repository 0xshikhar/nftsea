import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import type { HardhatUserConfig } from "hardhat/config";
import { vars } from "hardhat/config";
import type { NetworkUserConfig } from "hardhat/types";

import "./tasks/accounts";

// Run 'npx hardhat vars setup' to see the list of variables that need to be set

const privateKey: string = vars.get("PRIVATE_KEY");

const chainIds = {
  "arbitrum-mainnet": 42161,
  avalanche: 43114,
  bsc: 56,
  ganache: 1337,
  hardhat: 31337,
  mainnet: 1,
  "optimism-mainnet": 10,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
  sepolia: 11155111,
  celo: 42220,
  celoTestnet: 44787,
};

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string;
  switch (chain) {
    case "avalanche":
      jsonRpcUrl = "https://api.avax.network/ext/bc/C/rpc";
      break;
    case "bsc":
      jsonRpcUrl = "https://bsc-dataseed1.binance.org";
      break;
    case "celo":
      jsonRpcUrl = "https://rpc.celo.org";
      break;

    case "sepolia":
      jsonRpcUrl = "https://eth-sepolia.g.alchemy.com/v2/WddzdzI2o9S3COdT73d5w6AIogbKq4X-";
      break;
    case "celoTestnet":
      jsonRpcUrl = "https://alfajores-forno.celo-testnet.org";
      break;
    default:
      jsonRpcUrl = "https://" + chain + ".infura.io/v3/" + vars.get("INFURA_API_KEY");
  }
  return {
    accounts: [privateKey],
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      arbitrumOne: vars.get("ARBISCAN_API_KEY", ""),
      avalanche: vars.get("SNOWTRACE_API_KEY", ""),
      bsc: vars.get("BSCSCAN_API_KEY", ""),
      mainnet: vars.get("ETHERSCAN_API_KEY", ""),
      optimisticEthereum: vars.get("OPTIMISM_API_KEY", ""),
      polygon: vars.get("POLYGONSCAN_API_KEY", ""),
      polygonMumbai: vars.get("POLYGONSCAN_API_KEY", ""),
      sepolia: vars.get("ETHERSCAN_API_KEY", ""),
    },
  },
  gasReporter: {
    currency: "USD",
    enabled: process.env.REPORT_GAS ? true : false,
    excludeContracts: [],
    src: "./contracts",
  },
  networks: {
    hardhat: {
      accounts: {
        mnemonic: vars.get("MNEMONIC"),
      },
      chainId: chainIds.hardhat,
    },
    ganache: {
      accounts: {
        mnemonic: vars.get("MNEMONIC"),
      },
      chainId: chainIds.ganache,
      url: "http://localhost:8545",
    },
    celo: getChainConfig("celo"),
    sepolia: getChainConfig("sepolia"),
    celoTestnet: getChainConfig("celoTestnet"),
    arbitrum: getChainConfig("arbitrum-mainnet"),
    avalanche: getChainConfig("avalanche"),
    bsc: getChainConfig("bsc"),
    mainnet: getChainConfig("mainnet"),
    optimism: getChainConfig("optimism-mainnet"),
    "polygon-mainnet": getChainConfig("polygon-mainnet"),
    "polygon-mumbai": getChainConfig("polygon-mumbai"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.20",
    settings: {
      metadata: {
        bytecodeHash: "none",
      },
      optimizer: {
        enabled: true,
        runs: 100,
      },
      viaIR: true,
    },
  },
  typechain: {
    outDir: "types",
    target: "ethers-v6",
  },
};

export default config;
