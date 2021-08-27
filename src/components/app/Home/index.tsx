import { useEffect, useState, useMemo } from 'react';

import {
    getVaultsWithPagination,
    getTotalVaults,
    sortVaultsByVersion,
} from '../../../utils/vaults';

import { ErrorAlert } from '../../common/Alerts';

import { getVaults } from '../../../utils/vaults';
import { VaultsList } from '../../common/VaultsList';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import { Vault } from '../../../types';

const BATCH_NUMBER = 30;

export const Home = () => {
    const [total, setTotal] = useState<number>(0);
    const [vaults, setVaults] = useState<Vault[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadVaultData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const numVaults = await getTotalVaults();
            setTotal(numVaults);
            const loadedVaults = await getVaultsWithPagination(0, BATCH_NUMBER);
            if (loadedVaults.length > 0) {
                setVaults([...sortVaultsByVersion(loadedVaults)]);
                setIsLoading(false);
            }
            // iterations for lazy loading
            if (numVaults > BATCH_NUMBER) {
                const iterations = Math.floor(
                    (numVaults - BATCH_NUMBER) / BATCH_NUMBER
                );
                let offset = BATCH_NUMBER;
                const batchResultsPromises: Promise<Vault[]>[] = [];
                for (let i = 0; i <= iterations; i++) {
                    ((innerOffset: number) => {
                        const batchedVaultsPromise = getVaultsWithPagination(
                            innerOffset,
                            BATCH_NUMBER
                        );
                        batchResultsPromises.push(batchedVaultsPromise);
                    })(offset);

                    offset = offset + BATCH_NUMBER;
                }

                const responses = await Promise.all(batchResultsPromises);
                const results: Vault[] = responses.flatMap(
                    (response) => response
                );
                const sortedResults = sortVaultsByVersion(results);
                setVaults((vaults) => [...vaults, ...sortedResults]);
            }
        } catch (error) {
            console.log('Error:', error);
            setIsLoading(false);
            setError(error);
        }
    };

    const fetchData = useMemo(() => {
        loadVaultData();
    }, []);

    useEffect(() => {
        fetchData;
    }, [vaults]);

    return (
        <div style={{ marginTop: 20 }}>
            {error && (
                <ErrorAlert
                    message={'Error while loading vaults:'}
                    details={error}
                />
            )}

            {isLoading ? (
                <ProgressSpinnerBar />
            ) : (
                !error && <VaultsList items={vaults} totalItems={total} />
            )}
        </div>
    );
};
