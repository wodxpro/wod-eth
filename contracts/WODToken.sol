// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title WODToken
 * @dev Token ERC20 do protocolo WOD X PRO ($WOD)
 * 
 * Tokenomics:
 * - Max Supply: 1.000.000.000 WOD (hard cap)
 * - Tesouraria Protocolo: 30%
 * - Recompensas de Desafio: 25% (mint progressivo via Arena)
 * - Fundadores: 15% (vesting off-chain)
 * - Parceiros: 10% (vesting opcional)
 * - Liquidez: 10%
 * - Ecossistema / DAO: 10%
 *
 * Controle:
 * - MINTER_ROLE: Safe multisig (e opcionalmente Arena.sol)
 * - PAUSER_ROLE: Safe multisig
 * - DEFAULT_ADMIN_ROLE: Safe multisig
 */
contract WODToken is ERC20, AccessControl, Pausable {
    // ============================================
    // CONSTANTS
    // ============================================
    
    /// @dev Hard cap de 1 bilhão de tokens
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    
    /// @dev Role para mintar tokens
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    /// @dev Role para pausar transferências
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // ============================================
    // STATE VARIABLES
    // ============================================
    
    /// @dev Total de tokens já mintados (tracking manual)
    uint256 public totalMinted;
    
    // ============================================
    // EVENTS
    // ============================================
    
    event TokensMinted(
        address indexed to,
        uint256 amount,
        uint256 newTotalMinted,
        string reason
    );
    
    event TokensBurned(
        address indexed from,
        uint256 amount,
        uint256 newTotalSupply
    );
    
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
    
    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    /**
     * @dev Inicializa o token e configura roles
     * @param admin Endereço que receberá todas as roles (Safe multisig)
     */
    constructor(address admin) ERC20("WOD X PRO", "WOD") {
        require(admin != address(0), "Admin cannot be zero address");
        
        // Configura roles no Safe multisig
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        
        // Inicializa tracking
        totalMinted = 0;
    }
    
    // ============================================
    // MINTING FUNCTIONS
    // ============================================
    
    /**
     * @dev Mint tokens respeitando MAX_SUPPLY
     * @param to Endereço que receberá os tokens
     * @param amount Quantidade a ser mintada
     * @param reason Razão do mint (para tracking)
     * 
     * Exemplos de uso:
     * - mint(treasury, 300M, "Initial Treasury Allocation")
     * - mint(liquidityPool, 100M, "Initial Liquidity")
     * - mint(athlete, 100, "Arena Challenge Reward")
     */
    function mint(
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyRole(MINTER_ROLE) {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(
            totalMinted + amount <= MAX_SUPPLY,
            "Exceeds max supply"
        );
        
        totalMinted += amount;
        _mint(to, amount);
        
        emit TokensMinted(to, amount, totalMinted, reason);
    }
    
    /**
     * @dev Retorna quanto ainda pode ser mintado
     */
    function remainingMintableSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalMinted;
    }
    
    // ============================================
    // BURNING FUNCTIONS
    // ============================================
    
    /**
     * @dev Queima tokens do próprio saldo
     * @param amount Quantidade a ser queimada
     * 
     * Usado para:
     * - Redução de supply
     * - Deflação via taxas da Arena
     */
    function burn(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _burn(msg.sender, amount);
        
        emit TokensBurned(msg.sender, amount, totalSupply());
    }
    
    /**
     * @dev Queima tokens de outro endereço (com allowance)
     * @param from Endereço de onde queimar
     * @param amount Quantidade a ser queimada
     * 
     * Usado por:
     * - Arena.sol para queimar taxas automaticamente
     */
    function burnFrom(address from, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(from) >= amount, "Insufficient balance");
        
        uint256 currentAllowance = allowance(from, msg.sender);
        require(currentAllowance >= amount, "Insufficient allowance");
        
        _approve(from, msg.sender, currentAllowance - amount);
        _burn(from, amount);
        
        emit TokensBurned(from, amount, totalSupply());
    }
    
    // ============================================
    // PAUSE FUNCTIONS
    // ============================================
    
    /**
     * @dev Pausa todas as transferências (emergência)
     * 
     * Casos de uso:
     * - Bug descoberto
     * - Ataque em andamento
     * - Upgrade de contrato
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit ContractPaused(msg.sender);
    }
    
    /**
     * @dev Retoma transferências
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
        emit ContractUnpaused(msg.sender);
    }
    
    // ============================================
    // OVERRIDES
    // ============================================
    
    /**
     * @dev Hook para pausar transferências quando necessário
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override whenNotPaused {
        super._update(from, to, value);
    }
    
    // ============================================
    // VIEW FUNCTIONS
    // ============================================
    
    /**
     * @dev Retorna informações completas do token
     */
    function getTokenInfo() external view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 decimals,
        uint256 maxSupply,
        uint256 currentTotalMinted,
        uint256 currentTotalSupply,
        uint256 remainingSupply,
        bool isPaused
    ) {
        return (
            name(),
            symbol(),
            18, // decimals
            MAX_SUPPLY,
            totalMinted,
            totalSupply(),
            MAX_SUPPLY - totalMinted,
            paused()
        );
    }
    
    /**
     * @dev Verifica se um endereço tem role de minter
     */
    function isMinter(address account) external view returns (bool) {
        return hasRole(MINTER_ROLE, account);
    }
    
    /**
     * @dev Verifica se um endereço tem role de pauser
     */
    function isPauser(address account) external view returns (bool) {
        return hasRole(PAUSER_ROLE, account);
    }
}