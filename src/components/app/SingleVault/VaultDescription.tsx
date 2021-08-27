import React from 'react';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Typography } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';

import TokenPrice from '../../common/TokenPrice';
import { checkLabel } from '../../../utils/checks';
import { formatBPS, displayAmount, sub } from '../../../utils/commonUtils';
import Table from '../../common/Table';
import ProgressBars from '../../common/ProgressBar';
import { Vault } from '../../../types';

interface VaultDescriptionProps {
    vault: Vault | undefined;
    isLoading: boolean;
}
const StyledTableRow = styled(TableRow)`
    && {
        background-color: ${({ theme }) => theme.container} !important;
    }
`;
const StyledTableCell = styled(TableCell)`
    && {
        color: ${({ theme }) => theme.title} !important;
    }
`;
export const VaultDescription = (props: VaultDescriptionProps) => {
    const { vault } = props;

    const renderErrors = () =>
        vault &&
        vault.configErrors &&
        vault.configErrors.map((message: string) => {
            return (
                <div key={message} style={{ color: '#ff6c6c' }}>
                    {message}
                </div>
            );
        });
    const api_version = vault ? vault.apiVersion : '';
    const emergency_shut_down =
        vault && vault.emergencyShutdown === false ? (
            <Chip
                label="ok"
                clickable
                style={{
                    color: '#fff',
                    backgroundColor: 'rgba(1,201,147,1)',
                }}
            />
        ) : (
            <Chip
                label="Emergency"
                clickable
                style={{
                    color: '#fff',
                    backgroundColor: '#ff6c6c',
                }}
            />
        );
    const rewards = vault ? checkLabel(vault.rewards) : '';
    const governance = vault ? checkLabel(vault.governance) : '';
    const management = vault ? checkLabel(vault.management) : '';
    const guardian = vault ? checkLabel(vault.guardian) : '';
    const total_asset =
        vault &&
        displayAmount(vault.totalAssets, vault.token.decimals) +
            '  ' +
            vault.token.symbol;
    const total_debt =
        vault &&
        displayAmount(vault.totalDebt, vault.token.decimals) +
            '  ' +
            vault.token.symbol;
    const unallocated =
        vault &&
        displayAmount(
            sub(vault.totalAssets, vault.totalDebt),
            vault.token.decimals
        ) +
            '  ' +
            vault.token.symbol;
    const vault_list = vault ? (
        <Typography variant="body2" color="textSecondary">
            {' '}
            Deposit limit :
            {displayAmount(vault.depositLimit, vault.token.decimals) +
                '  ' +
                vault.token.symbol}
        </Typography>
    ) : (
        ''
    );
    const management_fee = vault ? formatBPS(vault.managementFee) : '';
    const performance_fee = vault ? formatBPS(vault.performanceFee) : '';
    const debt_usage = vault ? formatBPS(vault.debtUsage) : '';
    const debt_ratio = vault ? formatBPS(vault.debtRatio) : '';
    const last_report_text = vault ? vault.lastReportText : '';
    const render_error = vault ? renderErrors() : '';
    return (
        <React.Fragment>
            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>
                            API Version:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {api_version}
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <StyledTableCell>{api_version}</StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            Emergency shut down:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {emergency_shut_down}
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                {emergency_shut_down}
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            Governance:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {' '}
                                <br />
                                {governance}
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>{governance}</StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            Management:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {' '}
                                <br />
                                {management}
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <StyledTableCell>{management}</StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    <StyledTableRow>
                        <StyledTableCell>
                            Guardian:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {guardian}
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>{guardian}</StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            Rewards:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {rewards}
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>{rewards}</StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            Assets:
                            <MediaQuery query="(max-device-width: 1224px)">
                                {' '}
                                <br />
                                Total asset:
                                {total_asset}
                                <ProgressBars vault={vault} />
                                {vault_list}
                            </MediaQuery>
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            <StyledTableCell>
                                Total asset:
                                {total_asset}
                                <ProgressBars vault={vault} />
                                {vault_list}
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    {vault ? (
                        <TokenPrice
                            label="Total Assets (USD):"
                            token={vault.token}
                            amount={vault.totalAssets}
                        />
                    ) : (
                        ''
                    )}
                    <StyledTableRow>
                        <StyledTableCell>
                            Management fee:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {management_fee} %
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>{management_fee}%</StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            Performance fee:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {performance_fee}%
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                {performance_fee}%
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>
                    <StyledTableRow>
                        <StyledTableCell>
                            Time Since Last Report:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br />
                                {last_report_text}
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>
                                {last_report_text}
                            </StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    <StyledTableRow>
                        <StyledTableCell>
                            Total Debt:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {total_debt}
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>{total_debt}</StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    <StyledTableRow>
                        <StyledTableCell>
                            {`(Total Asset - Total Debt):`}
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {unallocated}
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>{unallocated}</StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    <StyledTableRow>
                        <StyledTableCell>
                            Total Debt Ratio:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {debt_ratio}%
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>{debt_ratio}%</StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    <StyledTableRow>
                        <StyledTableCell>
                            Debt Usage:
                            <MediaQuery query="(max-device-width: 1224px)">
                                <br /> {debt_usage}%
                            </MediaQuery>{' '}
                        </StyledTableCell>
                        <MediaQuery query="(min-device-width: 1224px)">
                            {' '}
                            <StyledTableCell>{debt_usage}%</StyledTableCell>
                        </MediaQuery>
                    </StyledTableRow>

                    {vault && vault.configOK === false ? (
                        <StyledTableRow
                            style={{
                                border: '2px solid #ff6c6c',
                            }}
                        >
                            <StyledTableCell>
                                Config Warnings:
                                <MediaQuery query="(max-device-width: 1224px)">
                                    {' '}
                                    <br /> {render_error}
                                </MediaQuery>{' '}
                            </StyledTableCell>
                            <MediaQuery query="(min-device-width: 1224px)">
                                {' '}
                                <StyledTableCell>
                                    {render_error}
                                </StyledTableCell>
                            </MediaQuery>
                        </StyledTableRow>
                    ) : null}
                </TableHead>
            </Table>
        </React.Fragment>
    );
};
