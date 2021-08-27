import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import styled from 'styled-components';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import logoYearnLight from '../../../images/logo_yearn_watch_light.svg';
import logoYearnDark from '../../../images/logo_yearn_watch_dark.svg';

const StyledRoot = styled.div`
    flex-grow: 1;
`;
const StyledMainImage = styled.div`
    flex-grow: 1;
    text-align: center;
`;

const StyledAppBar = styled(AppBar)`
    background-color: transparent !important;
`;
const StyledImg = styled.img`
    height: 64px;
`;
const StyledBrightness2Icon = styled(Brightness2Icon)`
    color: ${({ theme }) => theme.iconTheme};
`;
interface NavBarProps {
    themeToggler: any;

    theme: string | boolean | (() => void);
}

// (event: React.MouseEvent<HTMLButtonElement>) => void
export const NavBar: React.FC<NavBarProps> = ({ themeToggler, theme }) => {
    return (
        <StyledRoot>
            <StyledAppBar position="static" elevation={0}>
                <Toolbar>
                    <StyledMainImage>
                        <StyledImg
                            alt="yearn watch"
                            src={
                                theme === 'light'
                                    ? logoYearnLight
                                    : logoYearnDark
                            }
                        />
                    </StyledMainImage>

                    <div>
                        <IconButton
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={themeToggler}
                            color="inherit"
                        >
                            {theme === 'light' ? (
                                <StyledBrightness2Icon />
                            ) : (
                                <Brightness4Icon />
                            )}
                        </IconButton>
                    </div>
                </Toolbar>
            </StyledAppBar>
        </StyledRoot>
    );
};
