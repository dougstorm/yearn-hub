import React, { useEffect, useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';

import { useParams } from 'react-router-dom';

import { Vault } from '../../../types';
import { getVault } from '../../../utils/vaults';

import Pie from '../Charts/Pie';
import { StrategistList } from '../StrategistList';

import { VaultDescription } from './VaultDescription';
import Avatar from '@material-ui/core/Avatar';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import EtherScanLink from '../../common/EtherScanLink';

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
    id: string;
}
export const SingleVault = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };
    const { id } = useParams<ParamTypes>();

    const [vault, setVault] = useState<Vault | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        getVault(id).then((loadedVault) => {
            setVault(loadedVault);
            setIsLoading(false);
        });
    }, [id]);
    const useStyles = makeStyles((theme: Theme) => ({
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
                vault && vault.configOK === false ? '5px solid #ff6c6c' : '',
        },
        crumbs: {
            maxWidth: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 15,
            marginTop: 15,
            color: '#fff',
        },
        text: {
            color: '#ffff',
            fontWeight: 'bolder',
        },
        row: {
            background: '#0a1d3f',
        },
        gridContainer: {
            flexGrow: 1,
        },

        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
    }));
    const classes = useStyles();
    return (
        <React.Fragment>
            <Breadcrumbs className={classes.crumbs}>
                <Link color="inherit" href="/">
                    vaults
                </Link>

                <Typography className={classes.text}>
                    {vault ? vault.name : ''}
                </Typography>
            </Breadcrumbs>
            <Card className={classes.root}>
                {isLoading ? (
                    <div
                        style={{
                            textAlign: 'center',
                            marginTop: '100px',
                        }}
                    >
                        <CircularProgress />{' '}
                        <Typography>Loading vault..</Typography>
                    </div>
                ) : (
                    <React.Fragment>
                        <CardHeader
                            avatar={
                                <Avatar
                                    src={vault ? vault.icon : ''}
                                    aria-label="recipe"
                                />
                            }
                            title={vault ? vault.name : ''}
                            subheader={
                                vault ? (
                                    <EtherScanLink address={vault.address} />
                                ) : (
                                    ''
                                )
                            }
                        />

                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="primary"
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
                    </React.Fragment>
                )}
            </Card>
        </React.Fragment>
    );
};
