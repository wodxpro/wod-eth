import { ethers } from "hardhat";
import hre from "hardhat";

/**
 * Script para deploy apenas do Arena
 * Use quando WODToken e ValidatorRegistry já estão deployados
 */

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying Arena with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Endereços já deployados (atualize se necessário)
  const wodTokenAddress = process.env.WOD_TOKEN_ADDRESS || "0xA6081E450193a9184D9C7dDC9152d8b0aFBD7b8d";
  const validatorRegistryAddress = process.env.VALIDATOR_REGISTRY_ADDRESS || "0x3470Ef533399CEAEc3E76B3C0E909aC27b338BA9";

  console.log("\n📋 Usando contratos existentes:");
  console.log("WODToken:", wodTokenAddress);
  console.log("ValidatorRegistry:", validatorRegistryAddress);

  // Deploy Arena
  console.log("\n🚀 Deploying Arena...");
  const Arena = await ethers.getContractFactory("Arena");
  const arena = await Arena.deploy(
    wodTokenAddress,
    validatorRegistryAddress,
    deployer.address
  );
  await arena.waitForDeployment();
  const arenaAddress = await arena.getAddress();
  console.log("✅ Arena deployed to:", arenaAddress);

  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("WODToken:", wodTokenAddress);
  console.log("ValidatorRegistry:", validatorRegistryAddress);
  console.log("Arena:", arenaAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const network = await hre.network;
  const chainId = (await ethers.provider.getNetwork()).chainId;
  const deploymentInfo = {
    network: network.name,
    chainId: chainId.toString(),
    contracts: {
      WODToken: wodTokenAddress,
      ValidatorRegistry: validatorRegistryAddress,
      Arena: arenaAddress,
    },
    deployer: deployer.address,
  };

  console.log("💾 Deployment info:", JSON.stringify(deploymentInfo, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

