import { authTypes, IRoute } from 'src/common/react-platform-components'
import { Redirect } from 'react-router-dom'
import { navbarItemType } from './common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import { MyConsumptionConfig } from './modules/MyConsumption'
import { AdvicesConfig } from './modules/Advices'
import { AnalysisConfig } from './modules/Analysis/AnalysisConfig'
import { LoginConfig } from './modules/User/Login/LoginConfig'
import { ForgotPasswordConfig } from './modules/User/ForgotPassword/ForgotPasswordConfig'
import { ResetPasswordConfig } from 'src/modules/User/ResetPassword/ResetPasswordConfig'
import { RegisterConfig } from './modules/User/Register/RegisterConfig'
import { NrLinkConnectionConfig } from './modules/nrLinkConnection'
import { MyHouseConfig } from './modules/MyHouse'
import { ContractsConfig } from './modules/Contracts/ContractsConfig'
import { ProfileManagementConfig } from './modules/User/ProfileManagement/ProfileManagementConfig'
import { FAQConfig } from './modules/FAQ/FAQConfig'
import { InstallationsRequestsConfig } from 'src/modules/InstallationRequests/InstallationRequestsConfig'
import { EnphaseConfirmStateConfig } from 'src/modules/MyHouse/components/EnphaseConfirmState/EnphaseConfirmStateConfig'
import { MentionsConfig } from 'src/modules/Mentions/MentionsConfig'

/**
 *
 */
export const routes = [
    ...MyConsumptionConfig,
    ...NrLinkConnectionConfig,
    ...AdvicesConfig,
    ...MyHouseConfig,
    ...ContractsConfig,
    ...LoginConfig,
    ...RegisterConfig,
    ...ForgotPasswordConfig,
    ...ResetPasswordConfig,
    ...AnalysisConfig,
    ...ProfileManagementConfig,
    ...FAQConfig,
    ...InstallationsRequestsConfig,
    ...EnphaseConfirmStateConfig,
    ...MentionsConfig,
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
 * Represent custom page settings.
 */
export type IAdditionnalSettings = /**
 */ {
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

/**
 * Represent the routes that are going to be displayed in the navbar, they have a type of IRoute but with UINavbarItem property that is required.
 */
// eslint-lint-disable-next-line jsdoc/require-jsdoc
export type IRouteNavigationConfig<T> = IRoute<T> & /**
 */ {
    /**
     *
     */
    settings: IAdditionnalSettings
}
/**
 * NavigationConfig Represent all the routes that are going to be displayed in the first level of the navbar, they potentially have children which are going to be IRouteNavigationConfig.
 */
// eslint-lint-disable-next-line jsdoc/require-jsdoc
export const navigationsConfig: IRouteNavigationConfig</**
 *
 */
{}>[] = [MyConsumptionConfig[0], AnalysisConfig[0], AdvicesConfig[0], MyHouseConfig[0]]
