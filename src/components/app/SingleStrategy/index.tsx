import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import MuiCard from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import StrategyDetail from './StrategyDetail';

import { ErrorAlert } from '../../common/Alerts';
import { Strategy } from '../../../types';

import BreadCrumbs from './BreadCrumbs';
import EtherScanLink from '../../common/EtherScanLink';
import ReactHelmet from '../../common/ReactHelmet';
import ProgressSpinnerBar from '../../common/ProgressSpinnerBar/ProgressSpinnerBar';

import { getStrategies } from '../../../utils/strategies';
import { getReportsForStrategy, StrategyReport } from '../../../utils/reports';

import StrategyReports from './StrategyReports';
interface ParamTypes {
    strategyId: string;
    vaultId: string;
}

export const SingleStrategy = () => {
    const { strategyId, vaultId } = useParams<ParamTypes>();
    const [strategyData, setStrategyData] = useState<Strategy[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [strategyReports, setStrategyReports] = useState<StrategyReport[]>(
        []
    );
    const [isReportsLoading, setIsReportsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        const loadStrategyData = async () => {
            setIsLoading(true);
            setIsReportsLoading(true);
            setError(null);
            // we don't want to handle error here for now
            getReportsForStrategy(strategyId).then((reports) => {
                setStrategyReports(reports);
                setIsReportsLoading(false);
            });
            try {
                const loadedStrategy = await getStrategies([strategyId]);
                setStrategyData(loadedStrategy);
                setIsLoading(false);
            } catch (error) {
                console.log('Error:', error);
                setIsLoading(false);
                setError(error);
            }
        };
        loadStrategyData();
    }, [strategyId]);

    const strategy = strategyData && strategyData[0];

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                [theme.breakpoints.down('sm')]: {
                    maxWidth: '100%',
                },
                [theme.breakpoints.up('md')]: {
                    maxWidth: '80%',
                },
                [theme.breakpoints.up('lg')]: {
                    maxWidth: '80%',
                },

                marginLeft: 'auto',
                marginRight: 'auto',
                border:
                    strategy && strategy.emergencyExit
                        ? '2px solid #ff6c6c'
                        : '#fff',
            },
            demo1: {
                borderBottom: '1px solid #e8e8e8',
            },
        })
    );

    const classes = useStyles();

    return (
        <React.Fragment>
            <ReactHelmet title={strategy ? strategy.name : ''} />
            <BreadCrumbs vaultId={vaultId} strategyId={strategyId} />
            {error && (
                <ErrorAlert
                    message={'Error while loading strategy data:'}
                    details={error}
                />
            )}
            {isLoading || isReportsLoading ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: '100px',
                    }}
                >
                    <ProgressSpinnerBar />
                </div>
            ) : (
                !error && (
                    <MuiCard className={classes.root}>
                        <CardHeader
                            title={strategy ? strategy.name : ''}
                            subheader={
                                strategy ? (
                                    <EtherScanLink address={strategy.address} />
                                ) : (
                                    ''
                                )
                            }
                        />
                        <Tabs
                            className={classes.demo1}
                            value={value}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={handleChange}
                        >
                            <Tab label="Detail" />
                            <Tab label="Reports" />
                        </Tabs>

                        {value === 0 ? (
                            <StrategyDetail strategy={strategy} />
                        ) : (
                            <StrategyReports
                                reports={strategyReports}
                                tokenDecimals={
                                    strategy ? strategy.token.decimals : 18
                                }
                            />
                        )}
                    </MuiCard>
                )
            )}
        </React.Fragment>
    );
};
