import { Fragment, useState, memo } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Tooltip from '@material-ui/core/Tooltip';
import { Network, Vault } from '../../../types';
import { StrategiesList } from '../StrategiesList';
import EtherScanLink from '../../common/EtherScanLink';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { ReportProblem } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { HtmlTooltip } from '../../common/HtmlTooltip';

type VaultItemListProps = {
    vault: Vault;
    key: number;
    network: Network;
};

const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
    && {
        color: ${({ theme }) => theme.text} !important;
    }
`;
const StyledStrats = styled.span`
    && {
        color: ${({ theme }) => theme.subtitle} !important;

        text-decoration: none;
        font-weight: normal;

        line-height: 16px;
        font-size: 16px;
    }
`;
const StyledTextValue = styled.span`
    && {
        color: ${({ theme }) => theme.title} !important;

        text-decoration: underline;
        font-weight: bold;
        font-family: Roboto;
        line-height: 24px;
        font-size: 16px;
        font-style: normal;
        &:hover {
            font-size: 19;
        }
    }
`;
const StyledReportProblem = styled(ReportProblem)`
    && {
        color: ${({ theme }) => theme.title} !important;
        border-radius: 3;
        padding: 1;
        box-shadow: 0px 0px 0px 0 rgba(0, 0, 0, 0.2);
    }
`;

const StyledMuiAccordion = styled(MuiAccordion)<{ config: string }>`
    && {
        width: 100%;
        margin-top: 15px;
        margin-bottom: 15px;
        align-items: center;
        align-content: center;
        background-color: ${({ theme, config }) =>
            config === 'true'
                ? theme.container
                : theme.backgroundConfig} !important;
        border: ${({ theme, config }) =>
            config === 'true'
                ? '3px solid transparent'
                : `4px solid ${theme.borderConfig}`};
        border-radius: 8px;
    }
`;
const _VaultItemList = (props: VaultItemListProps) => {
    const { vault, network } = props;
    const config = vault.configOK;
    //hook to render list only when panel actually expanded
    const [expanded, setExpanded] = useState(false);

    const BlueOnGreenTooltip = withStyles({
        tooltip: {
            color: config ? 'transparent' : '#F2F2F2',
            backgroundColor: config ? 'transparent' : '#EB5757',
            fontSize: '16px',
        },
    })(Tooltip);

    return (
        <StyledMuiAccordion config={config.toString()}>
            <AccordionSummary
                expandIcon={<StyledExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                onClick={() => setExpanded(!expanded)}
            >
                <Grid container spacing={1} justify="flex-start">
                    <Grid item md={12} xs={12}>
                        <BlueOnGreenTooltip title="" placement="top">
                            <Grid
                                container
                                spacing={1}
                                direction="row"
                                justify="flex-start"
                                alignItems="center"
                            >
                                <Grid item md={1} xs={3}>
                                    {vault && vault.icon ? (
                                        <ListItemAvatar>
                                            {
                                                <Avatar
                                                    alt={vault.icon}
                                                    src={vault.icon}
                                                />
                                            }
                                        </ListItemAvatar>
                                    ) : (
                                        <ListItemAvatar>
                                            <Avatar
                                                style={{
                                                    color: 'transparent',
                                                }}
                                            >
                                                .
                                            </Avatar>
                                        </ListItemAvatar>
                                    )}
                                </Grid>
                                <Grid item md={4} xs={9}>
                                    {vault.configErrors ? (
                                        <HtmlTooltip
                                            title={
                                                <Fragment>
                                                    <Typography>
                                                        {
                                                            vault.configErrors
                                                                .length
                                                        }{' '}
                                                        warning(s) found
                                                    </Typography>
                                                    {vault.configErrors.map(
                                                        (error, index) => (
                                                            <em key={index}>
                                                                {error}
                                                                <br />
                                                            </em>
                                                        )
                                                    )}
                                                </Fragment>
                                            }
                                        >
                                            <StyledReportProblem />
                                        </HtmlTooltip>
                                    ) : (
                                        ''
                                    )}
                                    <a
                                        href={`/network/${network}/vault/${vault.address}`}
                                        rel="noreferrer"
                                    >
                                        <StyledTextValue>
                                            {' '}
                                            {vault.name}
                                            {` v${vault.apiVersion}`}
                                        </StyledTextValue>
                                    </a>
                                    <br />
                                    <StyledStrats>
                                        {` ${vault.strategies.length}  strats`}
                                    </StyledStrats>
                                </Grid>
                                <Hidden xsDown>
                                    {' '}
                                    <Grid item md={6} xs={9}>
                                        <EtherScanLink
                                            address={vault.address}
                                            dark={true}
                                            network={network}
                                        />
                                    </Grid>
                                </Hidden>
                            </Grid>
                        </BlueOnGreenTooltip>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <Hidden smUp>
                <Grid container spacing={2}>
                    <Grid item md={1} xs={1}></Grid>
                    <Grid item md={8} xs={11}>
                        <EtherScanLink
                            address={vault.address}
                            dark={true}
                            network={network}
                        />
                    </Grid>
                </Grid>
            </Hidden>

            <AccordionDetails>
                {expanded && (
                    <StrategiesList
                        vault={vault}
                        expand={expanded}
                        network={network}
                    />
                )}
            </AccordionDetails>
        </StyledMuiAccordion>
    );
};

export const VaultItemList = memo(_VaultItemList);
