import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { MyHouse } from 'src/modules/MyHouse/MyHouse'

/**
 * Url for myHouse.
 */
export const URL_MY_HOUSE = '/my-house/:tab'
/**
 * Interface .
 *
 */
export interface MyHouseProps {
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
 * MyHouseConfig.
 */
export const MyHouseConfig = [
    {
        path: URL_MY_HOUSE,
        component: MyHouse,
        auth: { authType: authTypes.freeAccess },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouse',
                        label: 'Mon Foyer',
                        labelAbbreviation: 'Mon Foyer',
                        type: 'item',
                        iconLabel: 'home',
                        url: URL_MY_HOUSE,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
]
