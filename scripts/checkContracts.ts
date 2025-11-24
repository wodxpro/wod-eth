import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🔍 Verificando contratos no addresses/polygon.json...\n");

  const addressesFile = path.join(__dirname, "../addresses/polygon.json");
  let addresses: any = {};

  if (fs.existsSync(addressesFile)) {
    addresses = JSON.parse(fs.readFileSync(addressesFile, "utf-8"));
    console.log("✅ Arquivo addresses/polygon.json encontrado\n");
  } else {
    console.log("❌ Arquivo addresses/polygon.json não encontrado\n");
    return;
  }

  const provider = ethers.provider;
  const contracts = {
    WODToken: addresses.WODToken,
    ValidatorRegistry: addresses.ValidatorRegistry,
    Arena: addresses.Arena,
  };

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Verificando existência na rede Polygon...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  for (const [name, address] of Object.entries(contracts)) {
    if (!address) {
      console.log(`⚠️  ${name}: Endereço não encontrado no arquivo`);
      continue;
    }

    try {
      const code = await provider.getCode(address);
      if (code && code !== "0x") {
        console.log(`✅ ${name}: ${address}`);
        console.log(`   Status: EXISTE na rede`);
        
        // Tentar obter owner (se possível)
        try {
          const contract = new ethers.Contract(
            address,
            ["function owner() view returns (address)"],
            provider
          );
          const owner = await contract.owner();
          console.log(`   Owner: ${owner}`);
        } catch {
          // Não tem função owner ou erro
        }
        console.log("");
      } else {
        console.log(`❌ ${name}: ${address}`);
        console.log(`   Status: NÃO EXISTE na rede\n`);
      }
    } catch (error: any) {
      console.log(`⚠️  ${name}: ${address}`);
      console.log(`   Erro: ${error.message}\n`);
    }
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Informações do arquivo:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Deployer: ${addresses.deployer || "N/A"}`);
  console.log(`Safe Address: ${addresses.safeAddress || "N/A"}`);
  console.log(`Deployed At: ${addresses.deployedAt || "N/A"}`);
  console.log(`Network: ${addresses.network || "N/A"}`);
  console.log(`Chain ID: ${addresses.chainId || "N/A"}`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

