import { ethers } from "hardhat";
import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("\n🚀 Deploying WOD X PRO Contracts to Polygon Mainnet...\n");

  // ============================================
  // CONFIGURAÇÃO
  // ============================================

  const [deployer] = await ethers.getSigners();
  const deployerAddress = deployer.address;
  const deployerBalance = await ethers.provider.getBalance(deployerAddress);
  
  // Safe Multisig (OPCIONAL - se não tiver, usa deployer como owner)
  const SAFE_MULTISIG = process.env.SAFE_ADDRESS || deployerAddress;
  const USE_SAFE = !!process.env.SAFE_ADDRESS;

  // ============================================
  // VALIDAÇÕES PRÉ-DEPLOY
  // ============================================

  console.log("📝 Deployer:", deployerAddress);
  console.log("💰 Balance:", ethers.formatEther(deployerBalance), "MATIC");

  // Verificar network
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  console.log("🌐 Network:", network.name, `(Chain ID: ${chainId})`);

  if (chainId !== 137 && chainId !== 80001) { // 137 = Polygon, 80001 = Mumbai
    console.warn(`\n⚠️  WARNING: Você está em ${network.name}, não Polygon Mainnet!`);
    console.warn("   Certifique-se de que isso é intencional.\n");
  }

  // Verificar Safe (se configurado)
  if (USE_SAFE) {
    if (!ethers.isAddress(SAFE_MULTISIG)) {
      throw new Error(`⚠️ Endereço Safe inválido: ${SAFE_MULTISIG}`);
    }
    console.log("🔐 Safe Multisig:", SAFE_MULTISIG);
  } else {
    console.log("🔐 Owner (Deployer):", deployerAddress);
    console.log("⚠️  ATENÇÃO: Ownership será com a wallet de deploy (não Safe)");
  }

  // Verificar saldo mínimo
  const minBalance = ethers.parseEther("0.5"); // Aumentado para 0.5
  if (deployerBalance < minBalance) {
    throw new Error(
      `⚠️ Saldo insuficiente! Atual: ${ethers.formatEther(deployerBalance)} MATIC\n` +
      `   Recomendado: pelo menos 0.5 MATIC para deploy completo.\n` +
      `   Compre MATIC em: https://wallet.polygon.technology/`
    );
  }

  console.log("\n✅ Validações pré-deploy concluídas");

  // ============================================
  // ESTIMATIVA DE GAS
  // ============================================

  console.log("\n📊 Estimando custos de gas...");

  const feeData = await ethers.provider.getFeeData();
  const gasPrice = feeData.gasPrice || 0n;
  
  console.log("  Gas Price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");

  // Estimativas aproximadas (baseado em testes)
  const estimatedGas = {
    WODToken: 2_000_000n,
    ValidatorRegistry: 1_500_000n,
    Arena: 3_000_000n,
  };

  const totalGas = Object.values(estimatedGas).reduce((a, b) => a + b, 0n);
  const totalCost = totalGas * gasPrice;

  console.log("  Estimated Gas:");
  console.log("    WODToken:", estimatedGas.WODToken.toLocaleString());
  console.log("    ValidatorRegistry:", estimatedGas.ValidatorRegistry.toLocaleString());
  console.log("    Arena:", estimatedGas.Arena.toLocaleString());
  console.log("    Total:", totalGas.toLocaleString());
  console.log("  Estimated Cost:", ethers.formatEther(totalCost), "MATIC");
  console.log("    (~$", (Number(ethers.formatEther(totalCost)) * 0.80).toFixed(2), "USD @ $0.80/MATIC)");

  if (deployerBalance < totalCost * 2n) {
    console.warn(`\n⚠️  Saldo pode ser insuficiente para deploy completo!`);
    console.warn(`   Recomendado: ${ethers.formatEther(totalCost * 2n)} MATIC\n`);
  }

  console.log("\n✅ Estimativa concluída\n");

  // ============================================
  // 1. DEPLOY DO WODTOKEN
  // ============================================

  console.log("⏳ Deploying WODToken...");
  const WODToken = await ethers.getContractFactory("WODToken");
  
  const wodToken = await WODToken.deploy(SAFE_MULTISIG);
  await wodToken.waitForDeployment();

  const wodTokenAddress = await wodToken.getAddress();
  console.log("✅ WODToken deployed:", wodTokenAddress);

  // Detectar tipo de contrato (AccessControl vs Ownable)
  let usesAccessControl = false;
  let hasAdminRole = false;
  let hasMinterRole = false;
  let hasPauserRole = false;

  try {
    const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
    const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
    const PAUSER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("PAUSER_ROLE"));
    
    hasAdminRole = await wodToken.hasRole(DEFAULT_ADMIN_ROLE, SAFE_MULTISIG);
    hasMinterRole = await wodToken.hasRole(MINTER_ROLE, SAFE_MULTISIG);
    hasPauserRole = await wodToken.hasRole(PAUSER_ROLE, SAFE_MULTISIG);
    
    usesAccessControl = true;
    
    if (!hasAdminRole || !hasMinterRole || !hasPauserRole) {
      throw new Error(
        `❌ Roles não configuradas corretamente!\n` +
        `   ADMIN: ${hasAdminRole ? "✅" : "❌"}\n` +
        `   MINTER: ${hasMinterRole ? "✅" : "❌"}\n` +
        `   PAUSER: ${hasPauserRole ? "✅" : "❌"}`
      );
    }
    console.log("✅ Token usa AccessControl (Production-Ready)");
    console.log("✅ Roles verificadas: Safe tem todas as permissões");
  } catch (error: any) {
    if (error.message.includes("Roles não configuradas")) {
      throw error;
    }
    
    // Se chegou aqui, o contrato não tem AccessControl
    // Isso não deveria acontecer com o contrato atual
    throw new Error(
      "❌ WODToken não tem AccessControl configurado!\n" +
      "   O contrato atual deve usar AccessControl com roles.\n" +
      "   Verifique se está usando o contrato correto."
    );
  }

  // Informações do token
  const tokenName = await wodToken.name();
  const tokenSymbol = await wodToken.symbol();
  const totalSupply = await wodToken.totalSupply();
  
  console.log("\n📊 Token Info:");
  console.log("  Name:", tokenName);
  console.log("  Symbol:", tokenSymbol);
  console.log("  Total Supply:", ethers.formatEther(totalSupply), tokenSymbol);

  // Obter informações completas (se disponível)
  let tokenInfo: any = null;
  try {
    tokenInfo = await wodToken.getTokenInfo();
    console.log("  Max Supply:", ethers.formatEther(tokenInfo.maxSupply), tokenSymbol);
    console.log("  Current Minted:", ethers.formatEther(tokenInfo.currentTotalMinted), tokenSymbol);
    console.log("  Remaining:", ethers.formatEther(tokenInfo.remainingSupply), tokenSymbol);
    console.log("  Paused:", tokenInfo.isPaused ? "⚠️ Yes" : "✅ No");
    
    // Validar MAX_SUPPLY
    const expectedMaxSupply = ethers.parseEther("1000000000"); // 1B
    if (tokenInfo.maxSupply.toString() !== expectedMaxSupply.toString()) {
      throw new Error(
        `❌ MAX_SUPPLY incorreto!\n` +
        `   Esperado: 1,000,000,000 WOD\n` +
        `   Atual: ${ethers.formatEther(tokenInfo.maxSupply)} WOD`
      );
    }
    console.log("✅ MAX_SUPPLY validado: 1B WOD");
  } catch (error: any) {
    if (error.message.includes("MAX_SUPPLY incorreto")) {
      throw error;
    }
    console.log("  (Contrato não tem getTokenInfo - usando contrato básico)");
  }

  // Verificar supply inicial
  if (totalSupply > 0) {
    console.warn(
      `\n⚠️  Token já tem supply: ${ethers.formatEther(totalSupply)} WOD\n` +
      `   Verifique se distribuição inicial já foi executada.`
    );
  } else {
    console.log("\n✅ Total supply = 0 (correto para primeiro deploy)");
    console.log("   Execute 'npm run initial-distribution' após verificar contratos");
  }

  console.log("\n  Admin:", USE_SAFE ? `Safe (${SAFE_MULTISIG})` : `Deployer (${deployerAddress})`);
  if (usesAccessControl) {
    console.log("  MINTER_ROLE:", hasMinterRole ? "✅" : "❌");
    console.log("  PAUSER_ROLE:", hasPauserRole ? "✅" : "❌");
  }

  // ============================================
  // 2. DEPLOY DO VALIDATORREGISTRY
  // ============================================

  console.log("\n⏳ Deploying ValidatorRegistry...");
  const ValidatorRegistry = await ethers.getContractFactory("ValidatorRegistry");
  const minStake = ethers.parseEther("1000"); // 1000 WOD mínimo
  
  const validatorRegistry = await ValidatorRegistry.deploy(
    wodTokenAddress,
    SAFE_MULTISIG,
    minStake
  );
  await validatorRegistry.waitForDeployment();

  const validatorRegistryAddress = await validatorRegistry.getAddress();
  console.log("✅ ValidatorRegistry deployed:", validatorRegistryAddress);
  
  const registryOwner = await validatorRegistry.owner();
  const registryMinStake = await validatorRegistry.minStakeAmount();
  
  if (registryOwner.toLowerCase() !== SAFE_MULTISIG.toLowerCase()) {
    throw new Error(
      `❌ ValidatorRegistry owner incorreto!\n` +
      `   Esperado: ${SAFE_MULTISIG}\n` +
      `   Atual: ${registryOwner}`
    );
  }
  
  console.log("  Owner:", USE_SAFE ? `Safe (${registryOwner})` : `Deployer (${registryOwner})`);
  console.log("  Min Stake:", ethers.formatEther(registryMinStake), "WOD");

  // ============================================
  // 3. DEPLOY DO ARENA
  // ============================================

  console.log("\n⏳ Deploying Arena...");
  const Arena = await ethers.getContractFactory("Arena");
  
  const arena = await Arena.deploy(
    wodTokenAddress,
    validatorRegistryAddress,
    SAFE_MULTISIG
  );
  await arena.waitForDeployment();

  const arenaAddress = await arena.getAddress();
  console.log("✅ Arena deployed:", arenaAddress);
  
  const arenaOwner = await arena.owner();
  
  if (arenaOwner.toLowerCase() !== SAFE_MULTISIG.toLowerCase()) {
    throw new Error(
      `❌ Arena owner incorreto!\n` +
      `   Esperado: ${SAFE_MULTISIG}\n` +
      `   Atual: ${arenaOwner}`
    );
  }
  
  console.log("  Owner:", USE_SAFE ? `Safe (${arenaOwner})` : `Deployer (${arenaOwner})`);

  // ============================================
  // SUMMARY
  // ============================================

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Deployment Summary");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Network:", network.name);
  console.log("Chain ID:", chainId);
  console.log("Deployer:", deployerAddress);
  console.log("Owner:", USE_SAFE ? `Safe (${SAFE_MULTISIG})` : `Deployer (${deployerAddress})`);
  console.log("");
  console.log("Contracts:");
  console.log("  WODToken:", wodTokenAddress);
  console.log("  ValidatorRegistry:", validatorRegistryAddress);
  console.log("  Arena:", arenaAddress);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // ============================================
  // SAVE ADDRESSES
  // ============================================

  const chainNameMap: Record<number, string> = {
    137: 'polygon',
    80001: 'mumbai',
  };
  
  const chainName = chainNameMap[chainId] || 'unknown';
  
  // Salvar em addresses/
  const addressesDir = path.join(__dirname, '../addresses');
  if (!fs.existsSync(addressesDir)) {
    fs.mkdirSync(addressesDir, { recursive: true });
  }
  
  const addressesFile = path.join(addressesDir, `${chainName}.json`);
  const addresses = {
    Arena: arenaAddress,
    WODToken: wodTokenAddress,
    ValidatorRegistry: validatorRegistryAddress,
    deployer: deployerAddress,
    owner: USE_SAFE ? SAFE_MULTISIG : deployerAddress,
    safeAddress: USE_SAFE ? SAFE_MULTISIG : null,
    deployedAt: new Date().toISOString(),
    network: network.name,
    chainId: chainId,
  };
  
  fs.writeFileSync(addressesFile, JSON.stringify(addresses, null, 2));
  console.log(`💾 Addresses saved to addresses/${chainName}.json`);

  // Salvar deployment completo
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentInfo = {
    network: network.name,
    chainId: chainId,
    deployedAt: new Date().toISOString(),
    deployer: deployerAddress,
    owner: USE_SAFE ? SAFE_MULTISIG : deployerAddress,
    safeMultisig: USE_SAFE ? SAFE_MULTISIG : null,
    contracts: {
      WODToken: {
        address: wodTokenAddress,
        name: tokenName,
        symbol: tokenSymbol,
        totalSupply: totalSupply.toString(),
        admin: USE_SAFE ? SAFE_MULTISIG : deployerAddress,
        usesAccessControl,
        ...(usesAccessControl ? {
          roles: {
            admin: hasAdminRole,
            minter: hasMinterRole,
            pauser: hasPauserRole,
          },
        } : {
          owner: SAFE_MULTISIG,
        }),
        ...(tokenInfo ? {
          maxSupply: tokenInfo.maxSupply.toString(),
          currentMinted: tokenInfo.currentTotalMinted.toString(),
          remaining: tokenInfo.remainingSupply.toString(),
        } : {}),
      },
      ValidatorRegistry: {
        address: validatorRegistryAddress,
        owner: registryOwner,
        minStakeAmount: registryMinStake.toString(),
      },
      Arena: {
        address: arenaAddress,
        owner: arenaOwner,
      },
    },
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const deploymentFile = path.join(deploymentsDir, `${chainName}-${timestamp}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`💾 Full deployment saved to deployments/${chainName}-*.json\n`);

  // ============================================
  // PRÓXIMOS PASSOS
  // ============================================

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("⚠️  NEXT STEPS");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("1️⃣  Verify contracts on Polygonscan:");
  console.log(`   npm run verify:polygon`);
  console.log("");
  console.log("2️⃣  Check contracts online:");
  console.log(`   WODToken: https://polygonscan.com/address/${wodTokenAddress}`);
  console.log(`   ValidatorRegistry: https://polygonscan.com/address/${validatorRegistryAddress}`);
  console.log(`   Arena: https://polygonscan.com/address/${arenaAddress}`);
  console.log("");
  console.log("3️⃣  Verify ownership (CRITICAL!):");
  console.log(`   All contracts owned by: ${USE_SAFE ? `Safe (${SAFE_MULTISIG})` : `Deployer (${deployerAddress})`}`);
  if (usesAccessControl) {
    console.log(`   WODToken MINTER_ROLE: ${hasMinterRole ? "✅" : "❌"}`);
    console.log(`   WODToken PAUSER_ROLE: ${hasPauserRole ? "✅" : "❌"}`);
  }
  console.log("");
  console.log("4️⃣  Run initial token distribution:");
  console.log(`   npm run initial-distribution`);
  console.log("");
  console.log("5️⃣  Grant MINTER_ROLE to Arena (via Safe):");
  console.log(`   Token: ${wodTokenAddress}`);
  console.log(`   Arena: ${arenaAddress}`);
  console.log(`   Role: MINTER_ROLE`);
  console.log("");
  console.log("6️⃣  Create Uniswap liquidity pool");
  console.log("");
  console.log("7️⃣  Update frontend with addresses:");
  console.log(`   File: addresses/${chainName}.json`);
  console.log("");
  console.log("✅ Deploy concluído com sucesso!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro no deploy:");
    console.error(error);
    process.exit(1);
  });