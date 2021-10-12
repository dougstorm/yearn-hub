import { memo } from 'react';

import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Hidden from '@material-ui/core/Hidden';
import EtherScanLink from '../../common/EtherScanLink';
import Grid from '@material-ui/core/Grid';
import {
    extractText,
    displayAmount,
    formatBPS,
} from '../../../utils/commonUtils';
import { isStrategyActiveWithZeroDebt } from '../../../utils/alerts';
import { Network, Strategy, Vault } from '../../../types';
import DebTooltip from '../../common/DebToolTip';

type StrategiesListProps = {
    vault: Vault;
    expand?: boolean;
    network: Network;
};

const shouldHighlightStrategy = (strat: Strategy) => {
    return isStrategyActiveWithZeroDebt(strat);
};
const StyledDivRoot = styled.div`
    && {
        width: 99%;
        margin: 5px;
        border-radius: 5px;
    }
`;
const StyledMuiAccordion = styled(MuiAccordion)<{ config: string }>`
    && {
        width: 100%;
        align-items: center;
        align-content: center;
        margin-top: 10px;
        background-color: ${({ theme, config }) =>
            config === 'true'
                ? theme.subContainer
                : theme.containerConfig} !important;

        border-radius: 8px;
    }
`;
const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
    && {
        color: ${({ theme }) => theme.text} !important;
    }
`;
const StyledSubtitle = styled(Typography)`
    && {
        font-family: Roboto;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;

        color: ${({ theme }) => theme.subtitle} !important;
    }
`;
const StyleDiv = styled.div`
    && {
        margin-bottom: 75px;
    }
`;
const StyledTitle = styled(Typography)`
    && {
        font-family: Roboto;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 5px;
        color: ${({ theme }) => theme.title} !important;
    }
`;
const StyledSubtitleQueIndex = styled(Typography)<{ error: boolean }>`
    && {
        font-family: Roboto;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;

        color: ${({ theme, error }) =>
            error ? theme.error : theme.subtitle} !important;
    }
`;
const StyledTitleQueIndex = styled(Typography)<{ error: boolean }>`
    && {
        font-family: Roboto;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 5px;
        color: ${({ theme, error }) =>
            error ? theme.error : theme.title} !important;
    }
`;

const StyledLink = styled.a`
    && {
        font-family: Roboto;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 22px;

        color: ${({ theme }) => theme.subtitle} !important;
    }
