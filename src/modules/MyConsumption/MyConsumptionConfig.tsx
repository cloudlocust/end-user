import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { MyConsumption } from './MyConsumption'
import { ReactComponent as MyConsumptionIcon } from 'src/assets/images/navbarItems/my-consumption.svg'
import { ReactComponent as MyConsumptionSelectedIcon } from 'src/assets/images/navbarItems/my-consumption-selected.svg'
import SvgIcon from '@mui/material/SvgIcon'
import LablizationContainer from './components/LabelizationContainer'

/**
 * Url for my-consumption.
 */
export const URL_CONSUMPTION = '/my-consumption'

/**
 * Url for my consumption labelization.
 */
export const URL_CONSUMPTION_LABELIZATION = `${URL_CONSUMPTION}/labelization`

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
 * Production chart error state.
 */
export const productionChartErrorState = window._env_.REACT_APP_PRODUCTION_CHART_ERROR_STATE === 'enabled'

/**
 * MyConsumptionConfig.
 */
export const MyConsumptionConfig = [
    {
        path: URL_CONSUMPTION,
        component: MyConsumption,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'my_consumption',
                        label: 'Ma Conso',
                        labelAbbreviation: 'Ma Conso',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <MyConsumptionIcon />
                            </SvgIcon>
                        ),
                        selectedIcon: (
                            <SvgIcon>
                                <MyConsumptionSelectedIcon />
                            </SvgIcon>
                        ),
                        url: URL_CONSUMPTION,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyConsumptionProps>,
    {
        path: URL_CONSUMPTION_LABELIZATION,
        component: LablizationContainer,
        auth: { authType: authTypes.loginRequired },
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'my_consumption',
                        label: 'Ma Conso',
                        labelAbbreviation: 'Ma Conso',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <MyConsumptionIcon />
                            </SvgIcon>
                        ),
                        selectedIcon: (
                            <SvgIcon>
                                <MyConsumptionSelectedIcon />
                            </SvgIcon>
                        ),
                        url: URL_CONSUMPTION,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<MyConsumptionProps>,
]
