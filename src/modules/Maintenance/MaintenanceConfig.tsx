import { authTypes, IRoute } from 'src/common/react-platform-components'
import { MaintenancePage } from 'src/modules/Maintenance/Maintenance'

/**
 * Base Url for Errors.
 */
export const URL_MAINTENANCE = '/maintenance'

/**
 * ErrorsConfig.
 */
export const MaintenanceConfig = [
    {
        path: URL_MAINTENANCE,
        component: MaintenancePage,
        auth: { authType: authTypes.freeAccess },
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
