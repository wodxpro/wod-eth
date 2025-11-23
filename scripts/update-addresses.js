const fs = require('fs');
const path = require('path');

const addressesDir = path.join(__dirname, '../addresses');

// Criar diretório se não existir
if (!fs.existsSync(addressesDir)) {
  fs.mkdirSync(addressesDir, { recursive: true });
}

// Template para novos endereços
const template = {
  Arena: process.env.ARENA_ADDRESS || '0x0000000000000000000000000000000000000000',
  WODToken: process.env.WOD_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000',
  ValidatorRegistry: process.env.VALIDATOR_REGISTRY_ADDRESS || '0x0000000000000000000000000000000000000000',
};

// Atualizar endereços por chain
const chains = ['amoy', 'polygon', 'mumbai'];

chains.forEach(chain => {
  const filePath = path.join(addressesDir, `${chain}.json`);
  
  // Se arquivo existe, preservar endereços existentes
  let addresses = template;
  if (fs.existsSync(filePath)) {
    addresses = { ...template, ...JSON.parse(fs.readFileSync(filePath, 'utf8')) };
  }
  
  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
  console.log(`✅ Updated addresses for ${chain}`);
});

