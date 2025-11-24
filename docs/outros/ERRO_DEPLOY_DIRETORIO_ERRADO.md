# ⚠️ ERRO: Deploy Executado no Diretório Errado

## ❌ O que aconteceu:

Você executou o deploy no diretório **ERRADO**:
```bash
cd contracts  # ❌ DIRETÓRIO ERRADO
npx hardhat run scripts/deploy.ts --network polygon
```

## 🔍 Problema Identificado:

1. **Contrato deployado:** `0x75166d2eFbaF63886dCD3F85c85Eb8061611BA68`
2. **Versão:** WODToken antigo (31 linhas) do diretório `/contracts`
3. **Erro:** `no matching fragment` para `mint(address, uint256, string)`
   - O contrato antigo só tem `mint(address, uint256)` (sem `reason`)
   - O script tentou chamar `mint(address, uint256, string)` (com `reason`)

## ✅ Solução:

### 1. Use o diretório CORRETO:

```bash
cd /Users/nettomello/CODIGOS/TOKENS/wod-eth/wod-x-pro  # ✅ CORRETO
```

### 2. Verifique que está no lugar certo:

```bash
pwd
# Deve mostrar: .../wod-x-pro

ls contracts/
# Deve mostrar: WODToken.sol (250 linhas), Arena.sol, ValidatorRegistry.sol
```

### 3. Execute o deploy no diretório correto:

```bash
npm run compile
npm run test-connection
npm run deploy:polygon
```

## 📋 Diferenças entre os diretórios:

| Característica | `/contracts` (ERRADO) | `/wod-x-pro` (CORRETO) |
|----------------|----------------------|------------------------|
| WODToken.sol | 31 linhas (antigo) | 250 linhas (atualizado) |
| Função mint | `mint(address, uint256)` | `mint(address, uint256, string)` |
| AccessControl | ❌ Não tem | ✅ Tem (roles) |
| Max Supply | ❌ Não tem | ✅ Tem (1B) |
| Pausable | ❌ Não tem | ✅ Tem |
| `.env` | Mumbai (testnet) | Polygon Mainnet |

## ⚠️ Sobre o contrato já deployado:

O contrato `0x75166d2eFbaF63886dCD3F85c85Eb8061611BA68` foi deployado com a versão antiga.

**Opções:**
1. **Fazer deploy novamente** no diretório correto (`wod-x-pro`) - vai gerar um novo endereço
2. **Usar o contrato antigo** (não recomendado - falta funcionalidades)

**Recomendação:** Faça deploy novamente no diretório correto para ter todas as funcionalidades.

---

**Lembre-se:** Sempre execute comandos de deploy a partir de `/wod-x-pro`!

