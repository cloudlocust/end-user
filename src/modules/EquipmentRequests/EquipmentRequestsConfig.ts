import { authTypes } from 'src/common/react-platform-components'
import { EquipmentRequests } from 'src/modules/EquipmentRequests/'
import { IRouteNavigationConfig } from 'src/routes'

/**
 *
 */
export interface EquipmentRequestsConfigProps {
    /**
     * Logo to dislay.
     */
    logo?: // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Url of the logo.
         */
        url: string
    }
}

const URL_EQUIPMENT_REQUESTS = '/equipment-requests'

const EquipmentRequestsConfig = [
    {
        path: URL_EQUIPMENT_REQUESTS,
        component: EquipmentRequests,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {},
                },
            },
        },
    } as IRouteNavigationConfig<EquipmentRequestsConfigProps>,
]

export { EquipmentRequestsConfig, URL_EQUIPMENT_REQUESTS }
