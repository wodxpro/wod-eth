import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Script para distribuição inicial de tokens $WOD
 * 
 * Uso:
 * npm run initial-distribution
 * ou
 * npx hardhat run scripts/initialDistribution.ts --network polygon
 * 
 * IMPORTANTE: Este script deve ser executado pelo Safe Multisig
 * O signer precisa ser o owner do WODToken (Safe)
 */

async function main() {
  console.log("\n💰 WOD X PRO - Initial Token Distribution\n");

  // ============================================
  // LOAD DEPLOYMENT INFO
  // ============================================

  // Tentar ler do arquivo mais recente de deployments
  const deploymentsDir = path.join(__dirname, '../deployments');
  let deployment: any = null;
  let tokenAddress: string = '';
  let safeAddress: string = '';

  // Buscar arquivo de deployment mais recente
  if (fs.existsSync(deploymentsDir)) {
    const files = fs.readdirSync(deploymentsDir)
      .filter(f => f.startsWith('polygon-mainnet-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length > 0) {
      const latestFile = path.join(deploymentsDir, files[0]);
      deployment = JSON.parse(fs.readFileSync(latestFile, 'utf-8'));
      tokenAddress = deployment.contracts.WODToken.address;
      safeAddress = deployment.safeMultisig;
      console.log(`📋 Loaded deployment from: ${files[0]}\n`);
    }
  }

  // Fallback: ler de addresses/polygon.json
  if (!tokenAddress) {
    const addressesFile = path.join(__dirname, '../addresses/polygon.json');
    if (fs.existsSync(addressesFile)) {
      const addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf-8'));
      tokenAddress = addresses.WODToken;
      safeAddress = addresses.safeAddress;
      console.log("📋 Loaded addresses from addresses/polygon.json\n");
    }
  }

  // Fallback: variáveis de ambiente
  if (!tokenAddress) {
    tokenAddress = process.env.WOD_TOKEN_ADDRESS || '';
    safeAddress = process.env.SAFE_ADDRESS || '';
  }

  if (!tokenAddress) {
    throw new Error(
      "❌ WODToken address não encontrado!\n" +
      "   Execute o deploy primeiro ou configure WOD_TOKEN_ADDRESS no .env"
    );
  }

  // ============================================
  // DISTRIBUTION ADDRESSES
  // ============================================

  // Tentar carregar do arquivo de distribuição oficial
  const distributionFile = path.join(__dirname, '../../WODToken_Initial_Distribution.json');
  let distributionData: any = null;
  
  if (fs.existsSync(distributionFile)) {
    try {
      distributionData = JSON.parse(fs.readFileSync(distributionFile, 'utf-8'));
      console.log("📋 Loaded distribution data from WODToken_Initial_Distribution.json\n");
    } catch (error) {
      console.log("⚠️  Could not load distribution file, using defaults\n");
    }
  }

  // Endereços da distribuição (do arquivo JSON ou .env ou defaults)
  const TREASURY = distributionData?.distribution?.Treasury?.address?.toLowerCase() || 
                    process.env.TREASURY_ADDRESS?.toLowerCase() || 
                    "0x86485aa077f61909f15fc8a5a1ba3167562c9a54";
  const FOUNDER = distributionData?.distribution?.Founders?.address?.toLowerCase() || 
                  process.env.FOUNDER_ADDRESS?.toLowerCase() || 
                  "0x02dfef57bc5d36bc1c08cb6272386ca0ec32da86";
  const PARTNER = distributionData?.distribution?.Partners?.address?.toLowerCase() || 
                  process.env.PARTNER_ADDRESS?.toLowerCase() || 
                  "0xcd38cd02a7d04c283330162359c9c8e597ed5068";
  const LIQUIDITY = distributionData?.distribution?.Liquidity?.address?.toLowerCase() || 
                    process.env.LIQUIDITY_ADDRESS?.toLowerCase() || 
                    "0x947d6ecd44c3657bc43c734c65562a9d62617631";
  const DAO = distributionData?.distribution?.DAO?.address?.toLowerCase() || 
              process.env.DAO_ADDRESS?.toLowerCase() || 
              "0xa387691e594df109ad9ca83767f39d419cbc6001";

  console.log("📋 Token Address:", tokenAddress);
  console.log("🛡️  Safe Multisig:", safeAddress);
  console.log("\n📍 Distribution Addresses:");
  console.log("  Treasury:", TREASURY);
  console.log("  Founder:", FOUNDER);
  console.log("  Partner:", PARTNER);
  console.log("  Liquidity:", LIQUIDITY);
  console.log("  DAO:", DAO);

  // ============================================
  // CONNECT TO CONTRACT
  // ============================================

  const [signer] = await ethers.getSigners();
  console.log("\n🔑 Signer:", signer.address);

  const token = await ethers.getContractAt("WODToken", tokenAddress);

  // Verificar se signer tem MINTER_ROLE
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const hasMinterRole = await token.hasRole(MINTER_ROLE, signer.address);
  
  // Verificar admin role também
  const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;
  const hasAdminRole = await token.hasRole(DEFAULT_ADMIN_ROLE, signer.address);

  console.log("🔑 Role Check:");
  console.log("  MINTER_ROLE:", hasMinterRole ? "✅" : "❌");
  console.log("  ADMIN_ROLE:", hasAdminRole ? "✅" : "❌");

  if (!hasMinterRole && !hasAdminRole) {
    throw new Error(
      "⚠️ Signer não tem MINTER_ROLE ou ADMIN_ROLE!\n" +
      "   Signer: " + signer.address + "\n" +
      "   Execute via Safe Multisig ou configure MINTER_ROLE para este endereço."
    );
  }

  // Obter informações do token
  const tokenInfo = await token.getTokenInfo();
  console.log("\n📊 Token Info:");
  console.log("  Name:", tokenInfo.tokenName);
  console.log("  Symbol:", tokenInfo.tokenSymbol);
  console.log("  Max Supply:", ethers.formatEther(tokenInfo.maxSupply), "WOD");
  console.log("  Current Minted:", ethers.formatEther(tokenInfo.currentTotalMinted), "WOD");
  console.log("  Remaining:", ethers.formatEther(tokenInfo.remainingSupply), "WOD");
  console.log("  Paused:", tokenInfo.isPaused ? "⚠️ Yes" : "✅ No\n");

  // ============================================
  // TOKENOMICS
  // ============================================

  // Max Supply do contrato (já obtido do getTokenInfo)
  const MAX_SUPPLY = tokenInfo.maxSupply;

  // Usar valores do arquivo JSON se disponível, senão calcular
  const allocations = [
    {
      name: "Treasury Protocol",
      address: TREASURY,
      percentage: distributionData?.distribution?.Treasury?.allocation || "30%",
      amount: distributionData?.distribution?.Treasury?.amount 
        ? ethers.parseEther(distributionData.distribution.Treasury.amount.toString())
        : (MAX_SUPPLY * 30n) / 100n, // 300M
      reason: "Protocol Treasury - 30%"
    },
    {
      name: "Founders",
      address: FOUNDER,
      percentage: distributionData?.distribution?.Founders?.allocation || "15%",
      amount: distributionData?.distribution?.Founders?.amount
        ? ethers.parseEther(distributionData.distribution.Founders.amount.toString())
        : (MAX_SUPPLY * 15n) / 100n, // 150M
      reason: "Founders Allocation - 15% (vesting off-chain: 12 months linear)"
    },
    {
      name: "Partners",
      address: PARTNER,
      percentage: distributionData?.distribution?.Partners?.allocation || "10%",
      amount: distributionData?.distribution?.Partners?.amount
        ? ethers.parseEther(distributionData.distribution.Partners.amount.toString())
        : (MAX_SUPPLY * 10n) / 100n, // 100M
      reason: "Partners Allocation - 10% (vesting: 6 months cliff)"
    },
    {
      name: "Liquidity Pool",
      address: LIQUIDITY,
      percentage: distributionData?.distribution?.Liquidity?.allocation || "10%",
      amount: distributionData?.distribution?.Liquidity?.amount
        ? ethers.parseEther(distributionData.distribution.Liquidity.amount.toString())
        : (MAX_SUPPLY * 10n) / 100n, // 100M
      reason: "Initial Liquidity - 10% (Uniswap Pool)"
    },
    {
      name: "DAO / Ecosystem",
      address: DAO,
      percentage: distributionData?.distribution?.DAO?.allocation || "10%",
      amount: distributionData?.distribution?.DAO?.amount
        ? ethers.parseEther(distributionData.distribution.DAO.amount.toString())
        : (MAX_SUPPLY * 10n) / 100n, // 100M
      reason: "DAO Treasury - 10%"
    }
  ];

  // Challenge Rewards (25% = 250M) será mintado progressivamente via Arena
  // NÃO deve ser distribuído agora
  const CHALLENGE_REWARDS_PERCENTAGE = distributionData?.distribution?.["Challenge Rewards"]?.allocation || "25%";
  const CHALLENGE_REWARDS_AMOUNT = distributionData?.distribution?.["Challenge Rewards"]?.amount
    ? ethers.parseEther(distributionData.distribution["Challenge Rewards"].amount.toString())
    : (MAX_SUPPLY * 25n) / 100n; // 250M

  console.log("\n📊 Tokenomics:");
  console.log("  Max Supply: 1,000,000,000 WOD (1B)");
  console.log("  Initial Distribution: 75% (750M)");
  console.log("  Challenge Rewards: 25% (250M) - mintado progressivamente via Arena\n");
  
  if (distributionData) {
    console.log("📋 Distribution Source: WODToken_Initial_Distribution.json");
    console.log(`   Version: ${distributionData.deployment?.version || "N/A"}`);
    console.log(`   Date: ${distributionData.deployment?.date || "N/A"}\n`);
  }

  // ============================================
  // EXECUTE DISTRIBUTION
  // ============================================

  console.log("⏳ Starting distribution...\n");

  let totalDistributed = 0n;

  for (const allocation of allocations) {
    console.log(`📦 Minting ${allocation.percentage}% to ${allocation.name}...`);
    console.log(`   Address: ${allocation.address}`);
    console.log(`   Amount: ${ethers.formatEther(allocation.amount)} WOD`);
    console.log(`   Reason: ${allocation.reason}`);

    try {
      // O contrato atual tem mint(address, uint256, string)
      const tx = await token.mint(allocation.address, allocation.amount, allocation.reason);
      console.log(`   📝 Tx Hash: ${tx.hash}`);
      console.log(`   ⏳ Waiting for confirmation...`);
      
      const receipt = await tx.wait();
      console.log(`   ✅ Confirmed! Block: ${receipt?.blockNumber}\n`);

      totalDistributed += allocation.amount;
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}\n`);
      throw error;
    }
  }

  // ============================================
  // VERIFICATION
  // ============================================

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 Distribution Summary");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  for (const allocation of allocations) {
    const balance = await token.balanceOf(allocation.address);
    const expected = allocation.amount;
    const match = balance === expected;
    
    console.log(`${allocation.name}:`);
    console.log(`  Expected: ${ethers.formatEther(expected)} WOD`);
    console.log(`  Actual: ${ethers.formatEther(balance)} WOD`);
    console.log(`  Status: ${match ? "✅ Match" : "❌ Mismatch"}\n`);
  }

  // Verificar informações atualizadas do token
  const updatedTokenInfo = await token.getTokenInfo();
  const totalSupply = await token.totalSupply();
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Total Distributed:", ethers.formatEther(totalDistributed), "WOD");
  console.log("Total Supply:", ethers.formatEther(totalSupply), "WOD");
  console.log("Total Minted:", ethers.formatEther(updatedTokenInfo.currentTotalMinted), "WOD");
  console.log("Challenge Rewards Reserve:", ethers.formatEther(CHALLENGE_REWARDS_AMOUNT), "WOD");
  console.log(`  (${CHALLENGE_REWARDS_PERCENTAGE} = ${ethers.formatEther(CHALLENGE_REWARDS_AMOUNT)} for progressive Arena rewards)`);
  console.log("Remaining Mintable:", ethers.formatEther(updatedTokenInfo.remainingSupply), "WOD");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (totalSupply !== totalDistributed) {
    console.log("⚠️  ATENÇÃO: Total supply não corresponde ao distribuído!");
    console.log(`   Esperado: ${ethers.formatEther(totalDistributed)}`);
    console.log(`   Atual: ${ethers.formatEther(totalSupply)}`);
  }

  // ============================================
  // SAVE PROOF
  // ============================================

  const proof = {
    network: "polygon",
    chainId: 137,
    distributedAt: new Date().toISOString(),
    tokenAddress: tokenAddress,
    safeMultisig: safeAddress,
    totalDistributed: ethers.formatEther(totalDistributed),
    totalSupply: ethers.formatEther(totalSupply),
    allocations: allocations.map(a => ({
      name: a.name,
      address: a.address,
      percentage: a.percentage,
      amount: ethers.formatEther(a.amount),
      reason: a.reason
    })),
    challengeRewards: {
      amount: ethers.formatEther(CHALLENGE_REWARDS_AMOUNT),
      percentage: CHALLENGE_REWARDS_PERCENTAGE,
      mechanism: "Mint-on-demand via Arena",
      controlledBy: "MINTER_ROLE",
      note: "To be minted progressively for Arena challenge rewards"
    },
    tokenomics: {
      maxSupply: ethers.formatEther(MAX_SUPPLY),
      initialDistribution: "75%",
      challengeRewards: CHALLENGE_REWARDS_PERCENTAGE,
      currentTotalMinted: ethers.formatEther(updatedTokenInfo.currentTotalMinted),
      remainingMintable: ethers.formatEther(updatedTokenInfo.remainingSupply)
    },
    source: distributionData ? {
      file: "WODToken_Initial_Distribution.json",
      version: distributionData.deployment?.version,
      date: distributionData.deployment?.date
    } : null
  };

  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const proofFile = path.join(deploymentsDir, `distribution-proof-${Date.now()}.json`);
  fs.writeFileSync(proofFile, JSON.stringify(proof, null, 2));

  console.log("✅ Distribution proof saved to:", proofFile);

  // ============================================
  // NEXT STEPS
  // ============================================

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("⚠️  NEXT STEPS:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("1. Create Uniswap V3 pool (Liquidity address)");
  console.log("   Target price: $0.10 USD per WOD");
  console.log("\n2. Arena.sol já está deployado");
  console.log("   Para Arena mintar tokens, conceda MINTER_ROLE:");
  console.log(`   token.grantRole(MINTER_ROLE, ${process.env.ARENA_ADDRESS || "ARENA_ADDRESS"})`);
  console.log("   (Execute via Safe Multisig)");
  console.log("\n3. Update distribution file:");
  console.log(`   npm run update-distribution-file`);
  console.log("   (Atualiza WODToken_Initial_Distribution.json com token address)");
  console.log("\n4. Publish distribution proof");
  console.log("   File:", proofFile);
  console.log("\n5. Announce to community 🚀\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro na distribuição:");
    console.error(error);
    process.exit(1);
  });

