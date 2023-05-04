import { authTypes, IRoute } from 'src/common/react-platform-components'
import Error500 from 'src/modules/Errors/Error500'

/**
 * Base Url for Errors.
 */
export const URL_ERRORS = '/errors'

/**
 * Url for Error 500.
 */
export const URL_ERROR_HOUSING = `${URL_ERRORS}/500`

/**
 * ErrorsConfig.
 */
export const ErrorsConfig = [
    {
        path: URL_ERROR_HOUSING,
        component: Error500,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    display: true,
                },
                toolbar: {
                    display: true,
                },
            },
        },
    } as IRoute</**
     *
     */
    {}>,
]
