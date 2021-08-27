import styled from 'styled-components';

import Tooltip from '@material-ui/core/Tooltip';

const StyledTooltip = styled(Tooltip)`
    && {
        cursor: pointer;
        .MuiTooltip-tooltip {
            background-color: rgba(0, 0, 0, 0.87);

            font-size: 11;

            color: ${({ theme }) => theme.subtitle} !important;
        }
        .MuiTooltip-popperArrow {
            color: red;
        }
    }
`;

interface DebTooltipProps {
    label: any;
}
export default function DebTooltip(props: DebTooltipProps) {
    return (
        <div>
            <StyledTooltip title={props.label} placement="top-start">
                <span>{props.label.slice(0, 15)}</span>
            </StyledTooltip>
        </div>
    );
}
