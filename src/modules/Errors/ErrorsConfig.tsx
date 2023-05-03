import { authTypes, IRoute } from 'src/common/react-platform-components'
import ErrorHousing from 'src/modules/Errors/ErrorHousing'

/**
 * Base Url for Errors.
 */
export const URL_ERRORS = '/errors'

/**
 * Url for Error 500.
 */
export const URL_ERROR_HOUSING = `${URL_ERRORS}/housing`

/**
 * ErrorsConfig.
 */
export const ErrorsConfig = [
    {
        path: URL_ERROR_HOUSING,
        component: ErrorHousing,
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
