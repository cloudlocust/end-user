import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { MyConsumption } from './MyConsumption'

/**
 * Url for my-consumption.
 */
export const URL_CONSUMPTION = '/my-consumption'
/**
 * Interface .
 *
 */
export interface MyConsumptionProps {
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
/**
 * MyConsumptionConfig.
 */
export const MyConsumptionConfig = [
    {
        path: URL_CONSUMPTION,
        component: MyConsumption,
        auth: { authType: authTypes.anonymousRequired }, // TODO CHANGE
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'my_consumption',
                        label: 'Ma Conso',
                        labelAbbreviation: 'Ma Conso',
                        type: 'item',
                        iconLabel: 'home',
                        url: URL_CONSUMPTION,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyConsumptionProps>,
]
