import { MouseEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { extractAddress } from '../../../utils/commonUtils';
import Hidden from '@material-ui/core/Hidden';
import CallMadeIcon from '@material-ui/icons/CallMade';
import Tooltip from '@material-ui/core/Tooltip';
import { FileCopy } from '@material-ui/icons';
import { Link } from '@material-ui/core';

type EtherScanLinkProps = {
    address?: string;
    transactionHash?: string;
    dark?: boolean | false;
    internalHref?: string;
};
const StyledFileCopy = styled(FileCopy)`
    && {
        color: ${({ theme }) => theme.text} !important;

        border-radius: 3;
        padding: 2;
    }
`;
const StyledCallMadeIcon = styled(CallMadeIcon)`
    && {
        color: ${({ theme }) => theme.text} !important;
        border-radius: 3;
        padding: 2;
    }
`;
const StyledAddress = styled.span`
    && {
        color: ${({ theme }) => theme.subtitle} !important;

        text-decoration: none;
        font-weight: 400;

        line-height: 14px;
        font-size: 16px;
        font-style: normal;
    }
`;
const StyledCopiedText = styled.span`
    && {
        color: ${({ theme }) => theme.subtitle} !important;
    }
`;
const EtherScanLink = (props: EtherScanLinkProps) => {
    const { address, transactionHash, internalHref } = props;
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setCopied(false);
        }, 1000);

        return () => clearTimeout(timeId);
    }, [copied]);

    let value = '';
    let extractedValue = '';
    if (address) {
        value = address;
        extractedValue = extractAddress(address);
    }
    if (transactionHash) {
        value = transactionHash;
        extractedValue = extractAddress(transactionHash);
    }

    const maskedValue = (
        <Tooltip title={value} aria-label="Etherscan">
            <span>{extractedValue}</span>
        </Tooltip>
    );
    const onCopyToClipboard = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        setCopied(true);
    };
    const refLink = transactionHash
        ? `https://etherscan.io/tx/${value}`
        : `https://etherscan.io/address/${value}`;
    return (
        <span>
            <StyledAddress>
                {internalHref ? (
                    <Link color="inherit" href={internalHref}>
                        <Hidden smUp>{`${maskedValue}`}</Hidden>
                        <Hidden xsDown>{value}</Hidden>
                    </Link>
                ) : (
                    <>
                        <Hidden smUp>{maskedValue}</Hidden>
                        <Hidden xsDown>{value}</Hidden>
                    </>
                )}
            </StyledAddress>
            <Tooltip title="Copy to clipboard" aria-label="Clipboard">
                <Button onClick={(e) => onCopyToClipboard(e)}>
                    <StyledFileCopy fontSize="inherit" />
                    {copied ? <StyledCopiedText> Copied</StyledCopiedText> : ''}
                </Button>
            </Tooltip>
            <Tooltip title="View on Etherscan" aria-label="Etherscan">
                <Button href={refLink} target="_blank">
                    <StyledCallMadeIcon fontSize="inherit" />
                </Button>
            </Tooltip>
        </span>
    );
};

export default EtherScanLink;
