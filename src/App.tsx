import { useEffect, useRef } from 'react'
import { Switch, Route, Redirect, useLocation, useHistory } from 'react-router-dom'
import { useAuth } from 'src/modules/User/authentication/useAuth'
import { routes as routesConfig, navigationsConfig, IAdditionnalSettings, IPageSettingsDisabled } from 'src/routes'
import Layout1 from 'src/common/ui-kit/fuse/layouts/layout1/Layout1'
import ThemingProvider from 'src/common/ui-kit/fuse/components/ThemingProvider'
import { navbarItemType } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import { ToolbarWidget as ToolbarContent } from 'src/modules/Layout'
import { ConfirmProvider } from 'material-ui-confirm'
import ToolbarIcon from 'src/modules/Layout/Toolbar/components/ToolbarIcon'
import { IPageSettings } from 'src/common/react-platform-components'
import { styled } from '@mui/material/styles'
import { useLastVisit } from 'src/modules/User/LastVisit/LastVisitHook'
import dayjs from 'dayjs'
import { RootState } from 'src/redux'
import { useSelector } from 'react-redux'
import { isMaintenanceMode } from 'src/configs'
import { Maintenance } from 'src/modules/Maintenance/Maintenance'
import { URL_MAINTENANCE } from 'src/modules/Maintenance/MaintenanceConfig'
import { getTokenFromFirebase } from 'src/firebase'
import { isEnergyProviderSubscriptionForm } from './modules/User/EnergyProviderSubscription/EnergyProviderSubscriptionConfig'
import PdlVerificationForm from './modules/User/EnergyProviderSubscription/PdlVerificationForm'

const Root = styled('div')(({ theme }) => ({
    '& #fuse-main': {
        [theme.breakpoints.down('md')]: {
            marginBottom: '0px !important',
            paddingBottom: '20px',
        },
        '& > div': {
            [theme.breakpoints.down('lg')]: {
                marginBottom: '5.6rem',
            },
        },
    },
    '& .fuse-list-item': {
        '& .fuse-list-item-icon': {
            height: 'auto',
        },
    },
    '& .fuse-bottom-navigation-item': {
        '& .MuiIcon-root': {
            height: 'auto',
        },
    },
    '& .MuiToolbar-root': {
        // Styling the container of the Navbar toggle button.
        '& > div:nth-of-type(1)': {
            [theme.breakpoints.down('sm')]: {
                padding: 0,
            },
        },
        // Styling the toolbarContent.
        '& > div:nth-of-type(2)': {
            overflowX: 'hidden',
        },
    },
}))

/**
 * Check if the route is enabled or not.
 *
 * @param settings Route.settings.
 * @returns Return true if it's disabled, false if not disabled or does not contain the property.
 */
const isRouteDisabled = (
    settings: (IPageSettings & IAdditionnalSettings) | IPageSettings | IPageSettingsDisabled | undefined,
) => {
    if (settings) {
        if (settings?.hasOwnProperty('disabled')) return (settings as IPageSettingsDisabled).disabled
        if (settings?.layout?.navbar?.UINavbarItem?.hasOwnProperty('disabled'))
            return (settings as IPageSettings & IAdditionnalSettings)?.layout?.navbar?.UINavbarItem?.disabled
    } else {
        return false
    }
}

/**
 * Routes accessible to the app wrapped by access hook.
 *
 * @returns List of routes accessible to the app wrapped by access hook.
 */
const Routes = () => {
    const location = useLocation()
    const history = useHistory()
    const { user } = useSelector(({ userModel }: RootState) => userModel)
    const { updateLastVisitTime } = useLastVisit(dayjs().toISOString())

    useEffect(() => {
        /**
         * If there is no user in redux, it means that the user isn't logged in.
         * Therefore we don't need to perform updateLastVisitTime().
         */
        if (!user) return
        updateLastVisitTime()
    }, [location.pathname, updateLastVisitTime, user])

    const { hasAccess, getUrlRedirection } = useAuth()
    const navbarContent: navbarItemType[] = []
    navigationsConfig.forEach((navigationConfig) => {
        const UINavbarItem = navigationConfig.settings.layout.navbar.UINavbarItem

        // If the navbar item is hidden, we don't need to push it to the navbarContent.
        if (UINavbarItem?.isHidden) return

        hasAccess(navigationConfig.auth) && navbarContent.push(UINavbarItem)
    })

    useEffect(() => {
        const { pathname } = location
        const isRedirectNeeded = isMaintenanceMode ? pathname !== URL_MAINTENANCE : pathname === URL_MAINTENANCE

        if (isRedirectNeeded) {
            history.replace(isMaintenanceMode ? URL_MAINTENANCE : '/')
        }
    }, [history, location])

    return (
        <Switch>
            {routesConfig.map((route, index) => {
                console.log('route', route)
                return (
                    <Route
                        key={index}
                        path={route.path}
                        exact={true}
                        render={({ location }) => {
                            if (isRouteDisabled(route.settings)) {
                                return <Redirect to="/" />
                            }
                            if (hasAccess(route.auth)) {
                                return (
                                    <ThemingProvider>
                                        {/* Wrap your app inside the ConfirmProvider component. */}
                                        {/* Note: If you're using Material UI ThemeProvider, make sure ConfirmProvider is a child of it. */}
                                        <ConfirmProvider>
                                            <Root>
                                                {isEnergyProviderSubscriptionForm ? (
                                                        <PdlVerificationForm />
                                                ) : (
                                                    <Layout1
                                                        navbarContent={navbarContent}
                                                        displayToolbar={route.settings?.layout?.toolbar?.display}
                                                        displayNavbar={route.settings?.layout?.navbar?.display}
                                                        toolbarContent={<ToolbarContent />}
                                                        toolbarIcon={<ToolbarIcon />}
                                                    >
                                                        {isMaintenanceMode ? (
                                                            <Maintenance />
                                                        ) : (
                                                            <route.component {...route.props} />
                                                        )}
                                                    </Layout1>
                                                )}
                                            </Root>
                                        </ConfirmProvider>
                                    </ThemingProvider>
                                )
                            } else {
                                return (
                                    <Redirect
                                        to={{
                                            pathname: getUrlRedirection(route.auth),
                                            state: { from: location },
                                        }}
                                    />
                                )
                            }
                        }}
                    />
                )
            })}
        </Switch>
    )
}

/**
 * Main application.
 *
 * @returns Main application.
 */
function App() {
    const { user } = useSelector(({ userModel }: RootState) => userModel)
    const isTokenLoadedFromFirebase = useRef(false)

    useEffect(() => {
        // Send the device token to the backend
        if (user && !isTokenLoadedFromFirebase.current) {
            getTokenFromFirebase()
            isTokenLoadedFromFirebase.current = true
        }
    }, [user])

    return <Routes />
}

export default App
