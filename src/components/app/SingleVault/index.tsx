import React, { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { Vault } from '../../../types';
import { getVault } from '../../../utils/vaults';
import BreadCrumbs from '../SingleStrategy/BreadCrumbs';
import Pie from '../Charts/Pie';
import { StrategistList } from '../StrategistList';
import { VaultDescription } from './VaultDescription';
import EtherScanLink from '../../common/EtherScanLink';
import { ErrorAlert } from '../../common/Alerts';
import ReactHelmet from '../../common/ReactHelmet';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

interface ParamTypes {
    vaultId: string;
}
export const SingleVault = () => {
    const { vaultId } = useParams<ParamTypes>();

    const [vault, setVault] = useState<Vault | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [value, setValue] = useState(0);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        const loadVaultData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const loadedVault = await getVault(vaultId);
                setVault(loadedVault);
                setIsLoading(false);
            } catch (error) {
                console.log('Error:', error);
                setIsLoading(false);
                setError(error);
            }
        };
        loadVaultData();
    }, [vaultId]);

    const StyledCard = styled(Card)`
        && {
            background-color: ${({ theme }) => theme.container};
            color: ${({ theme }) => theme.title};
            margin-left: auto;
            margin-right: auto;
            border: ${({ theme }) =>
                vault && vault.configOK === false
                    ? theme.error
                    : ''} !important;
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
    const StyledTitle = styled.span`
        && {
            color: ${({ theme }) => theme.title};
            font-weight: bold;
            font-size: 18px;
        }
    `;
    return (
        <React.Fragment>
            <ReactHelmet title={vault ? vault.name : ''} />
            <BreadCrumbs vaultId={vaultId} />
            <Container>
                {error && (
                    <StyledCard>
                        <ErrorAlert
                            message={`Error while loading vault ${vaultId}:`}
                            details={error}
                        />
                    </StyledCard>
                )}
                {isLoading ? (
                    <StyledCard>
                        <div
                            style={{
                                textAlign: 'center',
                                marginTop: '100px',
                            }}
                        >
                            <ProgressSpinnerBar />
                        </div>
                    </StyledCard>
                ) : (
                    !error && (
                        <React.Fragment>
                            <StyledCard>
                                <CardHeader
                                    avatar={
                                        <Avatar
                                            src={vault ? vault.icon : ''}
                                            aria-label="recipe"
                                        />
                                    }
                                    title={
                                        <StyledTitle>
                                            {vault ? vault.name : ''}
                                        </StyledTitle>
                                    }
                                    subheader={
                                        vault ? (
                                            <>
                                                <StyledSpan>
                                                    {' '}
                                                    {
                                                        vault.strategies.length
                                                    }{' '}
                                                    strats
                                                </StyledSpan>

                                                <br />
                                                <EtherScanLink
                                                    address={vault.address}
                                                />
                                            </>
                                        ) : (
                                            ''
                                        )
                                    }
                                />
                            </StyledCard>
                            <br />
                            <StyledCard>
                                <Tabs
                                    value={value}
                                    onChange={handleChange}
                                    indicatorColor="primary"
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs example"
                                >
                                    <Tab label="Details" {...a11yProps(0)} />
                                    <Tab label="Allocation" {...a11yProps(1)} />
                                    <Tab label="Strategies" {...a11yProps(2)} />
                                </Tabs>

                                <TabPanel value={value} index={0}>
                                    <VaultDescription
                                        vault={vault}
                                        isLoading={isLoading}
                                    />
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    {vault && vault.strategies.length > 0 ? (
                                        <div>
                                            <Pie vault={vault} />
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    {vault && vault.strategies.length > 0 ? (
                                        <div>
                                            <StrategistList
                                                vault={vault}
                                                dark={false}
                                            />
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </TabPanel>
                            </StyledCard>
                        </React.Fragment>
                    )
                )}
            </Container>
        </React.Fragment>
    );
};
