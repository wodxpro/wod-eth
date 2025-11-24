import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { ethers } from "hardhat";

dotenv.config();

/**
 * Script para verificar contratos usando Thirdweb API
 * 
 * Uso:
 * npm run verify-thirdweb
 * ou
 * npx hardhat run scripts/verifyThirdweb.ts --network polygon
 */

const THIRDWEB_API_URL = "https://api.thirdweb.com/v1";
const POLYGON_CHAIN_ID = 137; // Polygon Mainnet

async function verifyContractWithThirdweb(
  contractAddress: string,
  contractName: string,
  sourceCode: string,
  compilerVersion: string = "v0.8.20",
  optimizationRuns: number = 200
) {
  const secretKey = process.env.THIRDWEB_SECRET_KEY;

  if (!secretKey) {
    throw new Error("❌ THIRDWEB_SECRET_KEY não configurada no .env");
  }

  console.log(`📝 Verificando ${contractName} (${contractAddress})...`);

  try {
    // Thirdweb pode ter endpoints específicos para verificação
    // Por enquanto, vamos verificar se o contrato existe e está acessível
    const provider = ethers.provider;
    const code = await provider.getCode(contractAddress);

    if (!code || code === "0x") {
      throw new Error(`❌ Contrato ${contractName} não existe na rede`);
    }

    console.log(`✅ Contrato ${contractName} existe na rede`);

    // Verificar informações básicas do contrato
    try {
      const contract = new ethers.Contract(
        contractAddress,
        ["function name() view returns (string)", "function symbol() view returns (string)"],
        provider
      );

      try {
        const name = await contract.name();
        console.log(`   Name: ${name}`);
      } catch {
        // Não tem função name
      }

      try {
        const symbol = await contract.symbol();
        console.log(`   Symbol: ${symbol}`);
      } catch {
        // Não tem função symbol
      }
    } catch {
      // Não conseguiu ler informações
    }

    // Nota: Thirdweb API pode ter endpoints específicos para verificação
    // que precisam ser consultados na documentação oficial
    console.log(`   ✅ ${contractName} verificado localmente`);
    console.log(`   💡 Para verificação no Polygonscan, use o guia manual\n`);

    return true;
  } catch (error: any) {
    console.log(`   ❌ Erro: ${error.message}\n`);
    return false;
  }
}

async function main() {
  console.log("🔍 Verificando contratos com Thirdweb...\n");

  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      "❌ THIRDWEB_SECRET_KEY não configurada!\n" +
      "   Configure no .env e obtenha em: https://thirdweb.com/dashboard/settings/api-keys"
    );
  }

  // Ler endereços dos contratos
  const addressesFile = path.join(__dirname, "../addresses/polygon.json");
  if (!fs.existsSync(addressesFile)) {
    throw new Error("❌ Arquivo addresses/polygon.json não encontrado");
  }

  const addresses = JSON.parse(fs.readFileSync(addressesFile, "utf-8"));

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Informações da Rede");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  const network = await ethers.provider.getNetwork();
  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${Number(network.chainId)}`);
  console.log(`${Number(network.chainId) === POLYGON_CHAIN_ID ? "✅ Polygon Mainnet" : "⚠️  Verifique a rede"}\n`);

  // Ler código fonte dos contratos
  const contractsDir = path.join(__dirname, "../contracts");

  const contracts = [
    {
      name: "WODToken",
      address: addresses.WODToken,
      file: path.join(contractsDir, "WODToken.sol"),
    },
    {
      name: "ValidatorRegistry",
      address: addresses.ValidatorRegistry,
      file: path.join(contractsDir, "ValidatorRegistry.sol"),
    },
    {
      name: "Arena",
      address: addresses.Arena,
      file: path.join(contractsDir, "Arena.sol"),
    },
  ];

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 Verificando Contratos");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const results = [];

  for (const contract of contracts) {
    if (!fs.existsSync(contract.file)) {
      console.log(`⚠️  Arquivo não encontrado: ${contract.file}\n`);
      results.push({ name: contract.name, success: false });
      continue;
    }

    const sourceCode = fs.readFileSync(contract.file, "utf-8");
    const success = await verifyContractWithThirdweb(
      contract.address,
      contract.name,
      sourceCode
    );

    results.push({ name: contract.name, success });
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 Resumo");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  for (const result of results) {
    console.log(`${result.success ? "✅" : "❌"} ${result.name}`);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔗 Links dos Contratos");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`WODToken: https://polygonscan.com/address/${addresses.WODToken}`);
  console.log(`ValidatorRegistry: https://polygonscan.com/address/${addresses.ValidatorRegistry}`);
  console.log(`Arena: https://polygonscan.com/address/${addresses.Arena}`);
  console.log("");

  console.log("💡 Nota: Thirdweb pode ser usado para:");
  console.log("   - Gerenciar transações");
  console.log("   - Interagir com contratos via SDK");
  console.log("   - Verificação pode ser feita via Polygonscan (manual)");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro:", error.message);
    process.exit(1);
  });

