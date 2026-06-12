import path from "node:path"
import * as dotenv from "dotenv"

const envPath = path.resolve(__dirname, "../.env")
dotenv.config({ path: envPath, override: false })

export const DEFAULT_CHAIN_ID = 11155111

function normalize(name: string, value?: string): string | undefined {
  const v = value?.trim()
  if (!v) return undefined

  if (name === "AGENT_PRIVATE_KEY") {
    return v.startsWith("0x") ? v : `0x${v}`
  }

  return v
}

export function optionalEnv(name: string): string | undefined {
  return normalize(name, process.env[name])
}

export function requireEnv(name: string): string {
  const value = optionalEnv(name)
  if (!value) {
    throw new Error(`${name} is missing. Expected it in ${envPath}`)
  }
  return value
}

export function requireHex(name: string, bytes: number): `0x${string}` {
  const value = requireEnv(name)
  const expectedLength = 2 + bytes * 2
  if (!/^0x[0-9a-fA-F]+$/.test(value) || value.length !== expectedLength) {
    throw new Error(`${name} must be ${bytes} bytes: 0x + ${bytes * 2} hex characters`)
  }
  return value as `0x${string}`
}

export function requirePrivateKey(name: string): `0x${string}` {
  return requireHex(name, 32)
}

export function requireAddress(name: string): `0x${string}` {
  return requireHex(name, 20)
}

export function getChainId(): number {
  const raw = optionalEnv("CHAIN_ID")
  if (!raw) return DEFAULT_CHAIN_ID
  const parsed = Number(raw)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid CHAIN_ID: ${raw}`)
  }
  return parsed
}

export function getRpcUrl(): string {
  // Backward compatibility for old runtime envs
  const rpc = optionalEnv("RPC_URL") ?? optionalEnv("ALCHEMY_RPC_URL")
  if (!rpc) {
    throw new Error(`RPC_URL is missing. Expected it in ${envPath}`)
  }
  return rpc
}

export function getRuntimeEnvPath(): string {
  return envPath
}

export interface ChainConfig {
  chainId: number
  rpcUrl: string
  contractAddress: string
  chainName: string
  explorerUrl: string
  isTestnet: boolean
}

const CHAIN_CONFIGS: Record<number, {
  rpcEnvs: string[]
  contractEnvs: string[]
  chainName: string
  explorerUrl: string
  isTestnet: boolean
}> = {
  421614: {
    rpcEnvs: ['ARBITRUM_SEPOLIA_RPC_URL', 'RPC_URL'],
    contractEnvs: ['ARBITRUM_SEP_CONTRACT_ADDRESS', 'AGENT_CONTRACT_ADDRESS'],
    chainName: 'Arbitrum Sepolia',
    explorerUrl: 'https://sepolia.arbiscan.io',
    isTestnet: true,
  },
  46630: {
    rpcEnvs: ['ROBINHOOD_RPC_URL'],
    contractEnvs: ['ROBINHOOD_CONTRACT_ADDRESS'],
    chainName: 'Robinhood Chain Testnet',
    explorerUrl: 'https://explorer.testnet.chain.robinhood.com',
    isTestnet: true,
  },
  42161: {
    rpcEnvs: ['ARBITRUM_ONE_RPC_URL'],
    contractEnvs: ['ARBITRUM_ONE_CONTRACT_ADDRESS'],
    chainName: 'Arbitrum One',
    explorerUrl: 'https://arbiscan.io',
    isTestnet: false,
  },
  11155111: {
    rpcEnvs: ['SEPOLIA_RPC_URL', 'RPC_URL'],
    contractEnvs: ['SEPOLIA_CONTRACT_ADDRESS', 'AGENT_CONTRACT_ADDRESS'],
    chainName: 'Ethereum Sepolia',
    explorerUrl: 'https://sepolia.etherscan.io',
    isTestnet: true,
  },
}

export function getChainConfig(): ChainConfig {
  const chainId = getChainId()
  const cfg = CHAIN_CONFIGS[chainId]

  if (!cfg) {
    throw new Error(
      `Unsupported CHAIN_ID: ${chainId}. Supported: ${Object.keys(CHAIN_CONFIGS).join(', ')}`
    )
  }

  // Find first set RPC URL
  let rpcUrl: string | undefined
  for (const envKey of cfg.rpcEnvs) {
    rpcUrl = optionalEnv(envKey)
    if (rpcUrl) break
  }
  if (!rpcUrl) {
    throw new Error(`No RPC URL found for chain ${chainId}. Set one of: ${cfg.rpcEnvs.join(', ')}`)
  }

  // Find first set contract address
  let contractAddress: string | undefined
  for (const envKey of cfg.contractEnvs) {
    contractAddress = optionalEnv(envKey)
    if (contractAddress && contractAddress !== '0x') break
  }
  if (!contractAddress || contractAddress === '0x') {
    throw new Error(
      `No contract address for chain ${chainId}. Set one of: ${cfg.contractEnvs.join(', ')}`
    )
  }

  return {
    chainId,
    rpcUrl,
    contractAddress: contractAddress as `0x${string}`,
    chainName: cfg.chainName,
    explorerUrl: cfg.explorerUrl,
    isTestnet: cfg.isTestnet,
  }
}
