// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ValidatorRegistry
 * @dev Registro de validadores com sistema de stake
 */
contract ValidatorRegistry is Ownable, ReentrancyGuard {
    IERC20 public wodToken;

    struct Validator {
        address validatorAddress;
        uint256 stakeAmount;
        uint256 registeredAt;
        bool isActive;
    }

    mapping(address => Validator) public validators;
    address[] public validatorList;
    uint256 public minStakeAmount; // Stake mínimo para ser validador

    event ValidatorRegistered(address indexed validator, uint256 stakeAmount);
    event ValidatorUnregistered(address indexed validator);
    event StakeUpdated(address indexed validator, uint256 newStake);

    constructor(
        address _wodToken,
        address initialOwner,
        uint256 _minStakeAmount
    ) Ownable(initialOwner) {
        wodToken = IERC20(_wodToken);
        minStakeAmount = _minStakeAmount;
    }

    /**
     * @dev Registra um novo validador com stake mínimo
     */
    function registerValidator(uint256 stakeAmount) external nonReentrant {
        require(stakeAmount >= minStakeAmount, "Stake below minimum");
        require(!validators[msg.sender].isActive, "Already registered");

        require(
            wodToken.transferFrom(msg.sender, address(this), stakeAmount),
            "Transfer failed"
        );

        validators[msg.sender] = Validator({
            validatorAddress: msg.sender,
            stakeAmount: stakeAmount,
            registeredAt: block.timestamp,
            isActive: true
        });

        validatorList.push(msg.sender);

        emit ValidatorRegistered(msg.sender, stakeAmount);
    }

    /**
     * @dev Atualiza stake do validador
     */
    function updateStake(uint256 additionalStake) external nonReentrant {
        require(validators[msg.sender].isActive, "Not a validator");

        require(
            wodToken.transferFrom(msg.sender, address(this), additionalStake),
            "Transfer failed"
        );

        validators[msg.sender].stakeAmount += additionalStake;

        emit StakeUpdated(msg.sender, validators[msg.sender].stakeAmount);
    }

    /**
     * @dev Remove validador e retorna stake
     */
    function unregisterValidator() external nonReentrant {
        require(validators[msg.sender].isActive, "Not a validator");

        uint256 stakeToReturn = validators[msg.sender].stakeAmount;
        validators[msg.sender].isActive = false;

        // Remover da lista
        for (uint256 i = 0; i < validatorList.length; i++) {
            if (validatorList[i] == msg.sender) {
                validatorList[i] = validatorList[validatorList.length - 1];
                validatorList.pop();
                break;
            }
        }

        require(
            wodToken.transfer(msg.sender, stakeToReturn),
            "Stake return failed"
        );

        emit ValidatorUnregistered(msg.sender);
    }

    /**
     * @dev Verifica se um endereço é validador ativo
     */
    function isValidator(address validator) external view returns (bool) {
        return validators[validator].isActive;
    }

    /**
     * @dev Retorna número total de validadores ativos
     */
    function getValidatorCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < validatorList.length; i++) {
            if (validators[validatorList[i]].isActive) {
                count++;
            }
        }
        return count;
    }

    /**
     * @dev Retorna lista de validadores ativos
     */
    function getValidators() external view returns (address[] memory) {
        uint256 activeCount = 0;
        
        // Primeiro, contar validadores ativos
        for (uint256 i = 0; i < validatorList.length; i++) {
            if (validators[validatorList[i]].isActive) {
                activeCount++;
            }
        }

        // Criar array com tamanho correto
        address[] memory activeValidators = new address[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < validatorList.length; i++) {
            if (validators[validatorList[i]].isActive) {
                activeValidators[index] = validatorList[i];
                index++;
            }
        }

        return activeValidators;
    }

    /**
     * @dev Atualiza stake mínimo (apenas owner)
     */
    function setMinStakeAmount(uint256 _minStakeAmount) external onlyOwner {
        minStakeAmount = _minStakeAmount;
    }
}

