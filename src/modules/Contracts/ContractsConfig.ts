import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import Contracts from 'src/modules/Contracts'
import { URL_MY_HOUSE_DETAILS } from 'src/modules/MyHouse/MyHouseConfig'

/**
 * Url for contracts.
 */
export const URL_CONTRACTS = URL_MY_HOUSE_DETAILS + '/contracts'

/**
 * State in which we enable or not "other providers" & "other offers".
 */
export const isActivateOtherOffersAndProviders =
    window._env_.REACT_APP_ACTIVATE_CONTRACT_OTHER_PROVIDERS_AND_OFFERS === 'enabled'

/**
 * Interface .
 *
 */
export interface MyContractsProps {
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
 * ContractsConfig.
 */
export const ContractsConfig = [
    {
        path: URL_CONTRACTS,
        component: Contracts,
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
                        url: URL_CONTRACTS,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyContractsProps>,
]
