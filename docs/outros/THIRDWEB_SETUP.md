# 🔗 Configuração Thirdweb

## 📋 Informações do Projeto

- **Project Name:** `wodxpro`
- **Domain:** `wodx.pro`
- **Email:** `admin@wodx.pro`
- **ENS:** `wodxpro.eth`
- **Team URL:** https://thirdweb.com/team/wodxpro

---

## 🔑 Variáveis de Ambiente

Adicione ao arquivo `.env`:

```env
# ============================================
# THIRDWEB CONFIGURATION
# ============================================

# Thirdweb Secret Key (para API)
# Obtenha em: https://thirdweb.com/dashboard/settings/api-keys
# ⚠️ NUNCA compartilhe esta chave!
THIRDWEB_SECRET_KEY=seu_secret_key_aqui

# Thirdweb Client ID (para frontend)
# Obtenha em: https://thirdweb.com/dashboard/settings/api-keys
THIRDWEB_CLIENT_ID=seu_client_id_aqui

# Thirdweb Project Info
THIRDWEB_PROJECT_NAME=wodxpro
THIRDWEB_DOMAIN=wodx.pro
THIRDWEB_ENS=wodxpro.eth
```

---

## 🌐 Allowed Domains

No dashboard do Thirdweb, configure:

```
wodx.pro
*.wodx.pro
localhost:3000
localhost:3001
```

**Explicação:**
- `wodx.pro` - Domínio principal
- `*.wodx.pro` - Todos os subdomínios
- `localhost:3000` - Desenvolvimento local (Next.js padrão)
- `localhost:3001` - Porta alternativa

---

## 🧪 Testar Conexão

### 1. Testar API Connection

```bash
npm run test-thirdweb
```

Este script verifica:
- ✅ Se as variáveis estão configuradas
- ✅ Se a API Thirdweb está acessível
- ✅ Se a autenticação funciona
- ✅ Se os contratos estão deployados

### 2. Verificar Contratos

```bash
npm run verify-thirdweb
```

Este script:
- ✅ Verifica se os contratos existem na rede
- ✅ Lê informações básicas dos contratos
- ✅ Valida configuração

---

## 📡 Usando Thirdweb API

### Exemplo: Enviar Transação

```bash
curl https://api.thirdweb.com/v1/transactions \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'x-secret-key: SEU_SECRET_KEY' \
  --data '{
    "chainId": 137,
    "transactions": [
      {
        "data": "0x",
        "to": "0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e",
        "value": "0"
      }
    ]
  }'
```

### Exemplo: Usar no Frontend

```typescript
import { createThirdwebClient } from "thirdweb";
import { defineChain } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const polygon = defineChain({
  id: 137,
  name: "Polygon",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpc: process.env.NEXT_PUBLIC_POLYGON_RPC_URL!,
});
```

---

## 🔍 Verificação de Contratos

### Status Atual

Thirdweb pode ser usado para:
- ✅ Gerenciar transações via API
- ✅ Interagir com contratos via SDK
- ✅ Facilitar integração frontend

**Para verificação no Polygonscan:**
- Use o guia manual: [`../verificacao/GUIA_VERIFICACAO.md`](../verificacao/GUIA_VERIFICACAO.md)
- Ou aguarde suporte automático via Thirdweb (se disponível)

---

## 📝 Scripts Disponíveis

### `npm run test-thirdweb`
Testa conexão com Thirdweb API e valida configuração.

### `npm run verify-thirdweb`
Verifica contratos deployados usando Thirdweb (validação local).

---

## 🔗 Links Úteis

- **Dashboard Thirdweb:** https://thirdweb.com/dashboard
- **API Keys:** https://thirdweb.com/dashboard/settings/api-keys
- **Documentação API:** https://portal.thirdweb.com/
- **SDK Docs:** https://portal.thirdweb.com/sdk

---

## ⚠️ Segurança

1. **NUNCA** commite o `.env` no git
2. **NUNCA** compartilhe `THIRDWEB_SECRET_KEY`
3. Use `THIRDWEB_CLIENT_ID` apenas no frontend (pode ser público)
4. Configure `Allowed Domains` corretamente no dashboard

---

**✅ Configuração completa! Use os scripts para testar a conexão.**

