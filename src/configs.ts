import { GANACHE_NETWORK_ID, KOVAN_NETWORK_ID, RINKEBY_NETWORK_ID, ROPSTEN_NETWORK_ID, MAINNET_NETWORK_ID } from './constants';
import { NetworkSpecificConfigs } from './types';

export const TX_DEFAULTS = { gas: 400000 };
export const MNEMONIC = 'opera recall pizza viable estate brass royal act recipe throw vessel shell';
export const BASE_DERIVATION_PATH = `44'/60'/0'/0`;
export const GANACHE_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: 'http://127.0.0.1:8545',
    networkId: GANACHE_NETWORK_ID,
};
export const KOVAN_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: 'https://kovan.infura.io/',
    networkId: KOVAN_NETWORK_ID,
};
export const ROPSTEN_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: 'https://ropsten.infura.io/',
    networkId: ROPSTEN_NETWORK_ID,
};
export const RINKEBY_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: 'https://rinkeby.infura.io/',
    networkId: RINKEBY_NETWORK_ID,
};
export const MAINNET_CONFIGS: NetworkSpecificConfigs = {
    rpcUrl: 'https://mainnet.infura.io/',
    networkId: MAINNET_NETWORK_ID,
};

export const NETWORK_CONFIGS = MAINNET_CONFIGS; // or KOVAN_CONFIGS or ROPSTEN_CONFIGS or RINKEBY_CONFIGS
