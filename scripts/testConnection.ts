import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Script para testar conexão com Polygon Mainnet
 * 
 * Uso:
 * npm run test-connection
 * ou
 * npx hardhat run scripts/testConnection.ts --network polygon
 */

async function main() {
  console.log("🔍 Testando conexão com Polygon Mainnet...\n");

  try {
    // Obter provider
    const provider = ethers.provider;
    
    // 1. Testar conexão básica
    console.log("1️⃣ Testando conexão RPC...");
    const network = await provider.getNetwork();
    console.log(`   ✅ Conectado!`);
    console.log(`   📋 Chain ID: ${network.chainId}`);
    console.log(`   📋 Nome: ${network.name}`);
    
    if (Number(network.chainId) !== 137) {
      console.log(`   ⚠️  ATENÇÃO: Chain ID esperado é 137 (Polygon Mainnet)`);
      console.log(`   ⚠️  Chain ID atual: ${network.chainId}`);
    } else {
      console.log(`   ✅ Chain ID correto (137 = Polygon Mainnet)\n`);
    }

    // 2. Testar último bloco
    console.log("2️⃣ Testando leitura de blocos...");
    const blockNumber = await provider.getBlockNumber();
    console.log(`   ✅ Último bloco: ${blockNumber}`);
    
    const block = await provider.getBlock(blockNumber);
    if (block) {
      console.log(`   ✅ Timestamp: ${new Date(Number(block.timestamp) * 1000).toLocaleString()}`);
      console.log(`   ✅ Gas usado: ${block.gasUsed.toString()}\n`);
    }

    // 3. Testar saldo da wallet (se PRIVATE_KEY configurada)
    if (process.env.PRIVATE_KEY) {
      console.log("3️⃣ Testando wallet de deploy...");
      const [signer] = await ethers.getSigners();
      const address = signer.address;
      const balance = await provider.getBalance(address);
      const balanceInMatic = ethers.formatEther(balance);
      
      console.log(`   ✅ Wallet: ${address}`);
      console.log(`   ✅ Saldo: ${balanceInMatic} MATIC`);
      
      if (Number(balanceInMatic) < 0.1) {
        console.log(`   ⚠️  Saldo baixo! Recomendado: ~0.5 MATIC para deploy\n`);
      } else {
        console.log(`   ✅ Saldo suficiente para deploy\n`);
      }
    } else {
      console.log("3️⃣ PRIVATE_KEY não configurada (pulando teste de wallet)\n");
    }

    // 4. Testar RPC URL
    console.log("4️⃣ Informações da conexão RPC...");
    const rpcUrl = process.env.POLYGON_RPC_URL || "não configurada";
    if (rpcUrl.includes("alchemy.com")) {
      console.log(`   ✅ Provedor: Alchemy`);
    } else if (rpcUrl.includes("infura.io")) {
      console.log(`   ✅ Provedor: Infura`);
    } else {
      console.log(`   ✅ Provedor: Outro`);
    }
    console.log(`   📋 RPC URL: ${rpcUrl.substring(0, 50)}...\n`);

    // 5. Testar gas price
    console.log("5️⃣ Testando gas price...");
    const feeData = await provider.getFeeData();
    if (feeData.gasPrice) {
      const gasPriceInGwei = ethers.formatUnits(feeData.gasPrice, "gwei");
      console.log(`   ✅ Gas Price: ${gasPriceInGwei} Gwei`);
    }
    if (feeData.maxFeePerGas) {
      const maxFeeInGwei = ethers.formatUnits(feeData.maxFeePerGas, "gwei");
      console.log(`   ✅ Max Fee: ${maxFeeInGwei} Gwei\n`);
    }

    // Resumo final
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Teste de conexão concluído com sucesso!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📋 Resumo:");
    console.log(`   ✅ Conexão RPC: OK`);
    console.log(`   ✅ Chain ID: ${network.chainId} (${network.chainId === 137n ? "Polygon Mainnet" : "Verificar!"})`);
    console.log(`   ✅ Último bloco: ${blockNumber}`);
    if (process.env.PRIVATE_KEY) {
      const [signer] = await ethers.getSigners();
      const balance = await provider.getBalance(signer.address);
      console.log(`   ✅ Wallet: ${signer.address}`);
      console.log(`   ✅ Saldo: ${ethers.formatEther(balance)} MATIC`);
    }
    console.log("\n🚀 Pronto para deploy!");

  } catch (error: any) {
    console.error("\n❌ Erro ao testar conexão:");
    console.error(`   ${error.message}\n`);
    
    if (error.message.includes("ECONNREFUSED") || error.message.includes("timeout")) {
      console.log("💡 Possíveis soluções:");
      console.log("   1. Verifique se POLYGON_RPC_URL está correto no .env");
      console.log("   2. Verifique sua conexão com a internet");
      console.log("   3. Teste a URL RPC em outro cliente");
      console.log("   4. Verifique se a API key do Alchemy/Infura está válida");
    } else if (error.message.includes("invalid response")) {
      console.log("💡 Possíveis soluções:");
      console.log("   1. Verifique se a API key do RPC está correta");
      console.log("   2. Verifique se há limites de rate na sua conta");
      console.log("   3. Tente usar outro provedor RPC");
    }
    
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

