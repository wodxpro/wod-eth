# 🚀 Guia de Deploy - Polygon Mainnet

Este guia explica como configurar o `.env` e fazer o **deploy definitivo** dos contratos do WOD X PRO na **Polygon Mainnet (Chain ID: 137)**.

⚠️ **ATENÇÃO:** Este é um deploy em **produção real**. Os contratos serão **imutáveis** após o deploy. Certifique-se de ter revisado tudo antes de prosseguir.

## 📋 Qual `.env.example` usar?

**Use:** `wod-x-pro/.env.example`

Este é o arquivo correto para o repositório de contratos.

## 🔧 Passo a Passo

### 1. Criar arquivo `.env`

No diretório `wod-x-pro/`, copie o `.env.example`:

```bash
cd wod-x-pro
cp .env.example .env
```

### 2. Configurar variáveis obrigatórias

Edite o arquivo `.env` e configure as seguintes variáveis:

#### ✅ Obrigatórias para Deploy

```env
# 1. Private Key (OBRIGATÓRIO)
# Sua chave privada da wallet que fará o deploy
# ⚠️ NUNCA compartilhe esta chave!
# Wallet deve ter saldo de $MATIC para gas fees
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# 2. RPC URL (OBRIGATÓRIO)
# Use Alchemy, Infura ou outro provedor RPC para Polygon Mainnet
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

**Como obter RPC URL:**

- **Alchemy**: https://www.alchemy.com/ → Criar app → Polygon → Copiar HTTP URL
- **Infura**: https://infura.io/ → Criar projeto → Polygon → Copiar endpoint

#### 🛡️ Safe Address (OBRIGATÓRIO para produção)

```env
# 3. Safe Address (OBRIGATÓRIO para produção)
# Endereço do Safe que receberá o ownership do WODToken
# O ownership será transferido automaticamente após deploy
SAFE_ADDRESS=0xYourSafeAddressHere
```

**Por que usar Safe?**

- ✅ Controle multisig (múltiplas assinaturas necessárias)
- ✅ Maior segurança institucional
- ✅ O ownership do token será transferido automaticamente após deploy
- ✅ **Recomendado para produção**

**Como criar um Safe:**

1. Acesse [Safe Wallet](https://safe.global/)
2. Conecte sua wallet
3. Crie um novo Safe na **Polygon Mainnet**
4. Configure os signatários (owners) - recomendado: 2-3 signatários
5. Confirme a criação do Safe
6. Copie o endereço do Safe para `SAFE_ADDRESS`

#### 📝 Opcional (mas recomendado)

```env
# 4. API Key (para verificação de contratos no Polygonscan)
# Obtenha em: https://polygonscan.com/myapikey
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
```

### 3. Exemplo completo de `.env` para deploy em produção

```env
# ============================================
# CONFIGURAÇÃO PARA DEPLOY NA POLYGON MAINNET
# ============================================

# RPC URL (Alchemy recomendado)
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# Private Key (sua wallet de deploy - deve ter $MATIC)
PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Safe Address (multisig - OBRIGATÓRIO para produção)
SAFE_ADDRESS=0xYourSafeAddressHere

