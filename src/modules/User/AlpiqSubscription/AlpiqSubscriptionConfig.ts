import { authTypes } from 'src/common/react-platform-components'
import AlpiqSubscriptionStepper from './AlpiqSubscriptionStepper'
import { IRouteDisabled } from 'src/routes'
import { isAlpiqSubscriptionForm } from 'src/modules/User/AlpiqSubscription/index.d'

const URL_ALPIQ_SUBSCRIPTION_FORM = '/energy-provider-subscription'

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
