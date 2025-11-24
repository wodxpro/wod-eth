# ✅ Checklist Final - Deploy Urgente (Sem Safe)

## 🎯 Status: PRONTO PARA DEPLOY

**Data/Hora:** Madrugada (melhor horário - gas baixo)  
**Rede:** Polygon Mainnet (Chain ID: 137)  
**Modo:** Urgente (sem Safe - ownership com deployer)

---

## ✅ Verificações Pré-Deploy

### 1. Arquivo `.env` Configurado

- [x] `PRIVATE_KEY` configurada (wallet com MATIC)
- [x] `POLYGON_RPC_URL` configurada (Alchemy)
- [x] `ETHERSCAN_API_KEY` configurada (para verificação)
- [x] `SAFE_ADDRESS` **NÃO configurado** (OK - usando deployer como owner)

### 2. Contratos Compilados

- [x] Execute: `npm run compile`
- [x] Sem erros de compilação
- [x] Artifacts gerados

### 3. Wallet de Deploy

- [ ] Wallet tem pelo menos **1.0 MATIC** (recomendado)
- [ ] `PRIVATE_KEY` corresponde à wallet correta
- [ ] Wallet conectada à Polygon Mainnet

### 4. RPC Connection

- [ ] `POLYGON_RPC_URL` testada e funcionando
- [ ] Conexão com Polygon Mainnet estabelecida

---

## 🚀 Comandos de Deploy

### 1. Compilar Contratos
```bash
npm run compile
```

### 2. Executar Deploy
```bash
npm run deploy:polygon
```

**O que vai acontecer:**

- ✅ Deploy de WODToken (ownership com deployer)
- ✅ Deploy de ValidatorRegistry (ownership com deployer)
- ✅ Deploy de Arena (ownership com deployer)
- ✅ Salvar endereços em `addresses/polygon.json`
- ✅ Salvar deployment completo em `deployments/`

### 3. Verificar Contratos (Automático)

```bash
npm run verify:polygon
```

**Nota:** Verificação usa `ETHERSCAN_API_KEY` (já configurada)

---

## 📋 Durante o Deploy

- [ ] Monitorar output do console
- [ ] Verificar se todas as validações passaram
- [ ] Confirmar que todos os 3 contratos foram deployados
- [ ] Anotar os endereços dos contratos
- [ ] Verificar gas price (deve estar baixo - madrugada)

---

## ✅ Pós-Deploy

### 1. Verificação Automática

- [ ] Script executou verificação automaticamente
- [ ] Todos os 3 contratos verificados no Polygonscan
- [ ] Código fonte visível em cada contrato

### 2. Verificação Manual (se necessário)
Acesse cada contrato no Polygonscan:
- [ ] WODToken: `https://polygonscan.com/address/[WOD_TOKEN_ADDRESS]`
- [ ] ValidatorRegistry: `https://polygonscan.com/address/[VALIDATOR_REGISTRY_ADDRESS]`
- [ ] Arena: `https://polygonscan.com/address/[ARENA_ADDRESS]`

Verifique:
- [ ] Código fonte está visível
- [ ] Owner é a wallet de deploy (correto para modo urgente)
- [ ] Contratos funcionando

### 3. Validação de Ownership
- [ ] WODToken: `owner()` retorna endereço do deployer
- [ ] ValidatorRegistry: `owner()` retorna endereço do deployer
- [ ] Arena: `owner()` retorna endereço do deployer

---

## 📝 Endereços para Documentar

Após o deploy, os endereços estarão em:
- **Arquivo:** `addresses/polygon.json`
- **Deployment completo:** `deployments/polygon-*.json`

Documente:
- [ ] WODToken Address: `0x...`
- [ ] ValidatorRegistry Address: `0x...`
- [ ] Arena Address: `0x...`
- [ ] Deployer Address: `0x...`
- [ ] Transaction Hashes: `0x...`

---

## ⚠️ Importante - Modo Urgente

**ATENÇÃO:** Como estamos em modo urgente sem Safe:

1. **Ownership está com a wallet de deploy** (não Safe)
2. **Segurança:** Considere transferir ownership para Safe depois
3. **Backup:** Guarde a chave privada em local seguro
4. **Próximos passos:** Após deploy, planeje migração para Safe

---

## 🔄 Próximos Passos (Após Deploy)

### 1. Distribuição Inicial (Opcional)
```bash
npm run initial-distribution
```

### 2. Conceder MINTER_ROLE à Arena
Via wallet de deploy:
- Token: `[WOD_TOKEN_ADDRESS]`
- Arena: `[ARENA_ADDRESS]`
- Role: `MINTER_ROLE`

### 3. Criar Pool de Liquidez
- Uniswap V3 na Polygon
- Endereço: `LIQUIDITY_ADDRESS` do `.env`

### 4. Transferir Ownership para Safe (Futuro)
Quando tiver tempo:
- Criar Safe Multisig
- Transferir ownership de todos os contratos
- Configurar roles adequadas

---

## 🆘 Troubleshooting

### Erro: "Insufficient balance"
- **Solução:** Adicione mais MATIC na wallet
- **Recomendado:** 1.0 MATIC mínimo

### Erro: "Network mismatch"
- **Solução:** Verifique `POLYGON_RPC_URL` no `.env`
- **Teste:** `npm run test-connection`

### Erro na Verificação
- **Solução:** Verifique `ETHERSCAN_API_KEY` no `.env`
- **Alternativa:** Verificação manual no Polygonscan

### Gas Price Muito Alto
- **Solução:** Espere alguns minutos (madrugada deve ter gas baixo)
- **Monitor:** https://polygonscan.com/gastracker

---

## 📊 Custos Esperados

- **Deploy:** ~0.2 - 0.4 MATIC (~$0.16 - $0.32)
- **Verificação:** GRATUITA ✅
- **Total:** ~0.2 - 0.4 MATIC

---

## ✅ Checklist Rápido

Antes de executar `npm run deploy:polygon`:

- [ ] `.env` configurado (PRIVATE_KEY, POLYGON_RPC_URL, ETHERSCAN_API_KEY)
- [ ] Contratos compilados (`npm run compile`)
- [ ] Wallet tem pelo menos 1.0 MATIC
- [ ] É madrugada (gas baixo) ✅
- [ ] RPC funcionando
- [ ] Pronto para deploy!

---

**🚀 Tudo pronto? Execute: `npm run deploy:polygon`**

