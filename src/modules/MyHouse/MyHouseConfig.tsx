import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { MyHouse } from 'src/modules/MyHouse/MyHouse'
import { MyHouseDetails } from 'src/modules/MyHouse/components/MyHouseDetails'

/**
 * Url for myHouse.
 */
export const URL_MY_HOUSE = '/my-houses'
const URL_MY_HOUSE_DETAILS = URL_MY_HOUSE + '/:id'
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
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouses',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        iconLabel: 'home',
                        url: URL_MY_HOUSE,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_MY_HOUSE_DETAILS,
        component: MyHouseDetails,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouses',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        iconLabel: 'home',
                        url: URL_MY_HOUSE_DETAILS,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
]
