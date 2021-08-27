import { useMemo } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './components/theme/globalStyles';
import { useDarkMode } from './components/theme/useDarkMode';
import { lightTheme, darkTheme } from './components/theme/Themes';
import {
    Home,
    SingleVault,
    NavBar,
    Query,
    SingleStrategy,
} from './components/app';
import SignIn from './components/common/SignIn';
import PrivateRoute from './components/common/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { Risk } from './components/app/Risk';

const App = () => {
    const [theme, themeToggler, mountedComponent] = useDarkMode();
    const themeMode = useMemo(() => {
        return theme === 'light' ? lightTheme : darkTheme;
    }, [theme]);
    // if (!mountedComponent) return <div />;

    return (
        <Router>
            <NavBar themeToggler={themeToggler} theme={theme} />

            <Switch>
                <ThemeProvider theme={themeMode}>
                    <GlobalStyles /> <Route exact path="/" component={Home} />
                    <Route exact path="/query" component={Query} />
                    <Route
                        exact
                        path="/query/:groupingId/group/:groups"
                        component={Query}
                    />
                    <Route
                        exact
                        path="/vault/:vaultId"
                        component={SingleVault}
                    />
                    <Route
                        exact
                        path="/vault/:vaultId/strategy/:strategyId"
                        component={SingleStrategy}
                    />
                    <AuthProvider>
                        <Route exact path="/signin" component={SignIn} />
                        <Route exact path="/signout" component={SignIn} />
                        <PrivateRoute exact path="/risk" component={Risk} />
                    </AuthProvider>
                </ThemeProvider>
            </Switch>
        </Router>
    );
};

export default App;
