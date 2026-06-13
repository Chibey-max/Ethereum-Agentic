# Arbitrum Agent Kit

> The first MCP-compatible autonomous AI agent framework on Arbitrum — with on-chain safety enforced by `AgentWallet.sol`

Built for the [Arbitrum Open House London Buildathon](https://www.hackquest.io/hackathons/Arbitrum-Open-House-London-Online-Buildathon) · Best Agentic Project Track

---

## What It Does

Arbitrum Agent Kit lets any AI assistant — Claude, GPT, Gemini — autonomously execute DeFi operations on Arbitrum and Robinhood Chain, with every action enforced at the smart contract level before it hits the chain.

```
User → Claude Desktop → MCP Server → AgentWallet.sol → Arbitrum One / Robinhood Chain
                                           ↑
                              enforces: spending limits
                                         whitelist
                                         guardian kill switch
                                         daily limits
                                         ArbSys L2 block tracking
```

**The safety layer between AI and money.** No unconstrained agent can move funds without explicit guardian-approved policies — enforced 100% on-chain.

---

## Deployed Contracts

| Chain | Address | Explorer |
|-------|---------|---------|
| Arbitrum Sepolia | `0xE8C8b0AF7C0247bD007Fe93d08828E44eC298D75` | [Arbiscan](https://sepolia.arbiscan.io/address/0xE8C8b0AF7C0247bD007Fe93d08828E44eC298D75) |
| Robinhood Chain Testnet | `0xE8C8b0AF7C0247bD007Fe93d08828E44eC298D75` | [RH Explorer](https://explorer.testnet.chain.robinhood.com/address/0xE8C8b0AF7C0247bD007Fe93d08828E44eC298D75) |
| Ethereum Sepolia (original) | `0xE49A6044D47De19504B73aA36F31899843B05259` | [Etherscan](https://sepolia.etherscan.io/address/0xE49A6044D47De19504B73aA36F31899843B05259) |

---

## Network Capability Matrix

| Feature | Arbitrum Sepolia | Robinhood Chain | Arbitrum One |
|---------|:---:|:---:|:---:|
| AgentWallet deployed | ✅ | ✅ | ⚙️ user deploys |
| AI agent ETH transfers | ✅ | ✅ | ✅ |
| Spending limit enforcement | ✅ | ✅ | ✅ |
| Guardian kill switch | ✅ | ✅ | ✅ |
| MCP server (Claude/Cursor/Kiro) | ✅ | ✅ | ✅ |
| ArbSys L2 block tracking | ✅ native | ✅ native | ✅ native |
| Contract verified on explorer | ✅ Arbiscan | ✅ RH Explorer | ⚙️ after user deploy |
| Real funds | ❌ testnet | ❌ testnet | ✅ real ETH |
| Recommended for | Demos & judges | Prize track | Production |

---

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Git**
- **An AI provider key** (pick one — all free tier):
  - [Groq](https://console.groq.com) — fastest, recommended
  - [OpenRouter](https://openrouter.ai)
  - [Google Gemini](https://aistudio.google.com)
- **Claude Desktop** (for MCP usage) — [claude.ai/download](https://claude.ai/download)
- **A wallet with testnet ETH** on Arbitrum Sepolia — get free ETH at [arbitrum.faucet.dev](https://arbitrum.faucet.dev/)

---

## How to Run (5 minutes)

### Step 1 — Clone the repo

```bash
git clone https://github.com/Chibey-max/Ethereum-Agentic.git -b arbitrum
cd Ethereum-Agentic
```

### Step 2 — Set up the runtime

```bash
cd runtime
cp .env.example .env
```

Edit `.env` with your values. The contract is already deployed — just fill in your keys:

```env
CHAIN_ID=421614

# Use the already-deployed contract on Arbitrum Sepolia:
AGENT_CONTRACT_ADDRESS=0xE8C8b0AF7C0247bD007Fe93d08828E44eC298D75

# Your wallet's private key (this wallet must be set as the "agent" role in the contract)
AGENT_PRIVATE_KEY=0x...

# Free at console.groq.com
GROQ_API_KEY=gsk_...

# RPC (free, no signup needed)
RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
```

> **Note:** The deployed contract's `agent` role is set to a specific address. To use the demo contract, your wallet must match that address, or you can deploy your own (see [Deploy Your Own](#deploy-your-own) below).

```bash
npm install
npm run build
```

### Step 3 — Connect to Claude Desktop (MCP)

```bash
npm run setup
```

This prints your MCP config. Add it to Claude Desktop:

- **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "arbitrum-agent": {
      "command": "node",
      "args": ["/full/path/to/Ethereum-Agentic/runtime/dist/mcp-server.js"]
    }
  }
}
```

Restart Claude Desktop. You should see "arbitrum-agent" appear in the tools list.

### Step 4 — Try it

In Claude Desktop, type:

```
Check my agent wallet state on Arbitrum
```

Claude will call `get_wallet_state` and return live data from the chain — balance, limits, paused status, chain ID.

```
What's my remaining daily ETH limit?
```

```
Show me recent transaction history
```

### Step 5 — Run the dashboard (optional)

```bash
cd dashboard
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_CONTRACT_ADDRESS=0xE8C8b0AF7C0247bD007Fe93d08828E44eC298D75
NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_GUARDIAN_ADDRESS=0xd9100b701e21fC578BFD937AC2DbDfb5bbD42572
```

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — live contract state, spending meter, transaction history with Arbiscan links, chain selector.

---

## Understanding the Roles

The `AgentWallet` contract has two roles:

| Role | Who | Can do |
|------|-----|--------|
| **Agent** | AI / MCP server | Call `execute()` to send ETH or tokens — within policy |
| **Guardian** | You (the owner) | Set spending limits, whitelist addresses, pause/unpause, withdraw |

**Important:** Before the agent can send ETH anywhere, the **guardian must whitelist the recipient**. This is the safety mechanism — the AI can only send to addresses you've explicitly approved.

To whitelist a recipient address from the dashboard: connect your guardian wallet → Whitelist Manager → Queue Call → wait 10 minutes → Apply.

---

## Deploy Your Own Contract

If you want to deploy a fresh `AgentWallet` where you control the agent role:

```bash
# Install Foundry: https://getfoundry.sh
cd contracts
cp .env.example .env
# Fill AGENT_ADDRESS, GUARDIAN_ADDRESS, PRIVATE_KEY, ARBISCAN_API_KEY

forge script script/Deploy.s.sol --rpc-url arbitrum_sepolia --private-key $PRIVATE_KEY --broadcast -vvv

# Verify on Arbiscan
forge verify-contract <DEPLOYED_ADDRESS> src/AgentWallet.sol:AgentWallet \
  --chain-id 421614 --etherscan-api-key $ARBISCAN_API_KEY
```

Then update `AGENT_CONTRACT_ADDRESS` in `runtime/.env` and `NEXT_PUBLIC_CONTRACT_ADDRESS` in `dashboard/.env.local`.

---

## Available Agent Tools

| Tool | What it does |
|------|-------------|
| `get_wallet_state` | Balance, limits, paused status, chain info |
| `transfer_eth` | Send ETH to a whitelisted address |
| `transfer_token` | Send ERC-20 within token policy |
| `check_limits` | Remaining daily ETH allowance |
| `get_tx_status` | Look up a tx by hash — returns Arbiscan link |
| `check_whitelist` | Check if an address + action is whitelisted |
| `get_pending_actions` | Timelocked actions with countdown |
| `get_transaction_history` | Recent on-chain activity |

---

## Use as an npm Package

```bash
npm install eth-agent-kit
```

```typescript
import { ETHAgent } from 'eth-agent-kit'

const agent = new ETHAgent({
  chainId: 421614,                                          // Arbitrum Sepolia
  contractAddress: '0xE8C8b0AF7C0247bD007Fe93d08828E44eC298D75',
  privateKey: process.env.AGENT_PRIVATE_KEY!,
  rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
  groqApiKey: process.env.GROQ_API_KEY,
})

const result = await agent.run('Check my wallet balance on Arbitrum')
console.log(result)
```

Supported `chainId` values: `421614` (Arb Sepolia), `46630` (Robinhood Chain), `42161` (Arb One), `11155111` (Eth Sepolia).

---

## Scaffold a New Project

```bash
npx create-eth-agent@latest my-agent
cd my-agent
cp .env.example .env   # fill in your keys
npm run build
npm run setup          # prints MCP config to add to Claude Desktop
```

---

## Arbitrum-Native Features

- **`ArbSys` precompile integration** — `AgentWallet.sol` uses `IArbSys(0x64).arbBlockNumber()` for L2-accurate block tracking and `arbChainID()` for chain verification. Falls back to `block.number` on non-Arbitrum chains.
- **`verifyArbitrumDeployment()`** — call this on Arbiscan to emit `ArbitrumChainVerified(chainId, l2Block)`, proving deployment on L2
- **Multi-chain runtime** — single `CHAIN_ID` env var switches between all supported chains with no code changes

---

## Smart Contract Architecture

`AgentWallet.sol` enforces all agent actions on-chain:

- Per-transaction ETH spending limit (default: 0.1 ETH)
- Daily ETH spending limit (default: 0.5 ETH)
- Whitelisted target addresses and function selectors
- Token-specific daily limits
- Guardian pause/unpause kill switch
- 10-minute timelock on limit increases
- 2-step role transfers (agent + guardian)

---

## Project Structure

```
Ethereum-Agentic/ (arbitrum branch)
├── contracts/          AgentWallet.sol + Foundry deploy scripts
├── runtime/            MCP server + AI agent loop (TypeScript)
├── dashboard/          Next.js cyberpunk dashboard
└── packages/
    ├── eth-agent-kit/       npm install eth-agent-kit
    └── create-eth-agent/    npx create-eth-agent@latest
```

---

## Published Packages

- [`eth-agent-kit`](https://www.npmjs.com/package/eth-agent-kit) — SDK for embedding the agent in your own app
- [`create-eth-agent`](https://www.npmjs.com/package/create-eth-agent) — scaffolding CLI to start a new project

---

Built for the Arbitrum Open House London Buildathon · June 2026
