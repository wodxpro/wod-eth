# 🔍 Guia de Verificação de Contratos - Polygon Mainnet

## 📋 Situação Atual

**Data:** 24 de Novembro de 2025  
**Rede:** Polygon Mainnet (Chain ID: 137)  
**Explorador:** Polygonscan (agora usando API da Etherscan)

### ⚠️ Status da Verificação Automática

O plugin `@nomicfoundation/hardhat-verify@1.1.1` ainda está usando a API V1 que foi **deprecada** pela Etherscan/Polygonscan. A migração para API V2 aconteceu recentemente.

**Erro atual:**
```
You are using a deprecated V1 endpoint, switch to Etherscan API V2
```

---

## ✅ Solução: Verificação Manual (Recomendado)

Como a verificação automática ainda não está funcionando devido à migração da API, a melhor opção é fazer a verificação manual no Polygonscan.

### 📝 Passo a Passo

#### 1. WODToken

**Address:** `0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e`

1. Acesse: https://polygonscan.com/address/0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e
2. Clique na aba **"Contract"**
3. Clique em **"Verify and Publish"**
4. Preencha:
   - **Compiler Type:** Solidity (Single file) ou Standard JSON Input
   - **Compiler Version:** v0.8.20
   - **License:** MIT
   - **Optimization:** Yes (200 runs)
   - **Constructor Arguments:** `000000000000000000000000cd38cd02a7d04c283330162359c9c8e597ed5068`
     - (Safe address em hex, sem 0x: `0xcd38CD02A7d04c283330162359C9c8E597Ed5068`)
5. Cole o código do contrato: `contracts/WODToken.sol`
6. Clique em **"Verify and Publish"**

#### 2. ValidatorRegistry

**Address:** `0xC802ceb791831949504E8CE5982F6D9625eA6cC1`

1. Acesse: https://polygonscan.com/address/0xC802ceb791831949504E8CE5982F6D9625eA6cC1
2. Clique na aba **"Contract"**
3. Clique em **"Verify and Publish"**
4. Preencha:
   - **Compiler Type:** Solidity (Single file)
   - **Compiler Version:** v0.8.20
   - **License:** MIT
   - **Optimization:** Yes (200 runs)
   - **Constructor Arguments:** 
     ```
     000000000000000000000000888476ea56322cfd5d08dff8f247b1ab6bd6bb3e
     000000000000000000000000cd38cd02a7d04c283330162359c9c8e597ed5068
     0000000000000000000000000000000000000000000000000de0b6b3a7640000
     ```
     - WODToken address: `0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e`
     - Safe address: `0xcd38CD02A7d04c283330162359C9c8E597Ed5068`
     - Min Stake: `1000000000000000000000` (1000 WOD com 18 decimais)
5. Cole o código do contrato: `contracts/ValidatorRegistry.sol`
6. Clique em **"Verify and Publish"**

#### 3. Arena

**Address:** `0x9B2A87D4C28FA8aBEB14dE889764F66D54b775EE`

1. Acesse: https://polygonscan.com/address/0x9B2A87D4C28FA8aBEB14dE889764F66D54b775EE
2. Clique na aba **"Contract"**
3. Clique em **"Verify and Publish"**
4. Preencha:
   - **Compiler Type:** Solidity (Single file)
   - **Compiler Version:** v0.8.20
   - **License:** MIT
   - **Optimization:** Yes (200 runs)
   - **Constructor Arguments:**
     ```
     000000000000000000000000888476ea56322cfd5d08dff8f247b1ab6bd6bb3e
     000000000000000000000000c802ceb791831949504e8ce5982f6d9625ea6cc1
     000000000000000000000000cd38cd02a7d04c283330162359c9c8e597ed5068
     ```
     - WODToken address: `0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e`
     - ValidatorRegistry address: `0xC802ceb791831949504E8CE5982F6D9625eA6cC1`
     - Safe address: `0xcd38CD02A7d04c283330162359C9c8E597Ed5068`
5. Cole o código do contrato: `contracts/Arena.sol`
6. Clique em **"Verify and Publish"**

---

## 🔧 Configuração Atual do Hardhat

### Arquivo `hardhat.config.ts`

```typescript
etherscan: {
  apiKey: {
    polygon: process.env.ETHERSCAN_API_KEY || "",
  },
  customChains: [
    {
      network: "polygon",
      chainId: 137,
      urls: {
        apiURL: "https://api.polygonscan.com/api",
        browserURL: "https://polygonscan.com",
      },
    },
  ],
},
```

### Arquivo `.env`

```env
ETHERSCAN_API_KEY=8CM3VJ9JI82UCK4WHF383Q82KE2GD47CN8
```

---

## 🔄 Quando a Verificação Automática Voltar a Funcionar

Quando o plugin `@nomicfoundation/hardhat-verify` for atualizado para suportar a API V2 da Etherscan, você poderá usar:

```bash
# Verificar WODToken
npx hardhat verify --network polygon \
  0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e \
  0xcd38CD02A7d04c283330162359C9c8E597Ed5068

# Verificar ValidatorRegistry
npx hardhat verify --network polygon \
  0xC802ceb791831949504E8CE5982F6D9625eA6cC1 \
  0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e \
  0xcd38CD02A7d04c283330162359C9c8E597Ed5068 \
  1000000000000000000000

# Verificar Arena
npx hardhat verify --network polygon \
  0x9B2A87D4C28FA8aBEB14dE889764F66D54b775EE \
  0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e \
  0xC802ceb791831949504E8CE5982F6D9625eA6cC1 \
  0xcd38CD02A7d04c283330162359C9c8E597Ed5068
```

---

## 📝 Notas Importantes

1. **API Key:** A `ETHERSCAN_API_KEY` está configurada no `.env` e será usada quando a verificação automática voltar a funcionar.

2. **Verificação Manual:** É a forma mais confiável no momento, já que a API V2 ainda não está totalmente suportada pelo plugin.

3. **Constructor Arguments:** Os argumentos devem ser passados em formato hexadecimal, sem o prefixo `0x`.

4. **Compiler Settings:** Use exatamente as mesmas configurações do `hardhat.config.ts`:
   - Solidity: v0.8.20
   - Optimization: Enabled (200 runs)
   - License: MIT

---

## ✅ Após Verificação

Após verificar todos os contratos:

1. ✅ Código fonte visível no Polygonscan
2. ✅ Usuários podem interagir com os contratos
3. ✅ Transparência e confiança aumentadas
4. ✅ Pronto para próximos passos (distribuição, roles, etc.)

---

## 🔗 Links Úteis

- **Polygonscan:** https://polygonscan.com
- **Documentação Hardhat Verify:** https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify
- **Etherscan API:** https://docs.etherscan.io/v2-migration

---

**💡 Dica:** A verificação manual é rápida e garante que tudo funcione corretamente, mesmo com a migração da API.

