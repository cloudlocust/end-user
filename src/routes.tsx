import { authTypes, IRoute } from 'src/common/react-platform-components'
import { Redirect } from 'react-router-dom'
import { navbarItemType } from './common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import { MyConsumptionConfig } from './modules/MyConsumption'
import { AdvicesConfig } from './modules/Advices'
import { ProfileConfig } from './modules/Profile'
import { CommunityConfig } from './modules/Community'
import { AnalysisConfig } from './modules/Analysis'
import { LoginConfig } from './modules/User/Login/LoginConfig'

/**
 *
 */
export const routes = [
    ...MyConsumptionConfig,
    ...AdvicesConfig,
    ...ProfileConfig,
    ...LoginConfig,
    ...CommunityConfig,
    ...AnalysisConfig,
    {
        /**
         * TODO Document.
         *
         * @returns TODO Document.
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        // eslint-disable-next-line react/display-name
        component: (): JSX.Element => <Redirect to="/my-consumption" />,
        path: '/',
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
]

/**
 * Represent the routes that are going to be displayed in the navbar, they have a type of IRoute but with UINavbarItem property that is required.
 */
// eslint-lint-disable-next-line jsdoc/require-jsdoc
export type IRouteNavigationConfig<T> = IRoute<T> & /**
 *
 */ {
    /**
     *
     */
    settings: /**
     *
     */
    {
        /**
         *
         */
        layout: // eslint-lint-disable-next-line jsdoc/require-jsdoc
        /**
         *
         */
        {
            // eslint-lint-disable-next-line jsdoc/require-jsdoc
            /**
             *
             */
            navbar: /**
             *
             */
            {
                /**
                 *
                 */
                UINavbarItem: navbarItemType
            }
        }
    }
}

/**
 * NavigationConfig Represent all the routes that are going to be displayed in the first level of the navbar, they potentially have children which are going to be IRouteNavigationConfig.
 */
// eslint-lint-disable-next-line jsdoc/require-jsdoc
export const navigationsConfig: IRouteNavigationConfig</**
 *
 */
{}>[] = [MyConsumptionConfig[0], AnalysisConfig[0], AdvicesConfig[0], CommunityConfig[0], ProfileConfig[0]]
