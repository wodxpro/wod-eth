import * as fs from "fs";
import * as path from "path";

/**
 * Script para atualizar o arquivo WODToken_Initial_Distribution.json
 * com os dados do deploy e distribuição
 * 
 * Uso:
 * npm run update-distribution-file
 */

async function main() {
  console.log("\n📝 Atualizando WODToken_Initial_Distribution.json...\n");

  const distributionFile = path.join(__dirname, '../../WODToken_Initial_Distribution.json');
  
  if (!fs.existsSync(distributionFile)) {
    throw new Error(`Arquivo não encontrado: ${distributionFile}`);
  }

  const distribution = JSON.parse(fs.readFileSync(distributionFile, 'utf-8'));

  // Buscar deployment mais recente
  const deploymentsDir = path.join(__dirname, '../deployments');
  let tokenAddress = '';
  let safeAddress = '';
  let deploymentDate = '';

  if (fs.existsSync(deploymentsDir)) {
    const files = fs.readdirSync(deploymentsDir)
      .filter(f => f.startsWith('polygon-mainnet-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length > 0) {
      const latestDeployment = JSON.parse(
        fs.readFileSync(path.join(deploymentsDir, files[0]), 'utf-8')
      );
      tokenAddress = latestDeployment.contracts?.WODToken?.address || '';
      safeAddress = latestDeployment.safeMultisig || '';
      deploymentDate = latestDeployment.deployedAt || '';
    }
  }

  // Buscar proof de distribuição mais recente
  let distributionDate = '';
  let totalDistributed = '';
  
  if (fs.existsSync(deploymentsDir)) {
    const files = fs.readdirSync(deploymentsDir)
      .filter(f => f.startsWith('distribution-proof-') && f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length > 0) {
      const latestProof = JSON.parse(
        fs.readFileSync(path.join(deploymentsDir, files[0]), 'utf-8')
      );
      distributionDate = latestProof.distributedAt || '';
      totalDistributed = latestProof.totalDistributed || '';
    }
  }

  // Atualizar dados
  if (tokenAddress) {
    distribution.deployment.token_address = tokenAddress;
    console.log("✅ Token address atualizado:", tokenAddress);
  }

  if (safeAddress) {
    distribution.deployment.safe_multisig = safeAddress;
    console.log("✅ Safe multisig atualizado:", safeAddress);
  }

  if (deploymentDate) {
    distribution.deployment.date = deploymentDate;
    console.log("✅ Data de deploy atualizada:", deploymentDate);
  }

  // Salvar arquivo atualizado
  fs.writeFileSync(distributionFile, JSON.stringify(distribution, null, 4));
  console.log("\n✅ Arquivo atualizado com sucesso!");
  console.log(`   Arquivo: ${distributionFile}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro ao atualizar arquivo:");
    console.error(error);
    process.exit(1);
  });

