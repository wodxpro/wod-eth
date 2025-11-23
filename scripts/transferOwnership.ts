import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function main() {
  const safeAddress = process.env.SAFE_ADDRESS;
  
  if (!safeAddress) {
    throw new Error("❌ SAFE_ADDRESS não configurado no .env");
  }

  // Validar formato do endereço
  if (!ethers.isAddress(safeAddress)) {
    throw new Error(`❌ Endereço Safe inválido: ${safeAddress}`);
  }

  const [deployer] = await ethers.getSigners();
  console.log("🔐 Conectando com account:", deployer.address);
  console.log("🛡️  Safe Address:", safeAddress);

  // Buscar endereço do WODToken
  const network = await ethers.provider.getNetwork();
  const chainId = Number(network.chainId);
  
  const chainNameMap: Record<number, string> = {
    80002: 'amoy',
    137: 'polygon',
    80001: 'mumbai',
  };
  
  const chainName = chainNameMap[chainId];
  
  if (!chainName) {
    throw new Error(`❌ Chain ID ${chainId} não suportado`);
  }

  const addressesFile = path.join(__dirname, '../addresses', `${chainName}.json`);
  
  if (!fs.existsSync(addressesFile)) {
    throw new Error(`❌ Arquivo de endereços não encontrado: ${addressesFile}`);
  }

  const addresses = JSON.parse(fs.readFileSync(addressesFile, 'utf-8'));
  const wodTokenAddress = addresses.WODToken;

  if (!wodTokenAddress) {
    throw new Error(`❌ WODToken address não encontrado em ${addressesFile}`);
  }

  console.log("📋 WODToken Address:", wodTokenAddress);

  // Conectar ao contrato
  const WODToken = await ethers.getContractFactory("WODToken");
  const wodToken = WODToken.attach(wodTokenAddress);

  // Verificar owner atual
  const currentOwner = await wodToken.owner();
  console.log("👤 Owner atual:", currentOwner);

  if (currentOwner.toLowerCase() === safeAddress.toLowerCase()) {
    console.log("✅ Ownership já está com o Safe!");
    return;
  }

  if (currentOwner.toLowerCase() !== deployer.address.toLowerCase()) {
    throw new Error(`❌ Deployer não é o owner atual. Owner: ${currentOwner}`);
  }

  // Transferir ownership
  console.log("\n🔄 Transferindo ownership...");
  const tx = await wodToken.transferOwnership(safeAddress);
  console.log("⏳ Transaction hash:", tx.hash);
  console.log("⏳ Aguardando confirmação...");
  
  const receipt = await tx.wait();
  console.log("✅ Transaction confirmada!");
  console.log("   Block number:", receipt?.blockNumber);
  console.log("   Gas used:", receipt?.gasUsed.toString());

  // Verificar novo owner
  const newOwner = await wodToken.owner();
  if (newOwner.toLowerCase() === safeAddress.toLowerCase()) {
    console.log("\n✅ Ownership transferido com sucesso para Safe!");
    console.log("   Novo owner:", newOwner);
  } else {
    throw new Error(`❌ Erro: Ownership não foi transferido. Owner atual: ${newOwner}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

