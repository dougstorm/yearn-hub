import {
    ContractCallContext,
    ContractCallReturnContext,
} from 'ethereum-multicall';
import { get } from 'lodash';
import { BigNumber, constants } from 'ethers';
import { BigNumber as BN } from 'bignumber.js';
import { StrategyAddressQueueIndex, VaultApi } from '../types';
import {
    CallContext,
    ContractCallResults,
} from 'ethereum-multicall/dist/models';
import { getABIStrategiesHelper } from './abi';
import { values } from 'lodash';

export const extractAddress = (address: string) => {
    return (
        address.substring(0, 6) +
        '...' +
        address.substring(address.length - 4, address.length)
    );
};

export const extractText = (text: string) => {
    return text.substring(0, 20) + '...';
};

export const displayAmount = (amount: string, decimals: number): string => {
    if (amount === constants.MaxUint256.toString()) return ' ∞';
    const tokenBits = BigNumber.from(10).pow(decimals);

    const display = new BN(amount)
        .div(tokenBits.toString())
        .toFormat(5)
        // strip trailing zeros for display
        .replace('.00000', '');

    return display;
};

export const msToHours = (ms: number): number => {
    return ms / 1000 / 60 / 24;
};

export const sub = (amountA: string, amountB: string): string => {
    return BigNumber.from(amountA).sub(amountB).toString();
};

export const formatBPS = (val: string): string => {
    return (parseInt(val, 10) / 100).toString();
};

export const mapContractCalls = (result: ContractCallReturnContext) => {
    const mappedObj: any = {};
    result.callsReturnContext.forEach(({ methodName, returnValues }) => {
        if (returnValues && returnValues.length > 0) {
            if (
                typeof returnValues[0] === 'string' ||
                typeof returnValues[0] === 'boolean' ||
                typeof returnValues[0] === 'number'
            ) {
                mappedObj[methodName] = returnValues[0];
            } else if (get(returnValues[0], 'type') === 'BigNumber') {
                mappedObj[methodName] = BigNumber.from(
                    returnValues[0]
                ).toString();
            }
        }
    });
    return mappedObj;
};

const STRATEGIES_HELPER_CONTRACT_ADDRESS =
    '0xae813841436fe29b95a14AC701AFb1502C4CB789';

export const createStrategiesHelperCallAssetStrategiesAddresses = (
    vaults: VaultApi[]
): ContractCallContext => {
    const strategiesHelperCalls: CallContext[] = vaults.map((vault) => {
        return {
            methodName: 'assetStrategiesAddresses',
            methodParameters: [vault.address],
            reference: STRATEGIES_HELPER_CONTRACT_ADDRESS,
        };
    });
    return {
        reference: STRATEGIES_HELPER_CONTRACT_ADDRESS,
        contractAddress: STRATEGIES_HELPER_CONTRACT_ADDRESS,
        abi: getABIStrategiesHelper(),
        calls: strategiesHelperCalls,
    };
};

export const mapToStrategyAddressQueueIndex = (
    vaultAddress: string,
    strategiesHelperCallsResults: ContractCallResults
): StrategyAddressQueueIndex[] => {
    const strategiesHelperCallsReturnContext =
        strategiesHelperCallsResults.results[STRATEGIES_HELPER_CONTRACT_ADDRESS]
            .callsReturnContext;

    const strategiesHelperCallsReturnContextList = values(
        strategiesHelperCallsReturnContext
    );
    const strategiesQueuePosition = strategiesHelperCallsReturnContextList.find(
        (item) =>
            item.methodParameters[0].toLowerCase() ===
            vaultAddress.toLowerCase()
    );
    let strategiesQueueIndexes: Array<StrategyAddressQueueIndex>;
    if (strategiesQueuePosition === undefined) {
        strategiesQueueIndexes = Array<{
            queueIndex: number;
            address: string;
        }>();
    } else {
        strategiesQueueIndexes = strategiesQueuePosition?.returnValues.map(
            (value: unknown, index: number) => {
                return {
                    queueIndex: index,
                    address: (value as string).toLowerCase(),
                };
            }
        );
    }
    return strategiesQueueIndexes;
};
