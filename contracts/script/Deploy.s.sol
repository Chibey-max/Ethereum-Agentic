// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AgentWallet.sol";

contract DeployScript is Script {
    function run() external {
        address agentAddr    = vm.envAddress("AGENT_ADDRESS");
        address guardianAddr = vm.envAddress("GUARDIAN_ADDRESS");

        console.log("=== Arbitrum Agent Kit Deploy ===");
        console.log("Chain ID  :", block.chainid);
        console.log("Agent     :", agentAddr);
        console.log("Guardian  :", guardianAddr);

        string memory chainName;
        if (block.chainid == 42161)  chainName = "Arbitrum One (mainnet)";
        else if (block.chainid == 421614) chainName = "Arbitrum Sepolia";
        else if (block.chainid == 46630)  chainName = "Robinhood Chain Testnet";
        else if (block.chainid == 11155111) chainName = "Ethereum Sepolia";
        else chainName = "Unknown chain";

        console.log("Network   :", chainName);

        vm.startBroadcast();
        AgentWallet wallet = new AgentWallet(
            agentAddr,
            guardianAddr,
            0.1 ether,
            0.5 ether
        );
        vm.stopBroadcast();

        console.log("Deployed AgentWallet at:", address(wallet));
        console.log("Verify on explorer with: forge verify-contract", address(wallet), "src/AgentWallet.sol:AgentWallet");
    }
}
