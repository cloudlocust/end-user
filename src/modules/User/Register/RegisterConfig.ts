import { authTypes, IRoute } from 'src/common/react-platform-components'
import { RegisterEnergyProviderSuccess } from 'src/modules/User/Register/containers/RegisterEnergyProviderSuccess'
import { IRouteDisabled } from 'src/routes'
import Register, { RegisterProps } from './Register'

/**
 * Register route.
 */
export const URL_REGISTER = '/register'

/**
 * Register energy provider success route.
 */
export const URL_REGISTER_ENERGY_PROVIDER_SUCCESS = '/register-energy-provider-success'

/**
 * User registration state.
 *
 */
export const userRegistrationFeatureState = window._env_.REACT_APP_USER_REGISTRATION_FEATURE_STATE === 'disabled'

/**
 * Popup after registration state.
 */
export const isPopupAfterRegistration = window._env_.REACT_APP_POPUP_AFTER_REGISTRATION === 'enabled'

/**
 * Energy provider popup link.
 */
export const energyProviderPopupLink = window._env_.REACT_APP_ENERGY_PROVIDER_POPUP_LINK

/**
 * Register energy provider success message.
 */
export const energyProviderRegisterSuccessMessage = window._env_.REACT_APP_ENERGY_PROVIDER_REGISTER_SUCCESS_MESSAGE

/**
 * Professional register feature.
 */
export const isProfessionalRegisterFeature = window._env_.REACT_APP_PROFESSIONAL_REGISTER_FEATURE === 'enabled'

/**
 * Configuration object for the register page. It contains, url, component and its props, and authentication level needed.
 */
export const RegisterConfig = [
    {
        path: URL_REGISTER,
        component: Register,
        auth: { authType: authTypes.anonymousRequired },
        settings: {
            layout: {
                navbar: {
                    display: false,
                },
                toolbar: {
                    display: false,
                },
            },
            disabled: userRegistrationFeatureState,
        },
    } as IRouteDisabled<RegisterProps>,
    {
        path: URL_REGISTER_ENERGY_PROVIDER_SUCCESS,
        component: RegisterEnergyProviderSuccess,
        auth: { authType: authTypes.anonymousRequired },
        settings: {
            layout: {
                navbar: {
                    display: false,
                },
                toolbar: {
                    display: false,
                },
            },
            disabled: !isPopupAfterRegistration,
        },
    } as IRoute</**
     *
     */
    {}>,
]
