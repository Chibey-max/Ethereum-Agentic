// Chain configuration for Arbitrum Agent Kit
// Supports: Arbitrum Sepolia (testnet), Robinhood Chain (testnet), Arbitrum One (mainnet)

export interface ChainConfig {
  id: number
  name: string
  shortName: string
  rpcUrl: string
  explorerUrl: string
  explorerName: string
  isTestnet: boolean
  isMainnet: boolean
  faucetUrl: string | null
  badge: 'TESTNET' | 'MAINNET'
  badgeColor: string
  warning?: string
  features: string[]
}

export const CHAINS: Record<number, ChainConfig> = {
  421614: {
    id: 421614,
    name: 'Arbitrum Sepolia',
    shortName: 'Arb Sepolia',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorerUrl: 'https://sepolia.arbiscan.io',
    explorerName: 'Arbiscan',
    isTestnet: true,
    isMainnet: false,
    faucetUrl: 'https://arbitrum.faucet.dev/',
    badge: 'TESTNET',
    badgeColor: '#00d4aa',
    features: ['agent_transfers', 'spending_limits', 'guardian', 'mcp', 'whitelist', 'token_policy'],
  },
  46630: {
    id: 46630,
    name: 'Robinhood Chain',
    shortName: 'Robinhood',
    rpcUrl: 'https://rpc.testnet.chain.robinhood.com',
    explorerUrl: 'https://explorer.testnet.chain.robinhood.com',
    explorerName: 'RH Explorer',
    isTestnet: true,
    isMainnet: false,
    faucetUrl: 'https://faucet.testnet.chain.robinhood.com/',
    badge: 'TESTNET',
    badgeColor: '#00c851',
    features: ['agent_transfers', 'spending_limits', 'guardian', 'mcp', 'whitelist', 'token_policy'],
  },
  42161: {
    id: 42161,
    name: 'Arbitrum One',
    shortName: 'Arb One',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    explorerName: 'Arbiscan',
    isTestnet: false,
    isMainnet: true,
    faucetUrl: null,
    badge: 'MAINNET',
    badgeColor: '#ff6b35',
    warning: 'Mainnet — real ETH required. Deploy your own AgentWallet contract first.',
    features: ['agent_transfers', 'spending_limits', 'guardian', 'mcp', 'whitelist', 'token_policy'],
  },
  11155111: {
    id: 11155111,
    name: 'Ethereum Sepolia',
    shortName: 'Sepolia',
    rpcUrl: 'https://rpc.ankr.com/eth_sepolia',
    explorerUrl: 'https://sepolia.etherscan.io',
    explorerName: 'Etherscan',
    isTestnet: true,
    isMainnet: false,
    faucetUrl: 'https://sepoliafaucet.com/',
    badge: 'TESTNET',
    badgeColor: '#627eea',
    features: ['agent_transfers', 'spending_limits', 'guardian', 'mcp', 'whitelist', 'token_policy'],
  },
}

export const DEFAULT_CHAIN_ID = parseInt(
  process.env.NEXT_PUBLIC_CHAIN_ID || '421614'
)

export function getChain(chainId?: number): ChainConfig {
  const id = chainId ?? DEFAULT_CHAIN_ID
  const chain = CHAINS[id]
  if (!chain) {
    // Default to Arbitrum Sepolia if unknown
    return CHAINS[421614]
  }
  return chain
}

export function getExplorerTxUrl(chainId: number, txHash: string): string {
  const chain = getChain(chainId)
  return `${chain.explorerUrl}/tx/${txHash}`
}

export function getExplorerAddressUrl(chainId: number, address: string): string {
  const chain = getChain(chainId)
  return `${chain.explorerUrl}/address/${address}`
}

// Network capability matrix — shown in dashboard and README
export const CAPABILITY_MATRIX = [
  { feature: 'Deploy AgentWallet.sol', arb_sep: '✅ Deployed', robinhood: '✅ Deployed', arb_one: '⚙️ User deploys' },
  { feature: 'AI agent ETH transfers', arb_sep: '✅', robinhood: '✅', arb_one: '✅' },
  { feature: 'Spending limit enforcement', arb_sep: '✅', robinhood: '✅', arb_one: '✅' },
  { feature: 'Guardian kill switch', arb_sep: '✅', robinhood: '✅', arb_one: '✅' },
  { feature: 'MCP server (Claude/Cursor)', arb_sep: '✅', robinhood: '✅', arb_one: '✅' },
  { feature: 'ArbSys L2 block tracking', arb_sep: '✅ Native', robinhood: '✅ Native', arb_one: '✅ Native' },
  { feature: 'Contract verified on explorer', arb_sep: '✅ Arbiscan', robinhood: '✅ RH Explorer', arb_one: '⚙️ After user deploy' },
  { feature: 'Real funds', arb_sep: '❌ testnet', robinhood: '❌ testnet', arb_one: '✅ real ETH' },
  { feature: 'Recommended for', arb_sep: 'Demos & judges', robinhood: 'Prize track', arb_one: 'Production users' },
]
