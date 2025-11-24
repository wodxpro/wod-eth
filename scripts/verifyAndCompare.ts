import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import { run } from "hardhat";

async function main() {
  console.log("🔍 Verificando e Comparando Contratos...\n");

  const addressesFile = path.join(__dirname, "../addresses/polygon.json");
  let addresses: any = {};

  if (!fs.existsSync(addressesFile)) {
    throw new Error("❌ Arquivo addresses/polygon.json não encontrado");
  }

  addresses = JSON.parse(fs.readFileSync(addressesFile, "utf-8"));

  const provider = ethers.provider;
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Informações da Rede");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${chainId}`);
  console.log(`${chainId === 137 ? "✅ Polygon Mainnet" : "❌ NÃO é Polygon Mainnet!"}\n`);

  // Safe address do arquivo
  const safeAddress = addresses.safeAddress || addresses.deployer;
  const deployerAddress = addresses.deployer;

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("1️⃣ Verificando WODToken");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const wodTokenAddress = addresses.WODToken;
  console.log(`Address: ${wodTokenAddress}`);

  // Verificar se existe
  const wodTokenCode = await provider.getCode(wodTokenAddress);
  if (!wodTokenCode || wodTokenCode === "0x") {
    throw new Error("❌ WODToken não existe na rede!");
  }
  console.log("✅ Contrato existe na rede");

  // Verificar informações do token
  try {
    const tokenABI = [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function MAX_SUPPLY() view returns (uint256)",
      "function totalMinted() view returns (uint256)",
      "function hasRole(bytes32,address) view returns (bool)",
    ];
    const token = new ethers.Contract(wodTokenAddress, tokenABI, provider);
    
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const maxSupply = await token.MAX_SUPPLY();
    const totalMinted = await token.totalMinted();

    console.log(`✅ Name: ${name}`);
    console.log(`✅ Symbol: ${symbol}`);
    console.log(`✅ Decimals: ${decimals}`);
    console.log(`✅ MAX_SUPPLY: ${ethers.formatEther(maxSupply)} WOD`);
    console.log(`✅ Total Minted: ${ethers.formatEther(totalMinted)} WOD`);

    // Verificar roles
    const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
    const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
    const PAUSER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("PAUSER_ROLE"));

    const hasAdmin = await token.hasRole(DEFAULT_ADMIN_ROLE, safeAddress);
    const hasMinter = await token.hasRole(MINTER_ROLE, safeAddress);
    const hasPauser = await token.hasRole(PAUSER_ROLE, safeAddress);

    console.log(`\n📋 Roles do Safe (${safeAddress}):`);
    console.log(`   ADMIN_ROLE: ${hasAdmin ? "✅" : "❌"}`);
    console.log(`   MINTER_ROLE: ${hasMinter ? "✅" : "❌"}`);
    console.log(`   PAUSER_ROLE: ${hasPauser ? "✅" : "❌"}`);

    // Validar MAX_SUPPLY
    const expectedMaxSupply = ethers.parseEther("1000000000"); // 1B
    if (maxSupply.toString() !== expectedMaxSupply.toString()) {
      console.log(`\n⚠️  MAX_SUPPLY diferente do esperado!`);
      console.log(`   Esperado: 1,000,000,000 WOD`);
      console.log(`   Atual: ${ethers.formatEther(maxSupply)} WOD`);
    } else {
      console.log(`\n✅ MAX_SUPPLY correto: 1B WOD`);
    }
  } catch (error: any) {
    console.log(`⚠️  Erro ao ler informações: ${error.message}`);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("2️⃣ Verificando ValidatorRegistry");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const validatorRegistryAddress = addresses.ValidatorRegistry;
  console.log(`Address: ${validatorRegistryAddress}`);

  const registryCode = await provider.getCode(validatorRegistryAddress);
  if (!registryCode || registryCode === "0x") {
    throw new Error("❌ ValidatorRegistry não existe na rede!");
  }
  console.log("✅ Contrato existe na rede");

  try {
    const registryABI = [
      "function owner() view returns (address)",
      "function minStakeAmount() view returns (uint256)",
      "function wodToken() view returns (address)",
    ];
    const registry = new ethers.Contract(validatorRegistryAddress, registryABI, provider);

    const owner = await registry.owner();
    const minStake = await registry.minStakeAmount();
    const wodTokenAddr = await registry.wodToken();

    console.log(`✅ Owner: ${owner}`);
    console.log(`✅ Min Stake: ${ethers.formatEther(minStake)} WOD`);
    console.log(`✅ WODToken: ${wodTokenAddr}`);

    // Validar owner
    if (owner.toLowerCase() !== safeAddress.toLowerCase()) {
      console.log(`\n⚠️  Owner diferente do esperado!`);
      console.log(`   Esperado: ${safeAddress}`);
      console.log(`   Atual: ${owner}`);
    } else {
      console.log(`\n✅ Owner correto: Safe`);
    }

    // Validar WODToken address
    if (wodTokenAddr.toLowerCase() !== wodTokenAddress.toLowerCase()) {
      console.log(`\n⚠️  WODToken address diferente!`);
      console.log(`   Esperado: ${wodTokenAddress}`);
      console.log(`   Atual: ${wodTokenAddr}`);
    } else {
      console.log(`✅ WODToken address correto`);
    }

    // Validar minStake (deve ser 1000 WOD)
    const expectedMinStake = ethers.parseEther("1000");
    if (minStake.toString() !== expectedMinStake.toString()) {
      console.log(`\n⚠️  Min Stake diferente do esperado!`);
      console.log(`   Esperado: 1000 WOD`);
      console.log(`   Atual: ${ethers.formatEther(minStake)} WOD`);
    } else {
      console.log(`✅ Min Stake correto: 1000 WOD`);
    }
  } catch (error: any) {
    console.log(`⚠️  Erro ao ler informações: ${error.message}`);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("3️⃣ Verificando Arena");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const arenaAddress = addresses.Arena;
  console.log(`Address: ${arenaAddress}`);

  const arenaCode = await provider.getCode(arenaAddress);
  if (!arenaCode || arenaCode === "0x") {
    throw new Error("❌ Arena não existe na rede!");
  }
  console.log("✅ Contrato existe na rede");

  try {
    const arenaABI = [
      "function owner() view returns (address)",
      "function wodToken() view returns (address)",
      "function validatorRegistry() view returns (address)",
    ];
    const arena = new ethers.Contract(arenaAddress, arenaABI, provider);

    const owner = await arena.owner();
    const wodTokenAddr = await arena.wodToken();
    const validatorRegistryAddr = await arena.validatorRegistry();

    console.log(`✅ Owner: ${owner}`);
    console.log(`✅ WODToken: ${wodTokenAddr}`);
    console.log(`✅ ValidatorRegistry: ${validatorRegistryAddr}`);

    // Validar owner
    if (owner.toLowerCase() !== safeAddress.toLowerCase()) {
      console.log(`\n⚠️  Owner diferente do esperado!`);
      console.log(`   Esperado: ${safeAddress}`);
      console.log(`   Atual: ${owner}`);
    } else {
      console.log(`\n✅ Owner correto: Safe`);
    }

    // Validar WODToken
    if (wodTokenAddr.toLowerCase() !== wodTokenAddress.toLowerCase()) {
      console.log(`\n⚠️  WODToken address diferente!`);
    } else {
      console.log(`✅ WODToken address correto`);
    }

    // Validar ValidatorRegistry
    if (validatorRegistryAddr.toLowerCase() !== validatorRegistryAddress.toLowerCase()) {
      console.log(`\n⚠️  ValidatorRegistry address diferente!`);
    } else {
      console.log(`✅ ValidatorRegistry address correto`);
    }
  } catch (error: any) {
    console.log(`⚠️  Erro ao ler informações: ${error.message}`);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("4️⃣ Tentando Verificar no Polygonscan");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Verificar WODToken
  console.log("📝 Verificando WODToken...");
  try {
    await run("verify:verify", {
      address: wodTokenAddress,
      constructorArguments: [safeAddress],
    });
    console.log("✅ WODToken verificado!\n");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ WODToken já estava verificado\n");
    } else {
      console.log(`⚠️  Erro: ${error.message}`);
      console.log("   Tente verificar manualmente seguindo VERIFICACAO_MANUAL_POLYGONSCAN.md\n");
    }
  }

  // Verificar ValidatorRegistry
  console.log("📝 Verificando ValidatorRegistry...");
  try {
    const minStake = ethers.parseEther("1000").toString();
    await run("verify:verify", {
      address: validatorRegistryAddress,
      constructorArguments: [wodTokenAddress, safeAddress, minStake],
    });
    console.log("✅ ValidatorRegistry verificado!\n");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ ValidatorRegistry já estava verificado\n");
    } else {
      console.log(`⚠️  Erro: ${error.message}`);
      console.log("   Tente verificar manualmente seguindo VERIFICACAO_MANUAL_POLYGONSCAN.md\n");
    }
  }

  // Verificar Arena
  console.log("📝 Verificando Arena...");
  try {
    await run("verify:verify", {
      address: arenaAddress,
      constructorArguments: [wodTokenAddress, validatorRegistryAddress, safeAddress],
    });
    console.log("✅ Arena verificado!\n");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Arena já estava verificado\n");
    } else {
      console.log(`⚠️  Erro: ${error.message}`);
      console.log("   Tente verificar manualmente seguindo VERIFICACAO_MANUAL_POLYGONSCAN.md\n");
    }
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Verificação Completa!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n🔗 Links dos Contratos:");
  console.log(`   WODToken: https://polygonscan.com/address/${wodTokenAddress}`);
  console.log(`   ValidatorRegistry: https://polygonscan.com/address/${validatorRegistryAddress}`);
  console.log(`   Arena: https://polygonscan.com/address/${arenaAddress}`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro:", error.message);
    process.exit(1);
  });

