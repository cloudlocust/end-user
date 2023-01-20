import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { Advices } from './Advices'
import { ReactComponent as AdvicesIcon } from 'src/assets/images/navbarItems/Advices.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { EcogestesList } from 'src/modules/Ecogestes'

/**
 * Url for advices.
 */
export const URL_ADVICES = '/advices'

/**
 * Url for ecogestes.
 */
export const URL_ECOGESTES = `/ecogestes`

/**
 * Url for ecogestes by category.
 */
export const URL_ECOGESTES_BY_CATEGORY = `${URL_ECOGESTES}/byCategory/:categoryId`

/**
 * Interface .
 *
 */
export interface AdvicesProps {
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
 * Env Variable to know if the feature is enabled.
 */
export const advicesFeatureState = window._env_.REACT_APP_ADVICES_FEATURE_STATE === 'disabled'

/**
 * AdvicesConfig.
 */
export const AdvicesConfig = [
    {
        path: URL_ADVICES,
        component: Advices,
        auth: { authType: authTypes.freeAccess }, // TODO CHANGE
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'Conseils',
                        label: 'Conseils',
                        labelAbbreviation: 'Conseils',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <AdvicesIcon />
                            </SvgIcon>
                        ),
                        disabled: advicesFeatureState,
                        url: URL_ADVICES,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<AdvicesProps>,
    {
        path: URL_ECOGESTES_BY_CATEGORY,
        component: EcogestesList,
        auth: { authType: authTypes.freeAccess }, //TODO: CHANGE
        settings: {
            layout: {
                navbar: {
                    UINavbarItem: {
                        id: 'Conseils',
                        label: 'Conseils',
                        labelAbbreviation: 'Conseils',
                        type: 'item',
                        icon: (
                            <SvgIcon>
                                <AdvicesIcon />
                            </SvgIcon>
                        ),
                        disabled: advicesFeatureState,
                        url: URL_ADVICES,
                    },
                },
            },
        },
    } as IRouteNavigationConfig<AdvicesProps>,
]
