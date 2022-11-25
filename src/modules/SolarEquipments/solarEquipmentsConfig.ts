import { authTypes } from 'src/common/react-platform-components'
import { SolarEquipments } from 'src/modules/SolarEquipments'
import { IRouteNavigationConfig } from 'src/routes'

/**
 *
 */
export interface SolarEquipmentsProps {
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

const URL_SOLAR_EQUIPMENTS = '/solar-equipments'

/**
 * Env var for equipment feature state.
 */
export const equipmentFeatureState = window._env_.REACT_APP_SOLAR_EQUIPMENTS_FEATURE_STATE === 'enabled'

const SolarEquipmentsConfig = [
    {
        path: URL_SOLAR_EQUIPMENTS,
        component: SolarEquipments,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {},
                },
            },
        },
    } as IRouteNavigationConfig<SolarEquipmentsProps>,
]

export { SolarEquipmentsConfig, URL_SOLAR_EQUIPMENTS }
