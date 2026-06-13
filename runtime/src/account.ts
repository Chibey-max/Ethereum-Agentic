import { privateKeyToAccount } from "viem/accounts"
import { createPublicClient, createWalletClient, fallback, http, defineChain, type Chain } from "viem"
import { arbitrum, arbitrumSepolia, sepolia } from "viem/chains"
import { getChainId, getRpcUrl, requirePrivateKey } from "./env"

const robinhoodChain = defineChain({
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.testnet.chain.robinhood.com"] }, public: { http: ["https://rpc.testnet.chain.robinhood.com"] } },
  blockExplorers: { default: { name: "Robinhood Explorer", url: "https://explorer.testnet.chain.robinhood.com" } },
  testnet: true,
})

const CHAIN_MAP: Record<number, { chain: Chain; fallbackRpcs: string[]; explorerUrl: string }> = {
  [sepolia.id]: {
    chain: sepolia,
    fallbackRpcs: ["https://rpc.ankr.com/eth_sepolia", "https://sepolia.drpc.org"],
    explorerUrl: "https://sepolia.etherscan.io",
  },
  [arbitrumSepolia.id]: {
    chain: arbitrumSepolia,
    fallbackRpcs: ["https://sepolia-rollup.arbitrum.io/rpc"],
    explorerUrl: "https://sepolia.arbiscan.io",
  },
  [arbitrum.id]: {
    chain: arbitrum,
    fallbackRpcs: ["https://arb1.arbitrum.io/rpc"],
    explorerUrl: "https://arbiscan.io",
  },
  [robinhoodChain.id]: {
    chain: robinhoodChain,
    fallbackRpcs: ["https://rpc.testnet.chain.robinhood.com"],
    explorerUrl: "https://explorer.testnet.chain.robinhood.com",
  },
}

const chainId = getChainId()
const chainEntry = CHAIN_MAP[chainId]
if (!chainEntry) {
  throw new Error(`Unsupported CHAIN_ID=${chainId}. Supported: ${Object.keys(CHAIN_MAP).join(", ")}`)
}

const PRIMARY_RPC = getRpcUrl()

function uniqueRpcUrls(urls: string[]): string[] {
  return [...new Set(urls.map((u) => u.trim()).filter(Boolean))]
}

export const rpcUrls = uniqueRpcUrls([PRIMARY_RPC, ...chainEntry.fallbackRpcs])

const transport = fallback(
  rpcUrls.map((url) => http(url, { timeout: 15_000, retryCount: 2, retryDelay: 250 }))
)

export const publicClient = createPublicClient({
  chain: chainEntry.chain,
  transport,
})

export const agentAccount = privateKeyToAccount(requirePrivateKey("AGENT_PRIVATE_KEY"))

export const walletClient = createWalletClient({
  account: agentAccount,
  chain: chainEntry.chain,
  transport,
})

export function getExplorerTxUrl(txHash: `0x${string}`): string {
  return `${chainEntry.explorerUrl}/tx/${txHash}`
}
