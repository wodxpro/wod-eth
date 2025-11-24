# 📁 Qual Diretório Usar para Deploy

## ✅ **USE ESTE: `/wod-x-pro`** (Repositório Separado - CORRETO)

Este é o repositório **correto e atualizado** para fazer o deploy:

```
/Users/nettomello/CODIGOS/TOKENS/wod-eth/wod-x-pro/
```

### ✅ Características:

- **Package:** `@wodxpro/contract-data` (versão 1.0.0)
- **Contratos atualizados:**
  - `WODToken.sol` - 250 linhas (versão completa com AccessControl, roles, maxSupply)
  - `Arena.sol` - 411 linhas
  - `ValidatorRegistry.sol` - 159 linhas
- **Configuração:**
  - `hardhat.config.ts` aponta para `./contracts`
  - `.env` configurado com Polygon Mainnet
  - Scripts de deploy prontos
- **Estrutura:**
  ```
  wod-x-pro/
  ├── contracts/          ← Contratos aqui
  │   ├── WODToken.sol
  │   ├── Arena.sol
  │   └── ValidatorRegistry.sol
  ├── scripts/
  │   ├── deploy.ts       ← Script de deploy
  │   └── initialDistribution.ts
  ├── .env                ← SEU .env CONFIGURADO AQUI
  ├── hardhat.config.ts
  └── package.json
  ```

### ✅ Seu `.env` está aqui:
```
/Users/nettomello/CODIGOS/TOKENS/wod-eth/wod-x-pro/.env
```

**Conteúdo:**

- ✅ `POLYGON_RPC_URL` (Alchemy - Polygon Mainnet)
- ✅ `PRIVATE_KEY` (sua wallet de deploy)
- ✅ `SAFE_ADDRESS` (Safe Multisig)

---

## ❌ **NÃO USE: `/contracts`** (Resquício do Monorepo Antigo)

Este diretório é **resquício da separação do monorepo** e não deve ser usado:

```
/Users/nettomello/CODIGOS/TOKENS/wod-eth/contracts/
```

### ❌ Características (ANTIGO):

- **Package:** `@wodxpro/contracts` (versão 0.1.0 - antiga)
- **Contratos desatualizados:**
  - `WODToken.sol` - 31 linhas (versão antiga/simples, sem AccessControl)
  - `Arena.sol` - 411 linhas (mesma)
  - `ValidatorRegistry.sol` - 159 linhas (mesma)
- **Configuração antiga:**
  - `.env` com Mumbai (testnet) - desatualizado
  - Estrutura do monorepo antigo

### ⚠️ **Recomendação:**

Você pode:
1. **Ignorar** este diretório (não usar)
2. **Renomear** para `contracts.old` para evitar confusão
3. **Deletar** se tiver certeza que não precisa mais

---

## 🚀 **Como Fazer o Deploy (CORRETO)**

### 1. Navegue para o diretório correto:

```bash
cd /Users/nettomello/CODIGOS/TOKENS/wod-eth/wod-x-pro
```

### 2. Verifique que está no lugar certo:

```bash
pwd
# Deve mostrar: .../wod-x-pro

ls contracts/
# Deve mostrar: WODToken.sol, Arena.sol, ValidatorRegistry.sol

cat .env | grep POLYGON_RPC_URL
# Deve mostrar sua URL do Alchemy
```

### 3. Execute o deploy:
```bash
npm run compile
npm run test-connection
npm run deploy:polygon
```

---

## ✅ **Confirmação: Tudo Está Configurado Corretamente**

Seu setup está correto:
- ✅ Diretório: `wod-x-pro` (correto)
- ✅ Contratos: Versão atualizada (250 linhas WODToken)
- ✅ `.env`: Configurado com Polygon Mainnet
- ✅ `hardhat.config.ts`: Aponta para `./contracts`
- ✅ Scripts: Prontos para deploy

**O diretório `/contracts` pode ser ignorado - é resquício antigo.**

---

**Última atualização:** 12/11/2025

