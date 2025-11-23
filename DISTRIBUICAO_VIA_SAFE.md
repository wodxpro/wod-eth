# 🛡️ Distribuição Inicial de Tokens via Safe Multisig

Este guia explica como executar a distribuição inicial de tokens usando o Safe Wallet.

## 📋 Informações Importantes

- **Safe Address:** `0xcd38CD02A7d04c283330162359C9c8E597Ed5068`
- **WODToken Address:** `0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e`
- **Safe tem MINTER_ROLE** ✅

## 🚀 Opção 1: Via Safe Wallet Interface (Recomendado)

### Passo 1: Acessar Safe Wallet

1. Acesse: https://app.safe.global/
2. Conecte sua wallet
3. Selecione o Safe: `0xcd38CD02A7d04c283330162359C9c8E597Ed5068`
4. Certifique-se de estar na rede **Polygon**

### Passo 2: Criar Transação para Mint

Para cada alocação, você precisará criar uma transação no Safe:

#### 2.1. Treasury (300M WOD)

1. Clique em **"New Transaction"** → **"Contract Interaction"**
2. Endereço do contrato: `0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e`
3. Função: `mint(address to, uint256 amount, string reason)`
4. Parâmetros:
   - `to`: `0x86485aa077f61909f15fc8a5a1ba3167562c9a54`
   - `amount`: `300000000000000000000000000` (300M com 18 decimais)
   - `reason`: `Initial allocation: Treasury - 30%`
5. Revise e assine
6. Aguarde outras assinaturas (se multisig)
7. Execute a transação

#### 2.2. Founders (150M WOD)

Repita o processo com:
- `to`: `0x02dfef57bc5d36bc1c08cb6272386ca0ec32da86`
- `amount`: `150000000000000000000000000` (150M)
- `reason`: `Initial allocation: Founders - 15% (vesting: 12 months linear)`

#### 2.3. Partners (100M WOD)

- `to`: `0xcd38CD02A7d04c283330162359C9c8E597Ed5068`
- `amount`: `100000000000000000000000000` (100M)
- `reason`: `Initial allocation: Partners - 10% (vesting: 6 months cliff)`

#### 2.4. Liquidity (100M WOD)

- `to`: `0x947D6eCd44C3657BC43c734C65562a9D62617631`
- `amount`: `100000000000000000000000000` (100M)
- `reason`: `Initial allocation: Liquidity - 10% (Uniswap Pool)`

#### 2.5. DAO (100M WOD)

- `to`: `0xa387691e594df109ad9ca83767f39d419cbc6001`
- `amount`: `100000000000000000000000000` (100M)
- `reason`: `Initial allocation: DAO - 10%`

## 🚀 Opção 2: Via Script (se Safe estiver conectado)

Se você conseguir conectar o Safe como signer no Hardhat:

```bash
cd /Users/nettomello/CODIGOS/TOKENS/wod-eth/wod-x-pro
npm run initial-distribution
```

**Nota:** Isso requer que o Safe esteja configurado como signer, o que pode ser complexo.

## 📊 Resumo da Distribuição

| Destino | Endereço | Quantidade | Porcentagem |
|---------|----------|------------|-------------|
| Treasury | `0x86485aa077f61909f15fc8a5a1ba3167562c9a54` | 300M WOD | 30% |
| Founders | `0x02dfef57bc5d36bc1c08cb6272386ca0ec32da86` | 150M WOD | 15% |
| Partners | `0xcd38CD02A7d04c283330162359C9c8E597Ed5068` | 100M WOD | 10% |
| Liquidity | `0x947D6eCd44C3657BC43c734C65562a9D62617631` | 100M WOD | 10% |
| DAO | `0xa387691e594df109ad9ca83767f39d419cbc6001` | 100M WOD | 10% |
| **Total** | - | **750M WOD** | **75%** |

**Reservado para Arena:** 250M WOD (25%) - será mintado progressivamente

## ✅ Após Distribuição

1. Verificar saldos de cada endereço no Polygonscan
2. Criar pool de liquidez no Uniswap V3
3. Conceder MINTER_ROLE à Arena (se necessário)
4. Publicar proof de distribuição

## 🔗 Links Úteis

- **Safe Wallet:** https://app.safe.global/
- **WODToken no Polygonscan:** https://polygonscan.com/address/0x888476eA56322CFd5D08DFf8F247b1ab6bd6bB3e
- **Safe no Polygonscan:** https://polygonscan.com/address/0xcd38CD02A7d04c283330162359C9c8E597Ed5068

