import { authTypes, IRoute } from 'src/common/react-platform-components'
import { Onboarding } from 'src/modules/Onboarding'

/**
 * Url for Onboarding.
 */
export const URL_ONBOARDING = '/onboarding'

/**
 * OnboardingConfig routes config.
 */
export const OnboardingConfig = [
    {
        path: URL_ONBOARDING,
        component: Onboarding,
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
        },
    } as IRoute</**
     *
     */
    {}>,
]