`;
const _StrategiesList = (props: StrategiesListProps) => {
    const { vault, network, expand = true } = props;
    const config = vault.configOK;

    return (
        <StyledDivRoot>
            {vault.strategies &&
                vault.strategies.map((strategy: Strategy, index: number) => (
                    <StyledMuiAccordion
                        config={config.toString()}
                        key={index}
                        defaultExpanded={expand}
                        style={{
                            border: shouldHighlightStrategy(strategy)
                                ? '5px solid #ff6c6c'
                                : '',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<StyledExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Grid container spacing={1}>
                                <Grid item md={12} xs={12}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        alignItems="center"
                                    >
                                        <Grid item md={1}></Grid>
                                        <Grid item md={4} xs={12}>
                                            <StyledTitle>
                                                <StyledLink
                                                    href={`/network/${network}/vault/${strategy.vault}/strategy/${strategy.address}`}
                                                    rel="noreferrer"
                                                >
                                                    <Hidden smUp>
                                                        {strategy.name.length >
                                                        20
                                                            ? extractText(
                                                                  strategy.name
                                                              )
                                                            : strategy.name}
                                                    </Hidden>

                                                    <Hidden xsDown>
                                                        {strategy.name}
                                                    </Hidden>
                                                </StyledLink>
                                            </StyledTitle>
                                        </Grid>
                                        <Hidden xsDown>
                                            {' '}
                                            <Grid item md={6} xs={9}>
                                                <EtherScanLink
                                                    address={strategy.address}
                                                    network={network}
                                                />
                                            </Grid>
                                        </Hidden>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <Hidden smUp>
                            <Grid
                                container
                                spacing={1}
                                style={{ marginLeft: 10 }}
                            >
                                <Grid item md={8} xs={12}>
                                    <EtherScanLink
                                        address={strategy.address}
                                        network={network}
                                    />
                                </Grid>
                            </Grid>
                        </Hidden>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12}>
                                    <Grid
                                        container
                                        spacing={1}
                                        direction="row"
                                        justify="flex-start"
                                        alignItems="center"
                                    >
                                        <Grid item md={1}></Grid>
                                        <Grid item md={10} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item md={12} xs={12}>
                                                    <Grid
                                                        container
                                                        spacing={1}
                                                        direction="row"
                                                        justify="flex-start"
                                                        alignItems="center"
                                                    >
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            md={3}
                                                        >
                                                            <StyledTitle>
                                                                {
                                                                    strategy
                                                                        .params
                                                                        .lastReportText
                                                                }
                                                            </StyledTitle>

                                                            <StyledSubtitle>
                                                                Since Last
                                                                Report
                                                            </StyledSubtitle>
                                                        </Grid>
                                                        <StyleDiv />
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            md={2}
                                                        >
                                                            <StyledTitle>
                                                                <DebTooltip
                                                                    label={
                                                                        vault &&
                                                                        displayAmount(
                                                                            strategy.params.totalDebt.toString(),
                                                                            vault
                                                                                .token
                                                                                .decimals,
                                                                            vault
                                                                                .token
                                                                                .decimals
                                                                        )
                                                                    }
                                                                />
                                                            </StyledTitle>

                                                            <StyledSubtitle>
                                                                {' '}
                                                                Total debt
                                                            </StyledSubtitle>
                                                        </Grid>
                                                        <StyleDiv />
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            md={2}
                                                        >
                                                            <StyledTitle>
                                                                <DebTooltip
                                                                    label={`${formatBPS(
                                                                        strategy.params.debtRatio.toString()
                                                                    )}%`}
                                                                />
                                                            </StyledTitle>

                                                            <StyledSubtitle>
                                                                {' '}
                                                                Debt ratio
                                                            </StyledSubtitle>
                                                        </Grid>
                                                        <StyleDiv />
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            md={2}
                                                        >
                                                            <StyledTitle>
                                                                {' '}
                                                                <DebTooltip
                                                                    label={
                                                                        vault &&
                                                                        displayAmount(
                                                                            strategy.creditAvailable.toString(),
                                                                            vault
                                                                                .token
                                                                                .decimals
                                                                        )
                                                                    }
                                                                />
                                                            </StyledTitle>

                                                            <StyledSubtitle>
                                                                {' '}
                                                                Credit available
                                                            </StyledSubtitle>
                                                        </Grid>
                                                        <StyleDiv />
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            md={2}
                                                        >
                                                            <StyledTitle>
                                                                <DebTooltip
                                                                    label={
                                                                        vault &&
                                                                        strategy.estimatedTotalAssets &&
                                                                        displayAmount(
                                                                            strategy.estimatedTotalAssets.toString(),
                                                                            vault
                                                                                .token
                                                                                .decimals,
                                                                            vault
                                                                                .token
                                                                                .decimals
                                                                        )
                                                                    }
                                                                />
                                                            </StyledTitle>
                                                            <StyledSubtitle>
                                                                {' '}
                                                                Total Estimated
                                                                Assets
                                                            </StyledSubtitle>
                                                        </Grid>
                                                        <StyleDiv />
                                                        <Grid
                                                            item
                                                            xs={12}
                                                            md={1}
                                                        >
                                                            <StyledTitleQueIndex
                                                                error={
                                                                    strategy.withdrawalQueueIndex <
                                                                    0
                                                                }
                                                            >
                                                                {vault &&
                                                                    displayAmount(
                                                                        strategy.withdrawalQueueIndex.toString(),
                                                                        0
                                                                    )}
                                                            </StyledTitleQueIndex>
                                                            <StyledSubtitleQueIndex
                                                                error={
                                                                    strategy.withdrawalQueueIndex <
                                                                    0
                                                                }
                                                            >
                                                                Index
                                                            </StyledSubtitleQueIndex>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </StyledMuiAccordion>
                ))}
        </StyledDivRoot>
    );
};

export const StrategiesList = memo(_StrategiesList);
