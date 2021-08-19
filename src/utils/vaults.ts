import {
    Multicall,
    ContractCallResults,
    ContractCallContext,
} from 'ethereum-multicall';
import { BigNumber, utils } from 'ethers';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { get, memoize } from 'lodash';
import { getEthersDefaultProvider } from './ethers';
import { Vault, VaultApi, VaultVersion, Strategy } from '../types';
import { BuildGet, BuildGetExperimental } from './apisRequest';
import { vaultChecks } from './checks';
import {
    mapContractCalls,
    createStrategiesHelperCallAssetStrategiesAddresses,
    mapToStrategyAddressQueueIndex,
} from './commonUtils';
import { toHumanDateText } from './dateUtils';
import { getABI_032 } from './abi';
import { mapStrategiesCalls, buildStrategyCalls } from './strategies';
import { getTotalDebtUsage } from './strategyParams';

const VAULT_VIEW_METHODS = [
    'management',
    'governance',
    'guardian',
    'depositLimit',
    'totalAssets',
    'debtRatio',
    'totalDebt',
    'lastReport',
    'rewards',
];

const filterAndMapVaultsData = (
    data: any,
    additional: Set<string> = new Set<string>()
): VaultApi[] => {
    return data
        .filter(
            (vault: any) =>
                (vault.endorsed &&
                    vault.type.toLowerCase() === VaultVersion.V2) ||
                additional.has(vault.address.toLowerCase())
        )
        .map((vault: any) => {
            return {
                ...vault,
                apiVersion: vault.version,
                name: vault.display_name,
                emergencyShutdown: vault.emergency_shutdown,
                fees: {
                    general: {
                        managementFee: vault.apy.fees.management
                            ? vault.apy.fees.management * 10000
                            : 0,
                        performanceFee: vault.apy.fees.performance
                            ? vault.apy.fees.performance * 10000
                            : 0,
                    },
                },
                tvl: {
                    totalAssets: BigNumber.from(
                        new BigNumberJS(
                            vault.tvl.total_assets.toString()
                        ).toFixed(0)
                    ),
                },
            } as VaultApi;
        });
};

const vaultsAreMissing = (
    vaultMap: Map<string, VaultApi>,
    additional: Set<string>
): boolean => {
    let missing = false;
    additional.forEach((vaultAddr) => {
        if (vaultMap.has(vaultAddr.toLowerCase()) === false) {
            missing = true;
        }
    });

    return missing;
};

const internalGetVaults = async (
    allowList: string[] = []
): Promise<Vault[]> => {
    const provider = getEthersDefaultProvider();

    const multicall = new Multicall({ ethersProvider: provider });
    // accepts non endorsed experimental vaults to access
    const additional = new Set(allowList.map((addr) => addr.toLowerCase()));

    try {
        const response = await BuildGet('/vaults/all');
        const payload: VaultApi[] = filterAndMapVaultsData(
            response.data,
            additional
        );

        const vaultMap = new Map<string, VaultApi>();
        const strategyMap = new Map<string, string>();

        payload.forEach((vault) => {
            vaultMap.set(vault.address, vault);
            vault.strategies.forEach((strat) =>
                strategyMap.set(strat.address, vault.address)
            );
        });

        // check if we have missing vaults from requested
        if (vaultsAreMissing(vaultMap, additional)) {
            // need to fetch experimental data
            console.log('...fetching experimental vaults data');
            const response = await BuildGetExperimental('/vaults/all');
            const experimentalPayload: VaultApi[] = filterAndMapVaultsData(
                response.data,
                additional
            );
            experimentalPayload.forEach((vault) => {
                vaultMap.set(vault.address, vault);
                vault.strategies.forEach((strat) =>
                    strategyMap.set(strat.address, vault.address)
                );
            });
        }

        const vaultCalls: ContractCallContext[] = payload.map(({ address }) => {
            const calls = VAULT_VIEW_METHODS.map((method) => ({
                reference: method,
                methodName: method,
                methodParameters: [],
            }));
            return {
                reference: address,
                contractAddress: address,
                abi: getABI_032(), // only this abi version has the vault view methods
                calls,
            };
        });
        const stratCalls: ContractCallContext[] = payload.flatMap(
            ({ strategies }) => {
                const stratAddresses = strategies.map(({ address }) => address);
                return buildStrategyCalls(
                    stratAddresses,
                    vaultMap,
                    strategyMap
                );
            }
        );
        const strategiesHelperCallResults: ContractCallResults = await multicall.call(
            createStrategiesHelperCallAssetStrategiesAddresses(payload)
        );
        const results: ContractCallResults = await multicall.call(
            vaultCalls.concat(stratCalls)
        );

        return mapVaultData(
            results,
            strategiesHelperCallResults,
            vaultMap,
            strategyMap
        );
    } catch (error) {
        console.error(error);
        return Promise.resolve([]);
    }
};

export const getVaults = memoize(internalGetVaults);

const _getVault = async (address: string): Promise<Vault> => {
    if (!address || !utils.isAddress(address)) {
        throw new Error('Error: expect a valid vault address');
    }

    const vaults = await getVaults([address]);

    const [foundVault]: Vault[] = vaults.filter(
        (vault) => vault.address.toLowerCase() === address.toLowerCase()
    );

    if (!foundVault) {
        throw new Error('Error: vault not recognized as a yearn vault');
    }

    return foundVault;
};

export const getVault = memoize(_getVault);

const mapVaultData = (
    contractCallsResults: ContractCallResults,
    strategiesHelperCallsResults: ContractCallResults,
    vaultMap: Map<string, VaultApi>,
    strategyMap: Map<string, string>
): Vault[] => {
    const vaults: Vault[] = [];

    vaultMap.forEach((vault, key) => {
        const {
            address,
            apiVersion,
            symbol,
            name,
            token,
            icon,
            emergencyShutdown,
            strategies,
        } = vault;

        const strategiesQueueIndexes = mapToStrategyAddressQueueIndex(
            address,
            strategiesHelperCallsResults
        );

        const mappedVault: any = {
            address,
            apiVersion,
            symbol,
            name,
            token,
            icon,
            emergencyShutdown,
            managementFee: get(
                vault,
                'fees.general.managementFee',
                'unknown'
            ) as string,
            performanceFee: get(
                vault,
                'fees.general.performanceFee',
                'unknown'
            ) as string,
            // totalAssets: get(vault, 'tvl.value', 'unknown') as string,
        };

        const stratAddresses = strategies.map(({ address }) => address);
        const mappedStrategies: Strategy[] = mapStrategiesCalls(
            stratAddresses,
            contractCallsResults,
            strategiesQueueIndexes,
            strategyMap
        );

        mappedVault.debtUsage = getTotalDebtUsage(mappedStrategies);

        const vaultData = contractCallsResults.results[address];

        const mappedVaultContractCalls = mapContractCalls(vaultData);

        mappedVault.lastReportText = toHumanDateText(
            mappedVaultContractCalls.lastReport
        );

        vaults.push(
            vaultChecks({
                ...mappedVault,
                ...mappedVaultContractCalls,
                strategies: mappedStrategies,
            })
        );
    });

    return vaults;
};
