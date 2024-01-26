import { authTypes, IRoute } from 'src/common/react-platform-components'
import PdlVerificationForm from './PdlVerificationForm'

const URL_ENERGY_PROVIDER_SUBSCRIPTION_FORM = '/energy-provider-subscription'

/**
 * Indicate if when we first connect, we should show the form to enter the PDL before the popup registration.
 */
export const isEnergyProviderSubscriptionForm =
    window._env_.REACT_APP_ENERGY_PROVIDER_SUBSCRIPTION_FORM_STATE === 'enabled'

const EnergyProviderSubscriptionConfig = [
    {
        path: URL_ENERGY_PROVIDER_SUBSCRIPTION_FORM,
        component: PdlVerificationForm,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    display: false,
                },
                toolbar: {
                    display: false,
                },
            },
            disable: !isEnergyProviderSubscriptionForm,
        },
    } as IRoute</**
     *
     */
    {}>,
]

export { EnergyProviderSubscriptionConfig, URL_ENERGY_PROVIDER_SUBSCRIPTION_FORM }
