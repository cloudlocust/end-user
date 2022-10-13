import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { MyHouse } from 'src/modules/MyHouse/MyHouse'
import { HousingDetails } from 'src/modules/MyHouse/components/HousingDetails'
import Equipments from 'src/modules/MyHouse/components/Equipments'
import Accomodation from 'src/modules/MyHouse/components/Accomodation'
import { ReactComponent as HousingIcon } from 'src/assets/images/navbarItems/Housings.svg'
import SvgIcon from '@mui/material/SvgIcon'

/**
 * Url for myHouse.
 */
export const URL_MY_HOUSE = '/my-houses'
/**
 * Url for myHouse Details.
 */
export const URL_MY_HOUSE_DETAILS = URL_MY_HOUSE + '/:houseId'
/**
 * Url for housing equipments.
 */
export const URL_HOUSING_EQUIPMENTS = `${URL_MY_HOUSE_DETAILS}/equipments`
/**
 * Url for housing accomodation.
 */
export const URL_HOUSING_ACCOMODATION = `${URL_MY_HOUSE_DETAILS}/accomodation`

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
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        url: URL_MY_HOUSE,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_MY_HOUSE_DETAILS,
        component: HousingDetails,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouses',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        url: URL_MY_HOUSE_DETAILS,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_HOUSING_EQUIPMENTS,
        component: Equipments,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouses',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        url: URL_HOUSING_EQUIPMENTS,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
    {
        path: URL_HOUSING_ACCOMODATION,
        component: Accomodation,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'myHouses',
                        label: 'Logement',
                        labelAbbreviation: 'Logement',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <HousingIcon />
                            </SvgIcon>
                        ),
                        url: URL_HOUSING_ACCOMODATION,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyHouseProps>,
]
