import React, { useEffect, useState } from 'react';
import { Params, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '@mui/material';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { ErrorAlert } from '../../common/Alerts';
import { Strategy, Network, DEFAULT_NETWORK } from '../../../types';
import EtherScanLink from '../../common/EtherScanLink';
import ReactHelmet from '../../common/ReactHelmet';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';
import { useStrategyReportContext } from '../../../contexts/StrategyReportContext';
import { GlobalStylesLoading } from '../../theme/globalStyles';

import { getError, getWarnings, getReportsForStrategies } from '../../../utils';
import {
    useStrategy,
    useVault,
    useSingleStrategyMetadata,
} from '../../../hooks';

import BreadCrumbs from './BreadCrumbs';
import GenLender from './GenLender';
import StrategyDetail from './StrategyDetail';
import StrategyHealthCheck from './StrategyHealthCheck';
import StrategyReports from './StrategyReports';

const StyledCard = styled(Card).withConfig({
    shouldForwardProp: (props) => props.toString() !== 'emergencyExit',
})<{
    emergencyExit?: string;
}>`
    && {
        background-color: ${({ theme }) => theme.container};
        color: ${({ theme }) => theme.title};
        margin-left: auto;
        margin-right: auto;
        border: ${({ theme, emergencyExit }) =>
            emergencyExit === 'false' ? theme.error : ''} !important;
        @media (max-width: 1400px) {
            max-width: 85%;
        }
        @media (max-width: 700px) {
            max-width: 100%;
        }
    }
`;

const StyledCardBreadCrumbs = styled(Card)`
    && {
        background-color: transparent;

        margin-left: auto;
        margin-right: auto;

        box-shadow: none !important;
        @media (max-width: 1400px) {
            max-width: 85%;
        }
        @media (max-width: 700px) {
            max-width: 100%;
        }
    }
`;

const StyledSpan = styled.span`
    && {
        color: ${({ theme }) => theme.subtitle};
    }
`;

interface ParamTypes extends Params {
    strategyId: string;
    vaultId: string;
    network?: Network;
}

enum AdditionalInfoLabels {
    GenLender = 'Gen Lender',
}

const getAdditionalInfoComponent = (
    label: AdditionalInfoLabels,
    network: Network,
    strategy?: Strategy
): JSX.Element | undefined => {
    switch (label) {
        case AdditionalInfoLabels.GenLender: {
            return (
                strategy && <GenLender strategy={strategy} network={network} />
            );
        }
        default: {
            throw Error('Could not find additional info component');
        }
    }
};

const getAdditionalInfo = (
    strategy?: Strategy
): AdditionalInfoLabels | undefined => {
    // Check if strategy has additional info to be displayed
    // eg. gen lender strategies
    if (strategy?.name === 'StrategyLenderYieldOptimiser') {
        return AdditionalInfoLabels.GenLender;
    }
    return undefined;
};

export const SingleStrategy = () => {
    const {
        strategyId,
        vaultId,
        network = DEFAULT_NETWORK,
    } = useParams() as ParamTypes;
    const [isReportsLoading, setIsReportsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [value, setValue] = useState(0);
    const [warningFields, setWarningFields] = useState<string[] | null>(null);
    const [openSnackBar, setOpenSB] = useState(true);
    const strategyReportContext = useStrategyReportContext();
    const { data: vault, loading: fetchVaultLoading } = useVault(
        network,
        vaultId
    );
    const { data: strategy, loading: fetchStrategyLoading } = useStrategy(
        network,
        vaultId,
        strategyId
    );
    const { data: strategyMetaData } = useSingleStrategyMetadata(
        network,
        vaultId,
        strategyId
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
        setValue(newValue);
    };

    const handleCloseSnackBar = () => {
        setOpenSB(false);
    };

    useEffect(() => {
        if (strategy) {
            const warnings = getWarnings([strategy]);
            if (warnings.length > 0) {
                setWarningFields(warnings);
            }
        }
    }, [strategy]);

    useEffect(() => {
        const loadStrategyData = async () => {
            try {
                setIsReportsLoading(true);
                // we don't want to handle error here for now
                getReportsForStrategies(
                    [strategyId],
                    network,
                    strategyReportContext
                ).then(() => {
                    setIsReportsLoading(false);
                });
            } catch (e: unknown) {
                console.log('Error:', e);
                setIsReportsLoading(false);
                setError(getError(e));
            }
        };
        loadStrategyData();
    }, [strategyId, vaultId]);

    const additionalInfo = getAdditionalInfo(strategy);

    const renderTab = (value: number): JSX.Element | undefined => {
        switch (value) {
            case 0: {
                return (
                    strategy && (
                        <StrategyDetail
                            strategy={strategy}
                            network={network}
                            metadata={strategyMetaData}
                        />
                    )
                );
            }
            case 1: {
                return (
                    <StrategyReports
                        network={network}
                        reports={
                            strategyReportContext.strategyReports[
                                strategyId.toLowerCase()
                            ]
                        }
                        tokenDecimals={strategy ? strategy.token.decimals : 18}
                    />
                );
            }
            case 2: {
                return (
                    strategy && (
                        <StrategyHealthCheck
                            strategy={strategy}
                            network={network}
                        />
                    )
                );
            }
            default: {
                if (!additionalInfo) {
                    throw Error('Should not render tab for additional info');
                }
                return getAdditionalInfoComponent(
                    additionalInfo,
                    network,
                    strategy
                );
            }
        }
    };

    return (
        <React.Fragment>
            <ReactHelmet title={strategy ? strategy.name : ''} />
            <Container>
                {error && (
                    <ErrorAlert
                        message={'Error while loading strategy data:'}
                        details={error}
                    />
                )}
                {warningFields && warningFields.length !== 0 && (
                    <Snackbar
                        open={openSnackBar}
                        onClose={handleCloseSnackBar}
                        autoHideDuration={10000}
                    >
                        <Alert onClose={handleCloseSnackBar} severity="warning">
                            {`Issue loading the following fields for some strategies: ${JSON.stringify(
                                warningFields
                            )}`}
                        </Alert>
                    </Snackbar>
                )}
                {fetchStrategyLoading || isReportsLoading ? (
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '100px',
                        }}
                    >
                        <ProgressSpinnerBar />
                        <GlobalStylesLoading />
                    </div>
                ) : (
                    !error && (
                        <React.Fragment>
                            <StyledCardBreadCrumbs>
                                <BreadCrumbs
                                    vaultId={vaultId}
                                    strategyId={strategyId}
                                    network={network}
                                />
                            </StyledCardBreadCrumbs>
                            <StyledCard
                                emergencyExit={
                                    strategy &&
                                    strategy.emergencyExit.toString()
                                }
                            >
                                <CardHeader
                                    title={strategy ? strategy.name : ''}
                                    subheader={
                                        <>
                                            {strategy ? (
                                                <EtherScanLink
                                                    address={strategy.address}
                                                    network={network}
                                                />
                                            ) : (
                                                ''
                                            )}

                                            <StyledSpan>
                                                (Vault:{' '}
                                                {fetchVaultLoading
                                                    ? '... loading vault name'
                                                    : vault && vault.name}
                                                )
                                            </StyledSpan>
                                        </>
                                    }
                                />
                            </StyledCard>
                            <br />
                            <StyledCard
                                emergencyExit={
                                    strategy &&
                                    strategy.emergencyExit.toString()
                                }
                            >
                                <Tabs
                                    value={value}
                                    variant="fullWidth"
                                    indicatorColor="primary"
                                    onChange={handleChange}
                                >
                                    <Tab label="Detail" />
                                    <Tab label="Reports" />
                                    <Tab label="Health Check" />
                                    {additionalInfo && (
                                        <Tab label={additionalInfo} />
                                    )}
                                </Tabs>
                                <div
                                    style={{
                                        height: '60vh',
                                        overflow: 'auto',
                                    }}
                                >
                                    {renderTab(value)}
                                </div>
                            </StyledCard>
                        </React.Fragment>
                    )
                )}
            </Container>
        </React.Fragment>
    );
};
