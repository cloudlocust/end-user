import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useAuth } from 'src/modules/User/authentication/useAuth'
import { routes, navigationsConfig } from 'src/routes'
import Layout1 from 'src/common/ui-kit/fuse/layouts/layout1/Layout1'
import ThemingProvider from 'src/common/ui-kit/fuse/components/ThemingProvider'
import { navbarItemType } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import { ToolbarWidget as ToolbarContent } from 'src/modules/Layout'
import { ConfirmProvider } from 'material-ui-confirm'

/**
 * Routes accessible to the app wrapped by access hook.
 *
 * @returns List of routes accessible to the app wrapped by access hook.
 */
const Routes = () => {
    const { hasAccess, getUrlRedirection } = useAuth()
    const navbarContent: navbarItemType[] = []
    navigationsConfig.forEach((navigationConfig) => {
        const UINavbarItem = navigationConfig.settings.layout.navbar.UINavbarItem
        hasAccess(navigationConfig.auth) && navbarContent.push(UINavbarItem)
    })
    return (
        <Switch>
            {routes.map((route, index) => {
                return (
                    <Route
                        key={index}
                        path={route.path}
                        exact={true}
                        render={({ location }) =>
                            hasAccess(route.auth) ? (
                                <ThemingProvider>
                                    {/* Wrap your app inside the ConfirmProvider component. */}
                                    {/* Note: If you're using Material UI ThemeProvider, make sure ConfirmProvider is a child of it. */}
                                    <ConfirmProvider>
                                        <Layout1
                                            navbarContent={navbarContent}
                                            displayToolbar={route.settings?.layout?.toolbar?.display}
                                            displayNavbar={route.settings?.layout?.navbar?.display}
                                            toolbarContent={<ToolbarContent />}
                                        >
                                            <route.component {...route.props} />
                                        </Layout1>
                                    </ConfirmProvider>
                                </ThemingProvider>
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: getUrlRedirection(route.auth),
                                        state: { from: location },
                                    }}
                                />
                            )
                        }
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
    return <Routes />
}

export default App
