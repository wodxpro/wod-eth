import { run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Script para verificar contratos no PolygonScan (Polygon Mainnet)
 * 
 * Uso:
 * npm run verify:polygon
 * 
 * Ou para verificar um contrato específico:
 * npx hardhat verify --network polygon <endereço> <arg1> <arg2> ...
 */

async function main() {
  console.log("🔍 Verificando contratos no PolygonScan...\n");

  // Endereços dos contratos deployados (serão lidos de addresses/polygon.json após deploy)
  const addressesFile = path.join(__dirname, "../addresses/polygon.json");
  let addresses: any = {};
  
  try {
    if (fs.existsSync(addressesFile)) {
      addresses = JSON.parse(fs.readFileSync(addressesFile, "utf-8"));
    }
  } catch (error) {
    console.log("⚠️  Arquivo addresses/polygon.json não encontrado. Use variáveis de ambiente.");
  }
  
  const wodTokenAddress = process.env.WOD_TOKEN_ADDRESS || addresses.WODToken;
  const validatorRegistryAddress = process.env.VALIDATOR_REGISTRY_ADDRESS || addresses.ValidatorRegistry;
  const arenaAddress = process.env.ARENA_ADDRESS || addresses.Arena;
  
  if (!wodTokenAddress || !validatorRegistryAddress || !arenaAddress) {
    throw new Error("❌ Endereços dos contratos não encontrados. Execute o deploy primeiro ou configure as variáveis de ambiente.");
  }

  const network = await import("hardhat").then((h) => h.network);
  console.log(`🌐 Rede: ${network.name} (Polygon Mainnet - Chain ID: 137)\n`);

  // Obter deployer address do arquivo de addresses ou env
  const deployerAddress = process.env.DEPLOYER_ADDRESS || addresses.deployer;
  
  if (!deployerAddress) {
    throw new Error("❌ DEPLOYER_ADDRESS não encontrado. Configure no .env ou no arquivo de addresses.");
  }

  // Verificar WODToken
  console.log("📝 Verificando WODToken...");
  try {
    await run("verify:verify", {
      address: wodTokenAddress,
      constructorArguments: [deployerAddress],
      chainId: 137,
    });
    console.log("✅ WODToken verificado!\n");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ WODToken já estava verificado\n");
    } else {
      console.log(`❌ Erro ao verificar WODToken: ${error.message}\n`);
    }
  }

  // Verificar ValidatorRegistry
  console.log("📝 Verificando ValidatorRegistry...");
  try {
    const minStake = process.env.MIN_STAKE_AMOUNT || "1000000000000000000000"; // 1000 WOD (18 decimals)
    await run("verify:verify", {
      address: validatorRegistryAddress,
      constructorArguments: [
        wodTokenAddress,
        deployerAddress,
        minStake,
      ],
      chainId: 137,
    });
    console.log("✅ ValidatorRegistry verificado!\n");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ ValidatorRegistry já estava verificado\n");
    } else {
      console.log(`❌ Erro ao verificar ValidatorRegistry: ${error.message}\n`);
    }
  }

  // Verificar Arena
  console.log("📝 Verificando Arena...");
  try {
    await run("verify:verify", {
      address: arenaAddress,
      constructorArguments: [
        wodTokenAddress,
        validatorRegistryAddress,
        deployerAddress,
      ],
      chainId: 137,
    });
    console.log("✅ Arena verificado!\n");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Arena já estava verificado\n");
    } else {
      console.log(`❌ Erro ao verificar Arena: ${error.message}\n`);
    }
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Verificação concluída!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

