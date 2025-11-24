# 💰 Previsão de Custos - Deploy na Polygon Mainnet

## 📊 Resumo Executivo

**Total Estimado:** ~0.05 - 0.15 MATIC (~$0.04 - $0.12 USD)

**Status:** ✅ Custos muito baixos (Polygon é uma das redes mais baratas)

---

## 🔍 Análise Detalhada

### 1. Deploy dos Contratos

#### WODToken.sol

- **Gas Estimado:** ~2.000.000 units
- **Complexidade:** Média
  - Herda de ERC20, AccessControl, Pausable (OpenZeppelin)
  - Configuração de roles no constructor
  - Funções de mint, burn, pause/unpause
- **Custo Estimado:** ~0.015 - 0.05 MATIC

#### ValidatorRegistry.sol

- **Gas Estimado:** ~1.500.000 units
- **Complexidade:** Média
  - Herda de Ownable, ReentrancyGuard
  - Sistema de stake e registro de validadores
  - Mappings e arrays para gerenciamento
- **Custo Estimado:** ~0.011 - 0.037 MATIC

#### Arena.sol

- **Gas Estimado:** ~3.000.000 units
- **Complexidade:** Alta
  - Herda de Ownable, ReentrancyGuard
  - Sistema complexo de desafios, submissões e votação
  - Múltiplos mappings aninhados
  - Lógica de consenso e distribuição de prêmios
- **Custo Estimado:** ~0.022 - 0.075 MATIC

### 2. Operações Pós-Deploy

#### Verificação no Polygonscan

- **Custo:** **GRATUITO** ✅
- **Método:** Via API (já configurada no `.env`)
- **Tempo:** ~1-2 minutos por contrato
- **Total:** 3 contratos = ~3-6 minutos

#### Transferência de Ownership

- **Custo:** Já incluído no deploy (ownership vai direto para Safe)
- **Gas Adicional:** 0 (não necessário)

#### Distribuição Inicial de Tokens (Opcional)

- **Gas por Transfer:** ~65.000 units
- **Número de Transferências:** 5 endereços
- **Total Estimado:** ~325.000 units = ~0.002 - 0.006 MATIC
- **Nota:** Executado via `initial-distribution.ts` (script separado)

---

## 💵 Cálculo de Custos por Cenário

### Cenário 1: Gas Price Baixo (30 gwei)

**Condições:** Rede com baixo tráfego

| Operação | Gas | Custo (MATIC) | Custo (USD @ $0.80) |
|----------|-----|---------------|---------------------|
| WODToken Deploy | 2.000.000 | 0.06 | $0.048 |
| ValidatorRegistry Deploy | 1.500.000 | 0.045 | $0.036 |
| Arena Deploy | 3.000.000 | 0.09 | $0.072 |
| **TOTAL DEPLOY** | **6.500.000** | **~0.195** | **~$0.156** |
| Verificação (3 contratos) | - | **GRATUITO** | **GRATUITO** |
| **TOTAL GERAL** | - | **~0.195 MATIC** | **~$0.156** |

### Cenário 2: Gas Price Médio (50 gwei)

**Condições:** Rede com tráfego normal

| Operação | Gas | Custo (MATIC) | Custo (USD @ $0.80) |
|----------|-----|---------------|---------------------|
| WODToken Deploy | 2.000.000 | 0.10 | $0.08 |
| ValidatorRegistry Deploy | 1.500.000 | 0.075 | $0.06 |
| Arena Deploy | 3.000.000 | 0.15 | $0.12 |
| **TOTAL DEPLOY** | **6.500.000** | **~0.325** | **~$0.26** |
| Verificação (3 contratos) | - | **GRATUITO** | **GRATUITO** |
| **TOTAL GERAL** | - | **~0.325 MATIC** | **~$0.26** |

### Cenário 3: Gas Price Alto (100 gwei)

**Condições:** Rede congestionada (raro na Polygon)

