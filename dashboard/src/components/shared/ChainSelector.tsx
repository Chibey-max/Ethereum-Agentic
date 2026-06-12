'use client';

import { useState } from 'react';
import { CHAINS, getChain } from '../../lib/chains';

const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '421614');

interface ChainSelectorProps {
  compact?: boolean;
}

export function ChainSelector({ compact = false }: ChainSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const activeChain = getChain(CHAIN_ID);

  const supportedChains = [
    CHAINS[421614],
    CHAINS[46630],
    CHAINS[42161],
  ];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: compact ? '4px 10px' : '6px 14px',
          background: 'rgba(0, 212, 170, 0.1)',
          border: `1px solid ${activeChain.badgeColor}`,
          borderRadius: '6px',
          color: activeChain.badgeColor,
          fontSize: '12px',
          fontFamily: 'monospace',
          cursor: 'pointer',
          fontWeight: 600,
          letterSpacing: '0.05em',
        }}
      >
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: activeChain.badgeColor,
          display: 'inline-block',
          flexShrink: 0,
        }} />
        {activeChain.shortName}
        <span style={{
          padding: '1px 5px',
          borderRadius: '3px',
          background: `${activeChain.badgeColor}22`,
          fontSize: '10px',
          color: activeChain.badgeColor,
        }}>
          {activeChain.badge}
        </span>
        <span style={{ opacity: 0.6, fontSize: '10px' }}>▾</span>
      </button>

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: '#0a0a0f',
            border: '1px solid #1a1a2e',
            borderRadius: '8px',
            padding: '8px',
            minWidth: '280px',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
          }}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div style={{ fontSize: '10px', color: '#666', padding: '4px 8px 8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Switch Chain
          </div>

          {supportedChains.map((chain) => {
            const isActive = chain.id === CHAIN_ID;
            return (
              <div
                key={chain.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: isActive ? `${chain.badgeColor}15` : 'transparent',
                  border: isActive ? `1px solid ${chain.badgeColor}44` : '1px solid transparent',
                  marginBottom: '4px',
                  cursor: isActive ? 'default' : 'pointer',
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: chain.badgeColor,
                      display: 'inline-block',
                    }} />
                    <span style={{ color: '#e0e0e0', fontSize: '13px', fontWeight: 500 }}>
                      {chain.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span style={{
                      padding: '1px 6px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      background: `${chain.badgeColor}22`,
                      color: chain.badgeColor,
                      fontWeight: 600,
                    }}>
                      {chain.badge}
                    </span>
                    {isActive && (
                      <span style={{ color: chain.badgeColor, fontSize: '11px' }}>● active</span>
                    )}
                  </div>
                </div>

                {chain.warning && (
                  <div style={{
                    marginTop: '6px',
                    padding: '6px 8px',
                    background: 'rgba(255, 107, 53, 0.1)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    color: '#ff6b35',
                  }}>
                    ⚠️ {chain.warning}
                  </div>
                )}

                {!chain.warning && !isActive && chain.faucetUrl && (
                  <div style={{ marginTop: '4px', fontSize: '11px', color: '#555' }}>
                    <a
                      href={chain.faucetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: chain.badgeColor, textDecoration: 'none' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      → Get testnet ETH
                    </a>
                  </div>
                )}

                <div style={{ marginTop: '4px', fontSize: '10px', color: '#444', fontFamily: 'monospace' }}>
                  chainId: {chain.id} · {chain.explorerName}
                </div>

                {!isActive && (
                  <div style={{ marginTop: '6px', fontSize: '11px', color: '#555' }}>
                    Set <code style={{ color: '#888', background: '#111', padding: '1px 4px', borderRadius: '3px' }}>
                      NEXT_PUBLIC_CHAIN_ID={chain.id}
                    </code> to switch
                  </div>
                )}
              </div>
            );
          })}

          <div style={{
            marginTop: '8px',
            padding: '8px',
            borderTop: '1px solid #1a1a2e',
            fontSize: '10px',
            color: '#444',
          }}>
            <a
              href={activeChain.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#555', textDecoration: 'none' }}
            >
              Open {activeChain.explorerName} →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChainSelector;
