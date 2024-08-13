import ReactGA from 'react-ga4';
import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useThemeProvider } from '@contexts/themeContext';
import { useWindowSize } from 'react-use';
import useAuthRoute from '@hooks/useAuthRoute';
import ThemeStyles from '@styles/theme';
import './style.scss';
import { SidebarProvider } from '@contexts/sidebarContext';
import { ThemeProvider } from 'styled-components';
import { StyleSheetManager } from 'styled-components';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { preventDefault } from '@utils/helpers';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ToastContainer } from 'react-toastify';
import LoadingScreen from '@components/LoadingScreen';
import Sidebar from '@layout/Sidebar';
import BottomNav from '@layout/BottomNav';
import Navbar from '@layout/Navbar';
import ShoppingCart from '@widgets/ShoppingCart';
import ScrollToTop from '@components/ScrollToTop';
import { supabase } from './utils/superbase';

const ClubSummary = lazy(() => import('@pages/ClubSummary'));
const GameSummary = lazy(() => import('@pages/GameSummary'));
const Championships = lazy(() => import('@pages/Championships'));
const LeagueOverview = lazy(() => import('@pages/LeagueOverview'));
const FansCommunity = lazy(() => import('@pages/FansCommunity'));
const Statistics = lazy(() => import('@pages/Statistics'));
const PageNotFound = lazy(() => import('@pages/PageNotFound'));
const MatchSummary = lazy(() => import('@pages/MatchSummary'));
const MatchOverview = lazy(() => import('@pages/MatchOverview'));
const PlayerProfile = lazy(() => import('@pages/PlayerProfile'));
const Schedule = lazy(() => import('@pages/Schedule'));
const Tickets = lazy(() => import('@pages/Tickets'));
const FootballStore = lazy(() => import('@pages/FootballStore'));
const BrandStore = lazy(() => import('@pages/BrandStore'));
const Product = lazy(() => import('@pages/Product'));
const Login = lazy(() => import('@pages/Login'));
const SignUp = lazy(() => import('@pages/SignUp'));
const Settings = lazy(() => import('@pages/Settings'));

const App = () => {
    const appRef = useRef(null);
    const { theme, direction } = useThemeProvider();
    const { width } = useWindowSize();
    const isAuthRoute = useAuthRoute();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);

    // Google Analytics init
    const gaKey = process.env.REACT_APP_PUBLIC_GA;
    if (gaKey) {
        ReactGA.initialize(gaKey);
    }

    const plugins = direction === 'rtl' ? [rtlPlugin] : [];

    const muiTheme = createTheme({
        direction: direction,
    });

    const cacheRtl = createCache({
        key: 'css-rtl',
        stylisPlugins: plugins,
    });

    useEffect(() => {
        appRef.current?.scrollTo(0, 0);
        preventDefault();
    }, []);

    useEffect(() => {
        const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                // navigate('/login');
            }
        });

        return () => subscription?.unsubscribe();
    }, [navigate]);

    return (
        <CacheProvider value={cacheRtl}>
            <MuiThemeProvider theme={muiTheme}>
                <SidebarProvider>
                    <ThemeProvider theme={{ theme: theme }}>
                        <ThemeStyles />
                        <ToastContainer
                            theme={theme}
                            autoClose={2500}
                            position={direction === 'ltr' ? 'top-right' : 'top-left'}
                        />
                        <StyleSheetManager stylisPlugins={plugins}>
                            <div className={`app ${isAuthRoute ? 'fluid' : ''}`} ref={appRef}>
                                <ScrollToTop />
                                {!isAuthRoute && session && (
                                    <>
                                        <Sidebar />
                                        {width < 768 && <Navbar />}
                                        {width < 768 && <BottomNav />}
                                    </>
                                )}
                                <div className="app_container">
                                    <div className="app_container-content d-flex flex-column flex-1">
                                        <Suspense fallback={<LoadingScreen />}>
                                            <Routes>
                                                {session ? (
                                                    <>
                                                        <Route path="/welcome" element={<ClubSummary />} />
                                                        <Route path="/game-summary" element={<GameSummary />} />
                                                        <Route path="/championships" element={<Championships />} />
                                                        <Route path="/league-overview" element={<LeagueOverview />} />
                                                        <Route path="/fans-community" element={<FansCommunity />} />
                                                        <Route path="/statistics" element={<Statistics />} />
                                                        <Route path="/match-summary" element={<MatchSummary />} />
                                                        <Route path="/match-overview" element={<MatchOverview />} />
                                                        <Route path="/player-profile" element={<PlayerProfile />} />
                                                        <Route path="/schedule" element={<Schedule />} />
                                                        <Route path="/tickets" element={<Tickets />} />
                                                        <Route path="/football-store" element={<FootballStore />} />
                                                        <Route path="/brand-store" element={<BrandStore />} />
                                                        <Route path="/product" element={<Product />} />
                                                        <Route path="/settings" element={<Settings />} />
                                                        <Route path="*" element={<PageNotFound />} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Route path="/login" element={<Login />} />
                                                        <Route path="/sign-up" element={<SignUp />} />
                                                        <Route path="*" element={<Login />} />
                                                    </>
                                                )}
                                            </Routes>
                                        </Suspense>
                                    </div>
                                </div>
                                {session && <ShoppingCart isPopup />}
                            </div>
                        </StyleSheetManager>
                    </ThemeProvider>
                </SidebarProvider>
            </MuiThemeProvider>
        </CacheProvider>
    );
};

export default App;
