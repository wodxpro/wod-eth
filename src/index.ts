/**
 * @wodxpro/contract-data
 * Helper functions to get contract ABIs and addresses
 */

export interface ContractData {
  abi: any[];
  address: string;
  chainName: ChainName;
}

export type ContractName = 'Arena' | 'WODToken' | 'ValidatorRegistry';
export type ChainName = 'polygon';

// Chain ID mapping
const CHAIN_IDS: Record<number, ChainName> = {
  137: 'polygon',
};

const CHAIN_NAMES: Record<ChainName, number> = {
  polygon: 137,
};

/**
 * Get contract data (ABI + address) for a specific contract and chain
 * Uses dynamic imports for better compatibility with modern bundlers
 */
export async function getContractData(
  contractName: ContractName,
  chainId: number
): Promise<ContractData> {
  const chainName = getChainName(chainId);
  
  // Dynamic imports for ESM compatibility (Next.js, Vite, Edge Functions)
  const abiModule = await import(`../abis/${contractName}.json`);
  const addressesModule = await import(`../addresses/${chainName}.json`);
  
  const abi = abiModule.default || abiModule;
  const addresses = addressesModule.default || addressesModule;
  const address = addresses[contractName];
  
  if (!address) {
    throw new Error(
      `Contract ${contractName} not found for chain ${chainName} (${chainId})`
    );
  }
  
  return {
    abi,
    address,
    chainName,
  };
}

/**
 * Synchronous version (for environments that support require)
 * @deprecated Use getContractData() async version instead
 */
export function getContractDataSync(
  contractName: ContractName,
  chainId: number
): ContractData {
  const chainName = getChainName(chainId);
  
  // Fallback for Node.js environments
  if (typeof require !== 'undefined') {
    const abi = require(`../abis/${contractName}.json`);
    const addresses = require(`../addresses/${chainName}.json`);
    const address = addresses[contractName];
    
    if (!address) {
      throw new Error(
        `Contract ${contractName} not found for chain ${chainName} (${chainId})`
      );
    }
    
    return { abi, address, chainName };
  }
  
  throw new Error('Synchronous version requires Node.js require()');
}

/**
 * Get contract ABI only
 */
export async function getContractABI(contractName: ContractName): Promise<any[]> {
  const abiModule = await import(`../abis/${contractName}.json`);
  return abiModule.default || abiModule;
}

/**
 * Get contract address only
 */
export async function getContractAddress(
  contractName: ContractName,
  chainId: number
): Promise<string> {
  const chainName = getChainName(chainId);
  const addressesModule = await import(`../addresses/${chainName}.json`);
  const addresses = addressesModule.default || addressesModule;
  return addresses[contractName];
}

/**
 * Get all contract addresses for a chain
 */
export async function getAllAddresses(chainId: number): Promise<Record<ContractName, string>> {
  const chainName = getChainName(chainId);
  const addressesModule = await import(`../addresses/${chainName}.json`);
  return addressesModule.default || addressesModule;
}

/**
 * Get chain name from chain ID
 */
export function getChainName(chainId: number): ChainName {
  const chainName = CHAIN_IDS[chainId];
  if (!chainName) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return chainName;
}

/**
 * Get chain ID from chain name
 */
export function getChainId(chainName: ChainName): number {
  return CHAIN_NAMES[chainName];
}

/**
 * Check if chain is supported
 */
export function isChainSupported(chainId: number): boolean {
  return chainId in CHAIN_IDS;
}

