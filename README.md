
# 🪙 WOD X PRO Token ($WOD)

Token oficial do protocolo **WOD X PRO**, focado em recompensas de performance física on-chain.

## 📌 Informações Gerais

- **Nome:** WOD X PRO
- **Símbolo:** WOD
- **Decimais:** 18
- **Supply Máximo:** 1.000.000.000 WOD (hard cap)
- **Padrão:** ERC20
- **Rede:** Polygon Mainnet

---

## 📊 Tokenomics

| Alocação                 | Percentual | Quantidade     | Endereço / Destino                                      |
|--------------------------|------------|----------------|----------------------------------------------------------|
| Tesouraria Protocolo     | 30%        | 300.000.000    | `0x8648...c9a54`                                         |
| Recompensas de Arena     | 25%        | 250.000.000    | Mint progressivo via Arena (MINTER_ROLE)                |
| Fundadores               | 15%        | 150.000.000    | `0x02df...2da86` (vesting off-chain: 12 meses)          |
| Parceiros / Backers      | 10%        | 100.000.000    | `0xcd38...5068` (vesting off-chain: 6 meses cliff)      |
| Liquidez Inicial         | 10%        | 100.000.000    | `0x947D...7631` (Pool Uniswap @ $0.10/WOD)              |
| DAO / Governança         | 10%        | 100.000.000    | `0xa387...6001` (Tesouraria DAO multisig)               |

---

## 🔐 Controles e Governança

- **Owner:** Gnosis Safe Multisig
- **Roles:**
  - `MINTER_ROLE`: Arena.sol, Safe multisig
  - `PAUSER_ROLE`: Safe multisig
- **Emergência:** Pausabilidade ativada por multisig
- **Burn:** Permitido via função pública

---

## 🔄 Funções Públicas

```solidity
function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE)
function burn(uint256 amount) external
function pause() external onlyRole(PAUSER_ROLE)
function unpause() external onlyRole(PAUSER_ROLE)
```

## 📈 Eventos Emitidos

```solidity
event TokensMinted(address indexed to, uint256 amount, uint256 newTotal);
event TokensBurned(address indexed from, uint256 amount);
event RoleGranted(bytes32 role, address indexed account, address indexed sender);
event RoleRevoked(bytes32 role, address indexed account, address indexed sender);
event Paused(address account);
event Unpaused(address account);
```

---

## 🚀 Deploy & Verificação

- **Data:** 11 de Novembro de 2025
- **Rede:** Polygon Mainnet (ID: 137)
- **Token Address:** _a ser atualizado após o deploy_
- **Safe Multisig:** `0x8648...c9a54`

### Verificação no Polygonscan

```bash
npx hardhat verify --network polygon <TOKEN_ADDRESS> <SAFE_MULTISIG>
```

---

## 📁 Prova de Distribuição

- Arquivo JSON: [`WODToken_Initial_Distribution.json`](./WODToken_Initial_Distribution.json)
- IPFS Hash: _a ser adicionado após upload_

---

## 📣 Contato

Este contrato é mantido pela equipe do protocolo [WOD X PRO](https://wodx.pro).  
Contribuições, revisões e sugestões são bem-vindas.

