# 📝 Verificação Manual no Polygonscan

Como a verificação automática está com problemas de API V2, você pode verificar os contratos manualmente no Polygonscan.

## 🔗 Links dos Contratos

- **WODToken:** https://polygonscan.com/address/0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e
- **ValidatorRegistry:** https://polygonscan.com/address/0xC802ceb791831949504E8CE5982F6D9625eA6cC1
- **Arena:** https://polygonscan.com/address/0x9B2A87D4C28FA8aBEB14dE889764F66D54b775EE

## 📋 Passo a Passo para Verificação Manual

### 1. WODToken

1. Acesse: https://polygonscan.com/address/0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e
2. Clique na aba **"Contract"**
3. Clique em **"Verify and Publish"**
4. Preencha:
   - **Compiler Type:** Solidity (Single file) ou Standard JSON Input
   - **Compiler Version:** v0.8.20
   - **License:** MIT
   - **Constructor Arguments:** `000000000000000000000000cd38cd02a7d04c283330162359c9c8e597ed5068` (Safe address em hex, sem 0x)
5. Cole o código do contrato: `contracts/WODToken.sol`
6. Clique em **"Verify and Publish"**

### 2. ValidatorRegistry

1. Acesse: https://polygonscan.com/address/0xC802ceb791831949504E8CE5982F6D9625eA6cC1
2. Clique na aba **"Contract"**
3. Clique em **"Verify and Publish"**
4. Preencha:
   - **Compiler Type:** Solidity (Single file)
   - **Compiler Version:** v0.8.20
   - **License:** MIT
   - **Constructor Arguments:** 
     - `000000000000000000000000888476ea56322cfd5d08dff8f247b1ab6bd6bb3e` (WODToken address)
     - `000000000000000000000000cd38cd02a7d04c283330162359c9c8e597ed5068` (Safe address)
     - `0000000000000000000000000000000000000000000000000de0b6b3a7640000` (1000 WOD = 1000000000000000000000)
5. Cole o código do contrato: `contracts/ValidatorRegistry.sol`
6. Clique em **"Verify and Publish"**

### 3. Arena

1. Acesse: https://polygonscan.com/address/0x9B2A87D4C28FA8aBEB14dE889764F66D54b775EE
2. Clique na aba **"Contract"**
3. Clique em **"Verify and Publish"**
4. Preencha:
   - **Compiler Type:** Solidity (Single file)
   - **Compiler Version:** v0.8.20
   - **License:** MIT
   - **Constructor Arguments:**
     - `000000000000000000000000888476ea56322cfd5d08dff8f247b1ab6bd6bb3e` (WODToken address)
     - `000000000000000000000000c802ceb791831949504e8ce5982f6d9625ea6cc1` (ValidatorRegistry address)
     - `000000000000000000000000cd38cd02a7d04c283330162359c9c8e597ed5068` (Safe address)
5. Cole o código do contrato: `contracts/Arena.sol`
6. Clique em **"Verify and Publish"**

## ✅ Após Verificação

Após verificar todos os contratos, você pode:

1. Executar a distribuição inicial de tokens
2. Conceder MINTER_ROLE à Arena
3. Criar pool de liquidez no Uniswap

