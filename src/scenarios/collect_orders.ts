import {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    Order,
    orderHashUtils,
    signatureUtils,
} from '0x.js';
import { HttpClient, OrderbookRequest } from '@0x/connect';
import { Web3Wrapper } from '@0x/web3-wrapper';

import { NETWORK_CONFIGS, TX_DEFAULTS } from '../configs';
import { DECIMALS, NULL_ADDRESS } from '../constants';
import { contractAddresses } from '../contracts';
import { PrintUtils } from '../print_utils';
import { providerEngine } from '../provider_engine';
import { getRandomFutureDateInSeconds } from '../utils';

/**
 * In this scenario, A Taker queries Standard Relayer API to discover orders
 * in different exchange.
 */
export async function scenarioAsync(): Promise<void> {
    // PrintUtils.printScenario('Fill Order Standard Relayer API');
    // Initialize the ContractWrappers, this provides helper functions around calling
    // 0x contracts as well as ERC20/ERC721 token contracts on the blockchain
    const contractWrappers = new ContractWrappers(providerEngine, { networkId: NETWORK_CONFIGS.networkId });
    // Initialize the Web3Wrapper, this provides helper functions around fetching
    // account information, balances, general contract logs
    const web3Wrapper = new Web3Wrapper(providerEngine);
    const [maker, taker] = await web3Wrapper.getAvailableAddressesAsync();
    // MKR: 0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2
    // DAI: 0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359
    // const zrxTokenAddress = contractAddresses.zrxToken;
    const zrxTokenAddress = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359";
    const etherTokenAddress = contractAddresses.etherToken;
    const printUtils = new PrintUtils(
        web3Wrapper,
        contractWrappers,
        { maker, taker },
        { WETH: etherTokenAddress, ZRX: zrxTokenAddress },
    );
    printUtils.printAccounts();

    const makerAssetData = assetDataUtils.encodeERC20AssetData(etherTokenAddress);
    const takerAssetData = assetDataUtils.encodeERC20AssetData(zrxTokenAddress);
    // the amount the maker is selling of maker asset
    const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.01), DECIMALS);
    // the amount the maker wants of taker asset
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(0.01), DECIMALS);

    let txHash;
    let txReceipt;

    // Initialize the Standard Relayer API client
    // const httpClient = new HttpClient('http://localhost:3000/v2/');
    // const httpClient = new HttpClient('https://api.kovan.radarrelay.com/0x/v2/');
    const httpClient = new HttpClient('https://api.radarrelay.com/0x/v2/');
    // const httpClient = new HttpClient('https://sra.bamboorelay.com/0x/v2/');

    // Taker queries the Orderbook from the Relayer
    const orderbookRequest: OrderbookRequest = { baseAssetData: makerAssetData, quoteAssetData: takerAssetData };
    const response = await httpClient.getOrderbookAsync(orderbookRequest, { networkId: NETWORK_CONFIGS.networkId });
    if (response.asks.total === 0) {
        throw new Error('No orders found on the SRA Endpoint');
    }

    const bidOrders = response.bids;
    const askOrders = response.asks;

    var num: number = askOrders.total;
    var i: number;

    PrintUtils.printScenario('Exchange: https://api.radarrelay.com/0x/v2/');
    PrintUtils.printHeader('Asks');
    for (i = 0; i < num; i++) {
        var mPrice = askOrders.records[i].order.makerAssetAmount;
        var tPrice = askOrders.records[i].order.takerAssetAmount;
        console.log('WETH/DAI', tPrice.dividedBy(mPrice));
    }

    PrintUtils.printHeader('Bids');
    for (i = 0; i < num; i++) {
        var mPrice = bidOrders.records[i].order.makerAssetAmount;
        var tPrice = bidOrders.records[i].order.takerAssetAmount;
        console.log('WETH/DAI', mPrice.dividedBy(tPrice));
    }

    // Print the Balances
    await printUtils.fetchAndPrintContractBalancesAsync();

    // Stop the Provider Engine
    providerEngine.stop();
}

void (async () => {
    try {
        if (!module.parent) {
            await scenarioAsync();
        }
    } catch (e) {
        console.log(e);
        providerEngine.stop();
        process.exit(1);
    }
})();