# API Key (para verificação no Polygonscan)
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Endereços (serão preenchidos automaticamente após deploy)
# Não precisa configurar agora
```

## 🎯 O que acontece no deploy

### Com `SAFE_ADDRESS` configurado (OBRIGATÓRIO):

1. ✅ Validações pré-deploy (saldo, endereços, etc.)
2. ✅ Contratos são deployados com sua `PRIVATE_KEY`
3. ✅ **Todos os contratos são deployados DIRETAMENTE com Safe como owner**
   - WODToken → Owner: Safe
   - ValidatorRegistry → Owner: Safe
   - Arena → Owner: Safe
4. ✅ Verificação automática de ownership após deploy
5. ✅ Endereços são salvos em `addresses/polygon.json` e `deployments/`
6. ✅ Informações detalhadas de cada contrato
7. ✅ Resumo completo do deploy

### Sem `SAFE_ADDRESS` configurado:

❌ **O deploy vai FALHAR** - `SAFE_ADDRESS` é obrigatório para produção.

Se você já fez deploy sem Safe, use `npm run transfer-ownership` para corrigir.

## 🚀 Executar o Deploy

### ⚠️ Checklist Antes do Deploy

- [ ] `.env` criado e configurado
- [ ] `PRIVATE_KEY` configurada (wallet com saldo de $MATIC)
- [ ] `POLYGON_RPC_URL` configurada (Alchemy/Infura)
- [ ] `SAFE_ADDRESS` configurado e verificado
- [ ] Safe criado na Polygon Mainnet
- [ ] Wallet tem saldo suficiente (recomendado: ~0.5 MATIC)
- [ ] `npm install` executado
- [ ] Contratos compilados: `npm run compile`

### Testar Conexão (ANTES do Deploy)

```bash
npm run test-connection
```

Isso vai verificar se tudo está configurado corretamente antes do deploy.

### Deploy em Polygon Mainnet

```bash
cd wod-x-pro
npm install
npm run compile
npm run test-connection  # Teste a conexão primeiro!
npm run deploy:polygon
```

**Tempo estimado:** 2-5 minutos (dependendo do congestionamento da rede)

## ✅ Verificação Pós-Deploy

Após o deploy, o script automaticamente:

1. ✅ Salva os endereços em `addresses/polygon.json`
2. ✅ Salva informações completas em `deployments/polygon-mainnet-*.json`
3. ✅ Verifica que o ownership está correto (Safe é owner de todos os contratos)
4. ✅ Mostra resumo completo do deploy no console

### Verificar Ownership

O script já verifica automaticamente o ownership após o deploy. Você também pode verificar manualmente:

```bash
# Verificar no Polygonscan
# Acesse: https://polygonscan.com/address/WOD_TOKEN_ADDRESS
# Verifique a função "owner()" - deve retornar o SAFE_ADDRESS
```

O script de deploy já faz essa verificação automaticamente e mostra se está correto.

### Verificar Contratos no Polygonscan

```bash
npm run verify:polygon
```

Isso vai verificar todos os contratos no Polygonscan, permitindo visualização do código fonte.

## 🔄 Transferir Ownership Depois

Se você fez deploy sem Safe e quer transferir depois:

1. Configure `SAFE_ADDRESS` no `.env`
2. Execute:

```bash
npm run transfer-ownership
```

Isso vai:

- Conectar ao contrato `WODToken` deployado
- Verificar o owner atual
- Transfere o ownership para o `SAFE_ADDRESS` configurado
- Aguarda confirmação
- Valida que a transferência foi bem-sucedida

## 📊 O que é deployado

O script `deploy.ts` faz deploy de **3 contratos**:

1. **WODToken** - Token ERC20 "WOD X PRO" ($WOD)
2. **ValidatorRegistry** - Registro de validadores com stake
3. **Arena** - Contrato principal de desafios

**Ordem de deploy:**

1. WODToken (recebe ownership do deployer inicialmente)
2. Transferência de ownership para Safe (se configurado)
3. ValidatorRegistry (usa endereço do WODToken)
4. Arena (usa endereços de WODToken e ValidatorRegistry)

## ⚠️ Importante

### ⚠️ Deploy é Irreversível

- Os contratos serão **imutáveis** após deploy
- Não há como "desfazer" o deploy
- Certifique-se de ter testado localmente antes

### ⚠️ Gas Fees

- Deploy de 3 contratos pode custar ~0.1-0.3 MATIC
- Certifique-se de ter saldo suficiente
- Verifique o saldo antes: `npm run check-balance`

### ⚠️ Safe Address

- **OBRIGATÓRIO** para produção
- Sem Safe, o ownership fica com a wallet de deploy (risco de segurança)
- Configure o Safe **antes** do deploy

## 📝 Exemplo de Output do Deploy

```
Deploying contracts with account: 0x...
Account balance: 1000000000000000000

🚀 Deploying WODToken...
✅ WODToken deployed to: 0x...

🛡️ Transferring ownership to Safe: 0x...
✅ Ownership transferred to Safe: 0x...
   Transaction hash: 0x...

🚀 Deploying ValidatorRegistry...
✅ ValidatorRegistry deployed to: 0x...

🚀 Deploying Arena...
✅ Arena deployed to: 0x...

📋 Deployment Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WODToken: 0x...
ValidatorRegistry: 0x...
Arena: 0x...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 Addresses saved to addresses/polygon.json
```

## 🔗 Links Úteis

- **Polygonscan**: https://polygonscan.com
- **Safe Wallet**: https://safe.global/
- **Alchemy**: https://www.alchemy.com/
- **Polygon RPC**: https://docs.polygon.technology/docs/develop/network-details/network/

## 📞 Suporte

Se tiver problemas:

1. Verifique os logs do deploy
2. Confirme se todas as variáveis estão configuradas
3. Verifique se a wallet tem saldo suficiente
4. Confirme que o Safe foi criado na Polygon Mainnet
5. Verifique a conexão RPC

---

**⚠️ Última verificação antes do deploy:**

- [ ] Safe criado e endereço copiado
- [ ] `.env` configurado corretamente
- [ ] Wallet tem saldo de $MATIC
- [ ] RPC URL funcionando
- [ ] Contratos compilados sem erros

**Data:** Dezembro 2024
**Rede:** Polygon Mainnet (Chain ID: 137)
