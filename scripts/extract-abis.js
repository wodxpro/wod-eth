const fs = require('fs');
const path = require('path');

const artifactsDir = path.join(__dirname, '../artifacts/contracts');
const abisDir = path.join(__dirname, '../abis');

// Criar diretório abis se não existir
if (!fs.existsSync(abisDir)) {
  fs.mkdirSync(abisDir, { recursive: true });
}

const contracts = ['Arena', 'WODToken', 'ValidatorRegistry'];

contracts.forEach(contract => {
  const artifactPath = path.join(artifactsDir, `${contract}.sol`, `${contract}.json`);
  const abiPath = path.join(abisDir, `${contract}.json`);
  
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
    console.log(`✅ Extracted ABI for ${contract}`);
  } else {
    console.warn(`⚠️  Artifact not found for ${contract}`);
  }
});