| Operação | Gas | Custo (MATIC) | Custo (USD @ $0.80) |
|----------|-----|---------------|---------------------|
| WODToken Deploy | 2.000.000 | 0.20 | $0.16 |
| ValidatorRegistry Deploy | 1.500.000 | 0.15 | $0.12 |
| Arena Deploy | 3.000.000 | 0.30 | $0.24 |
| **TOTAL DEPLOY** | **6.500.000** | **~0.65** | **~$0.52** |
| Verificação (3 contratos) | - | **GRATUITO** | **GRATUITO** |
| **TOTAL GERAL** | - | **~0.65 MATIC** | **~$0.52** |

---

## 📈 Comparação com Outras Redes

| Rede | Custo Estimado | Diferença |
|------|---------------|-----------|
| **Polygon** | **~$0.15 - $0.52** | **Baseline** |
| Ethereum Mainnet | ~$50 - $200 | **300-400x mais caro** |
| Arbitrum | ~$0.30 - $1.00 | 2x mais caro |
| Optimism | ~$0.25 - $0.80 | 1.5x mais caro |
| Base | ~$0.20 - $0.60 | 1.3x mais caro |

**✅ Polygon é uma das opções mais econômicas para deploy!**

---

## ⚠️ Custos Adicionais (Opcionais)

### 1. Distribuição Inicial de Tokens

Se executar `initial-distribution.ts`:

- **5 transferências** (Treasury, Founders, Partners, Liquidity, DAO)
- **Gas por transfer:** ~65.000 units
- **Total:** ~325.000 units = **~0.01 - 0.03 MATIC** (~$0.008 - $0.024)

### 2. Concessão de MINTER_ROLE à Arena

- **Gas:** ~50.000 units
- **Custo:** **~0.0015 - 0.005 MATIC** (~$0.0012 - $0.004)
- **Nota:** Executado via Safe Multisig (recomendado)

### 3. Criação de Pool de Liquidez (Uniswap)

- **Gas:** ~200.000 - 500.000 units
- **Custo:** **~0.006 - 0.05 MATIC** (~$0.005 - $0.04)
- **Nota:** Operação separada, não incluída no deploy

---

## 💡 Recomendações

### Saldo Mínimo Recomendado na Wallet

**1.0 MATIC** (para margem de segurança)

Isso cobre:

- ✅ Deploy completo (~0.2 - 0.65 MATIC)
- ✅ Distribuição inicial (~0.01 - 0.03 MATIC)
- ✅ Operações pós-deploy (~0.01 - 0.05 MATIC)
- ✅ Margem de segurança (~0.3 MATIC)

### Quando Fazer o Deploy

- ✅ **Melhor horário:** Madrugada (horário de menor tráfego)
- ✅ **Evitar:** Horários de pico (9h-18h UTC)
- ✅ **Monitorar:** Gas price antes de executar

### Verificação no Polygonscan

- ✅ **Custo:** GRATUITO
- ✅ **Tempo:** ~3-6 minutos total
- ✅ **API Key:** Já configurada no `.env`
- ✅ **Método:** Automático via `npm run verify:polygon`

---

## 📋 Checklist de Custos

Antes do deploy, verifique:

- [ ] Wallet tem pelo menos **1.0 MATIC**
- [ ] Gas price está razoável (< 50 gwei recomendado)
- [ ] `POLYGONSCAN_API_KEY` configurada (para verificação gratuita)
- [ ] `SAFE_ADDRESS` configurado (ownership automático)
- [ ] RPC URL funcionando (Alchemy configurada)

---

## 🔗 Links Úteis

- **Polygon Gas Tracker:** https://polygonscan.com/gastracker
- **Alchemy Dashboard:** https://dashboard.alchemy.com/
- **Polygonscan:** https://polygonscan.com
- **Safe Wallet:** https://app.safe.global/

---

## 📝 Notas Finais

1. **Custos são muito baixos** - Polygon é uma das redes mais econômicas
2. **Verificação é gratuita** - Não há custos adicionais para verificar contratos
3. **Safe Multisig** - Ownership vai direto para Safe (sem custo adicional)
4. **Estimativas conservadoras** - Valores reais podem ser menores

**Total Estimado Realista:** **~0.2 - 0.4 MATIC** (~$0.16 - $0.32 USD)

---

**Última atualização:** Janeiro 2025  
**Preço MATIC usado:** $0.80 USD (ajuste conforme mercado atual)

