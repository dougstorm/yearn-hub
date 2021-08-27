import React from 'react';
import styled from 'styled-components';

import LinearProgress from '@material-ui/core/LinearProgress';

import { Container, Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
    text-align: center;
    font-weight: 200;
    color: white;
`;
const StyledRootDiv = styled.div`
    width: 100%;
    margin-top: 2;
`;
const StyledLinearProgress = styled(LinearProgress)`
    && {
        .MuiLinearProgress-bar {
            background-color: ${({ theme }) => theme.barProgress} !important;
        }
    }
`;
export default function LinearDeterminate() {
    const [completed, setCompleted] = React.useState(0);

    React.useEffect(() => {
        function progress() {
            setCompleted((oldCompleted) => {
                if (oldCompleted === 100) {
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldCompleted + diff, 100);
            });
        }

        const timer = setInterval(progress, 500);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <Container>
            <StyledRootDiv>
                <StyledTypography>Loading</StyledTypography>

                <StyledLinearProgress
                    variant="determinate"
                    value={completed}
                    color="primary"
                />
            </StyledRootDiv>
        </Container>
    );
}
