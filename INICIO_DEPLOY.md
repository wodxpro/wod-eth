# 🚀 Guia de Deploy - WOD X PRO Token

## ✅ Status Atual

- ✅ Repositórios separados e na organização `wodxpro`
- ✅ Testes passando
- ✅ CI/CD funcionando
- ✅ Pronto para deploy em produção

## 📁 Trabalhar Apenas no `wodxpro/wod-eth`

**SIM, você pode fechar este projeto e trabalhar apenas no repositório separado!**

### Clonar o Repositório Separado

```bash
# Sair do projeto atual
cd ~

# Clonar o repositório de contratos
git clone https://github.com/wodxpro/wod-eth.git
cd wod-eth

# Instalar dependências
npm install
```

### Estrutura do Repositório `wodxpro/wod-eth`

```
wod-eth/
├── contracts/          # Contratos Solidity
│   ├── WODToken.sol
│   ├── Arena.sol
│   └── ValidatorRegistry.sol
├── scripts/            # Scripts de deploy
│   ├── deploy.ts       # ✅ Script principal
│   ├── transferOwnership.ts
│   ├── initialDistribution.ts
│   └── verify.ts
├── test/               # Testes
│   └── Arena.test.ts
├── addresses/          # Endereços por rede
│   ├── polygon.json
│   ├── amoy.json
│   └── mumbai.json
├── .env.example        # Template de configuração
├── hardhat.config.ts
└── package.json
```

---

## 🎯 Próximos Passos para Deploy

### 1. Configurar Ambiente

```bash
cd wod-eth
cp .env.example .env
```

Edite o `.env` com:

```env
# OBRIGATÓRIO
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
SAFE_ADDRESS=0x...  # Endereço do Safe Multisig

# RECOMENDADO
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### 2. Verificar Configuração

```bash
# Testar conexão
npm run test-connection

# Verificar saldo
npm run check-balance
```

### 3. Compilar Contratos

```bash
npm run compile
```

### 4. Executar Deploy

```bash
npm run deploy:polygon
```

O script vai:
- ✅ Validar configurações
- ✅ Verificar saldo
- ✅ Fazer deploy dos 3 contratos
- ✅ Transferir ownership para Safe automaticamente
- ✅ Salvar endereços em `addresses/polygon.json`
- ✅ Mostrar próximos passos

### 5. Verificar Contratos

```bash
# Verificar no Polygonscan
npm run verify:polygon
```

### 6. Distribuição Inicial (Opcional)

Se quiser fazer distribuição inicial de tokens:

```bash
# Configurar endereços no .env
TREASURY_ADDRESS=0x...
FOUNDER_ADDRESS=0x...
# etc...

# Executar distribuição
npm run initial-distribution
```

---

## 📋 Checklist Pré-Deploy

- [ ] Safe criado na Polygon Mainnet
- [ ] `SAFE_ADDRESS` configurado no `.env`
- [ ] `PRIVATE_KEY` configurada (wallet com saldo)
- [ ] `POLYGON_RPC_URL` configurada (Alchemy/Infura)
- [ ] Wallet tem saldo suficiente (~0.5 MATIC)
- [ ] Contratos compilados sem erros
- [ ] Testes passando

---

## 🔗 Links Úteis

- **Repositório:** https://github.com/wodxpro/wod-eth
- **Safe Wallet:** https://app.safe.global/
- **Polygonscan:** https://polygonscan.com
- **Alchemy:** https://dashboard.alchemy.com/

---

## 📝 Documentação Completa

Consulte os arquivos no repositório:
- `GUIA_DEPLOY.md` - Guia completo de deploy
- `DEPLOY_CHECKLIST.md` - Checklist detalhado
- `PROXIMOS_PASSOS.md` - Passos pós-deploy
- `README.md` - Documentação geral

---

**Pronto para deploy!** 🚀

