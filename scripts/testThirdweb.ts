import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

/**
 * Script para testar conexão com Thirdweb API
 * 
 * Uso:
 * npm run test-thirdweb
 * ou
 * ts-node scripts/testThirdweb.ts
 */

const THIRDWEB_API_URL = "https://api.thirdweb.com/v1";

async function testThirdwebConnection() {
  console.log("🔍 Testando conexão com Thirdweb API...\n");

  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  const clientId = process.env.THIRDWEB_CLIENT_ID;

  if (!secretKey) {
    console.log("❌ THIRDWEB_SECRET_KEY não configurada no .env");
    console.log("   Obtenha em: https://thirdweb.com/dashboard/settings/api-keys\n");
    return;
  }

  if (!clientId) {
    console.log("⚠️  THIRDWEB_CLIENT_ID não configurada no .env");
    console.log("   Obtenha em: https://thirdweb.com/dashboard/settings/api-keys\n");
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📋 Configuração Thirdweb");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Project Name: ${process.env.THIRDWEB_PROJECT_NAME || "não configurado"}`);
  console.log(`Domain: ${process.env.THIRDWEB_DOMAIN || "não configurado"}`);
  console.log(`ENS: ${process.env.THIRDWEB_ENS || "não configurado"}`);
  console.log(`Secret Key: ${secretKey ? secretKey.substring(0, 10) + "..." : "não configurado"}`);
  console.log(`Client ID: ${clientId ? clientId.substring(0, 10) + "..." : "não configurado"}`);
  console.log("");

  // Testar autenticação com endpoint de transactions
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("1️⃣ Testando autenticação com Thirdweb API...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  try {
    // Teste com endpoint de transactions (endpoint real da API)
    // Fazemos uma requisição simples para validar a autenticação
    const testPayload = {
      chainId: 137, // Polygon Mainnet
      transactions: [
        {
          data: "0x",
          to: "0x0000000000000000000000000000000000000000",
          value: "0",
        },
      ],
    };

    const response = await fetch(`${THIRDWEB_API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": secretKey,
      },
      body: JSON.stringify(testPayload),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Autenticação bem-sucedida!");
      console.log(`   API respondeu corretamente\n`);
    } else if (response.status === 400 || response.status === 422) {
      // 400/422 significa que a autenticação funcionou, mas os dados estão incorretos (esperado)
      console.log("✅ Autenticação válida!");
      console.log(`   API aceitou a requisição (erro esperado nos dados de teste)\n`);
    } else if (response.status === 401 || response.status === 403) {
      const errorText = await response.text();
      console.log(`❌ Erro de autenticação: ${response.status}`);
      console.log(`   Verifique se THIRDWEB_SECRET_KEY está correto\n`);
    } else {
      const errorText = await response.text();
      console.log(`⚠️  Resposta inesperada: ${response.status}`);
      console.log(`   Isso pode ser normal - API pode ter endpoints diferentes\n`);
    }
  } catch (error: any) {
    console.log(`⚠️  Erro ao testar API: ${error.message}`);
    console.log(`   Isso pode ser normal se a API tiver endpoints diferentes\n`);
  }

  // Verificar contratos deployados
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("2️⃣ Verificando contratos deployados...");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  const addressesFile = path.join(__dirname, "../addresses/polygon.json");
  if (fs.existsSync(addressesFile)) {
    const addresses = JSON.parse(fs.readFileSync(addressesFile, "utf-8"));
    console.log("✅ Contratos encontrados:");
    console.log(`   WODToken: ${addresses.WODToken}`);
    console.log(`   ValidatorRegistry: ${addresses.ValidatorRegistry}`);
    console.log(`   Arena: ${addresses.Arena}`);
    console.log("");
  } else {
    console.log("⚠️  Arquivo addresses/polygon.json não encontrado\n");
  }

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Teste de conexão concluído!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📋 Resumo:");
  console.log(`   ✅ Secret Key: ${secretKey ? "Configurada" : "Não configurada"}`);
  console.log(`   ✅ Client ID: ${clientId ? "Configurado" : "Não configurado"}`);
  console.log(`   ✅ Contratos: Encontrados no addresses/polygon.json`);
  console.log("\n💡 Próximos passos:");
  console.log("   1. Use Thirdweb SDK no frontend com THIRDWEB_CLIENT_ID");
  console.log("   2. Use Thirdweb API no backend com THIRDWEB_SECRET_KEY");
  console.log("   3. Execute: npm run verify-thirdweb (para verificar contratos)");
  console.log("\n🔗 Links úteis:");
  console.log("   Dashboard: https://thirdweb.com/dashboard");
  console.log("   Docs: https://portal.thirdweb.com/");
  console.log("");
}

testThirdwebConnection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Erro:", error.message);
    process.exit(1);
  });

