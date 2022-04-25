import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { routes, navigationsConfig } from 'src/routes'
import Layout1 from 'src/common/ui-kit/fuse/layouts/layout1/Layout1'
import ThemingProvider from 'src/common/ui-kit/fuse/components/ThemingProvider'
import { navbarItemType } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import { ToolbarWidget as ToolbarContent } from 'src/modules/Layout'

/**
 * Routes accessible to the app wrapped by access hook.
 *
 * @returns List of routes accessible to the app wrapped by access hook.
 */
const Routes = () => {
    const navbarContent: navbarItemType[] = []
    navigationsConfig.forEach((navigationConfig) => {
        const UINavbarItem = navigationConfig.settings.layout.navbar.UINavbarItem
        // hasAccess(navigationConfig.auth) &&
        navbarContent.push(UINavbarItem)
    })
    return (
        <Switch>
            {routes.map((route, index) => {
                return (
                    <Route
                        key={index}
                        path={route.path}
                        exact={true}
                        render={() => (
                            <ThemingProvider>
                                <Layout1
                                    navbarContent={navbarContent}
                                    displayToolbar={route.settings?.layout?.toolbar?.display}
                                    displayNavbar={route.settings?.layout?.navbar?.display}
                                    toolbarContent={<ToolbarContent />}
                                >
                                    <route.component {...route.props} />
                                </Layout1>
                            </ThemingProvider>
                        )}
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
