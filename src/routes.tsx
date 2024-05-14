import { authTypes, IPageSettings, IRoute } from 'src/common/react-platform-components'
import { Redirect } from 'react-router-dom'
import { navbarItemType } from './common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import { MyConsumptionConfig } from './modules/MyConsumption'
import { AdvicesConfig } from './modules/Advices'
import { LoginConfig } from './modules/User/Login/LoginConfig'
import { ForgotPasswordConfig } from './modules/User/ForgotPassword/ForgotPasswordConfig'
import { ResetPasswordConfig } from 'src/modules/User/ResetPassword/ResetPasswordConfig'
import { RegisterConfig } from './modules/User/Register/RegisterConfig'
import { NrLinkConnectionConfig } from './modules/nrLinkConnection'
import { MyHouseConfig } from './modules/MyHouse'
import { ContractsConfig } from './modules/Contracts/ContractsConfig'
import { ProfileManagementConfig } from './modules/User/ProfileManagement/ProfileManagementConfig'
import { InstallationsRequestsConfig } from 'src/modules/InstallationRequests/InstallationRequestsConfig'
import { EnphaseConfirmStateConfig } from 'src/modules/MyHouse/components/EnphaseConfirmState/EnphaseConfirmStateConfig'
import { MentionsConfig } from 'src/modules/Mentions/MentionsConfig'
import { SetPasswordConfig } from 'src/modules/User/SetPassword/SetPasswordConfig'
import { SolarEquipmentsConfig } from 'src/modules/SolarEquipments/solarEquipmentsConfig'
import { ErrorsConfig } from 'src/modules/Errors/ErrorsConfig'
import { EcogestesConfig } from 'src/modules/Ecogestes/EcogestesConfig'
import { AlertsConfig } from 'src/modules/Alerts/AlertsConfig'
import { DashboardConfig, URL_DASHBOARD } from 'src/modules/Dashboard/DashboardConfig'
import { SolarSizingConfig } from 'src/modules/SolarSizing/SolarSizingConfig'
import { AlpiqSubscriptionConfig } from './modules/User/AlpiqSubscription/AlpiqSubscriptionConfig'
import { MyContractNrLinkInfoConfig } from 'src/modules/MyContractNrLinkInfo/MyContractNrLinkInfoConfig'

/**
 *
 */
export const routes = [
    ...DashboardConfig,
    ...MyConsumptionConfig,
    ...NrLinkConnectionConfig,
    ...AdvicesConfig,
    ...MyHouseConfig,
    ...ContractsConfig,
    ...LoginConfig,
    ...RegisterConfig,
    ...ForgotPasswordConfig,
    ...ResetPasswordConfig,
    ...SetPasswordConfig,
    ...ProfileManagementConfig,
    ...InstallationsRequestsConfig,
    ...EnphaseConfirmStateConfig,
    ...MentionsConfig,
    ...SolarEquipmentsConfig,
    ...ErrorsConfig,
    ...EcogestesConfig,
    ...AlertsConfig,
    ...AlpiqSubscriptionConfig,
    ...SolarSizingConfig,
    ...MyContractNrLinkInfoConfig,
    {
        /**
         * TODO Document.
         *
         * @returns TODO Document.
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        // eslint-disable-next-line react/display-name
        component: (): JSX.Element => <Redirect to={URL_DASHBOARD} />,
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

// TODO Type better in IRoute and update IPageSettings
/**
 * Represent the route with disabled boolean setting for redirecting when its true.
 */
// eslint-lint-disable-next-line jsdoc/require-jsdoc
export type IRouteDisabled<T> = IRoute<T> & /**
 */ {
    /**
     *
     */
    // eslint-lint-disable-next-line jsdoc/require-jsdoc
    settings: IPageSettingsDisabled
}

/**
 * Type of IPageSettings with disabled field.
 */
export type IPageSettingsDisabled = IPageSettings & /**
 *
 */ {
    /**
     * Indicate if the route is disabled.
     */
    disabled: boolean
}

/**
 * NavigationConfig Represent all the routes that are going to be displayed in the first level of the navbar, they potentially have children which are going to be IRouteNavigationConfig.
 */
// eslint-lint-disable-next-line jsdoc/require-jsdoc
export const navigationsConfig: IRouteNavigationConfig</**
 *
 */
{}>[] = [DashboardConfig[0], MyConsumptionConfig[0], AdvicesConfig[0], MyHouseConfig[0]]
