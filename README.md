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
| Arbitrum Sepolia | `0x...` | [Arbiscan](https://sepolia.arbiscan.io/address/0x...) |
| Robinhood Chain Testnet | `0x...` | [RH Explorer](https://explorer.testnet.chain.robinhood.com/address/0x...) |
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

## Arbitrum-Native Features

- **`ArbSys` precompile integration** — `AgentWallet.sol` uses `IArbSys(0x64).arbBlockNumber()` for L2-accurate block tracking and `arbChainID()` for chain verification. Falls back to `block.number` on non-Arbitrum chains.
- **`verifyArbitrumDeployment()`** — public function that emits `ArbitrumChainVerified(chainId, l2Block)` event, proving deployment on Arbiscan
- **Multi-chain runtime** — single `CHAIN_ID` env var switches between Arbitrum Sepolia, Robinhood Chain, and Arbitrum One with no code changes

---

## Quickstart

### Option A — MCP Server (Claude Desktop / Cursor / Kiro)

```bash
npx create-eth-agent@latest my-agent
cd my-agent
cp .env.example .env
# Fill CHAIN_ID=421614, ARBITRUM_SEPOLIA_RPC_URL, AGENT_CONTRACT_ADDRESS, AGENT_PRIVATE_KEY, GROQ_API_KEY
npm run build
npm run setup
# Restart your IDE — Claude can now talk to Arbitrum
```

### Option B — npm package

```bash
npm install eth-agent-kit
```

```typescript
import { ETHAgent } from 'eth-agent-kit'
const agent = new ETHAgent({ chainId: 421614, ...config })
await agent.run('Check my wallet balance on Arbitrum')
```

### Option C — Clone and run

```bash
git clone https://github.com/Chibey-max/Ethereum-Agentic.git -b arbitrum
cd Ethereum-Agentic/runtime
cp .env.example .env
# Edit .env — set CHAIN_ID=421614 and fill your keys
npm install && npm run build
node dist/mcp-server.js
```

---

## MCP Config

Add to Claude Desktop / Cursor / Kiro:

```json
{
  "mcpServers": {
    "arbitrum-agent": {
      "command": "node",
      "args": ["/full/path/to/runtime/dist/mcp-server.js"]
    }
  }
}
```

---

## Available Agent Tools

| Tool | Description |
|------|-------------|
| `get_wallet_state` | Balance, limits, paused status, chain info |
| `transfer_eth` | Send ETH to whitelisted address |
| `transfer_token` | Send ERC-20 within token policy |
| `check_limits` | Remaining daily ETH allowance |
| `get_tx_status` | Look up transaction by hash (Arbiscan link) |
| `check_whitelist` | Check if address+action is allowed |
| `get_pending_actions` | Queued calls with countdown timers |
| `get_transaction_history` | Recent on-chain activity |

---

## Smart Contract Architecture

`AgentWallet.sol` enforces all agent actions on-chain:

- Per-transaction ETH spending limit
- Daily ETH spending limit (reset tracked via `ArbSys.arbBlockNumber()`)
- Whitelisted target addresses and function selectors
- Token-specific daily limits
- Guardian pause/unpause kill switch
- 10-minute timelock on limit increases
- 2-step role transfers (agent + guardian)
- `verifyArbitrumDeployment()` — chain verification event

---

## Project Structure

```
Ethereum-Agentic/ (arbitrum branch)
├── contracts/          AgentWallet.sol + deploy scripts (Foundry)
├── runtime/            MCP server + AI agent loop (TypeScript)
├── dashboard/          Next.js cyberpunk dashboard
└── packages/
    ├── eth-agent-kit/       npm install eth-agent-kit
    └── create-eth-agent/    npx create-eth-agent@latest
```

---

## Demo Flow (for judges)

1. Open Claude Desktop with MCP server configured
2. Type: *"Check my agent wallet state on Arbitrum"*
3. Claude calls `get_wallet_state` → reads `AgentWallet.sol` on Arbitrum Sepolia
4. Returns: balance, daily limit, spent today, paused status, chain verification
5. Type: *"What's my remaining daily ETH limit?"*
6. Claude calls `check_limits` → real-time from chain
7. Dashboard updates live with Arbiscan tx links

---

## Requirements

- Node.js 18+
- Arbitrum Sepolia or Robinhood Chain testnet ETH
- Deployed `AgentWallet.sol` (or use the demo address above)
- At least one AI provider key: Groq (free), OpenRouter, or Google Gemini

---

## Published Packages

- [`eth-agent-kit`](https://www.npmjs.com/package/eth-agent-kit) — SDK
- [`create-eth-agent`](https://www.npmjs.com/package/create-eth-agent) — scaffolding CLI

---

Built for the Arbitrum Open House London Buildathon · June 2026
