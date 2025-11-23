# ✅ Checklist Final Antes do Deploy

## 🎯 Deploy na Polygon Mainnet (Chain ID: 137)

Use este checklist antes de executar o deploy definitivo dos contratos.

## 📋 Pré-requisitos

### 1. Configuração do `.env`

- [x] Arquivo `.env` criado a partir de `.env.example`
- [x] `PRIVATE_KEY` configurada (wallet com saldo de $MATIC)
- [x] `POLYGON_RPC_URL` configurada (Alchemy/Infura)
- [x] `SAFE_ADDRESS` configurado e verificado
- [x] `POLYGONSCAN_API_KEY` configurada (para verificação)

### 2. Safe Wallet

- [x] Safe criado na **Polygon Mainnet**
- [x] Endereço do Safe copiado para `SAFE_ADDRESS`
- [x] Signatários (owners) configurados no Safe
- [x] Safe testado e funcionando

### 3. Wallet de Deploy

- [x] Wallet tem saldo suficiente (~0.5 MATIC recomendado)
- [x] `PRIVATE_KEY` corresponde à wallet correta
- [x] Wallet conectada à Polygon Mainnet

### 4. RPC Connection

- [x] `POLYGON_RPC_URL` testada e funcionando
- [x] Conexão com Polygon Mainnet estabelecida

### 5. Contratos

- [ ] Contratos compilados sem erros: `npm run compile`
- [ ] Testes passando: `npm test`
- [ ] Código revisado e aprovado

## 🚀 Deploy

### Comandos

```bash
cd wod-x-pro
npm install
npm run compile
npm run deploy:polygon
```

### Durante o Deploy

- [ ] Monitorar o output do console
- [ ] Verificar se todas as validações pré-deploy passaram
- [ ] Verificar se todos os 3 contratos foram deployados
- [ ] Confirmar que ownership está com Safe (verificação automática)
- [ ] Anotar os endereços dos contratos

## ✅ Pós-Deploy

### 1. Verificação

- [ ] Endereços salvos em `addresses/polygon.json`
- [ ] Deployment info salvo em `deployments/polygon-mainnet-*.json`
- [ ] Ownership de todos os contratos está com Safe (verificado automaticamente)
- [ ] Verificar no Polygonscan: https://polygonscan.com

### 2. Verificação de Código

```bash
npm run verify:polygon
```

- [ ] WODToken verificado no Polygonscan
- [ ] ValidatorRegistry verificado no Polygonscan
- [ ] Arena verificado no Polygonscan

### 3. Validação Final

- [ ] Acessar cada contrato no Polygonscan
- [ ] Verificar que o código fonte está visível
- [ ] Confirmar que o owner do WODToken é o Safe
- [ ] Testar função `owner()` do WODToken

## 📝 Endereços para Documentar

Após o deploy, documente:

- [ ] WODToken Address: `0x...`
- [ ] ValidatorRegistry Address: `0x...`
- [ ] Arena Address: `0x...`
- [ ] Safe Address: `0x...`
- [ ] Deployer Address: `0x...`
- [ ] Transaction Hashes: `0x...`

## ⚠️ Importante

- ⚠️ Deploy é **irreversível**
- ⚠️ Contratos serão **imutáveis**
- ⚠️ Certifique-se de que tudo está correto antes
- ⚠️ Mantenha backup dos endereços e transaction hashes

## 🔗 Links Úteis

- **Polygonscan**: https://polygonscan.com
- **Safe Wallet**: https://safe.global/
- **Alchemy Dashboard**: https://dashboard.alchemy.com/

---

**Data do Deploy:** _______________
**Rede:** Polygon Mainnet (Chain ID: 137)
**Status:** ⬜ Pendente | ✅ Concluído

