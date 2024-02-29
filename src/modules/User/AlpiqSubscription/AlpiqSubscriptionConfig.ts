import { authTypes } from 'src/common/react-platform-components'
import AlpiqSubscriptionStepper from './AlpiqSubscriptionStepper'
import { IRouteDisabled } from 'src/routes'

const URL_ALPIQ_SUBSCRIPTION_FORM = '/energy-provider-subscription'

/**
 * Indicate if when we first connect, we should show the form to enter the PDL before the popup registration.
 */
export const isAlpiqSubscriptionForm = window._env_.REACT_APP_ALPIQ_SUBSCRIPTION_FORM_STATE === 'enabled'

const AlpiqSubscriptionConfig = [
    {
        path: URL_ALPIQ_SUBSCRIPTION_FORM,
        component: AlpiqSubscriptionStepper,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                toolbar: {
                    display: false,
                },
                navbar: {
                    display: false,
                    UINavbarItem: {},
                },
            },
            disabled: !isAlpiqSubscriptionForm,
        },
        disable: !isAlpiqSubscriptionForm,
        //eslint-disable-next-line
    } as IRouteDisabled<{}>,
]

export { AlpiqSubscriptionConfig, URL_ALPIQ_SUBSCRIPTION_FORM }
