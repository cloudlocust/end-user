import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { Advices } from './Advices'
import { ReactComponent as AdvicesIcon } from 'src/assets/images/navbarItems/advice.svg'
import { ReactComponent as AdvicesSelectedIcon } from 'src/assets/images/navbarItems/advice-selected.svg'
import SvgIcon from '@mui/material/SvgIcon'

/**
 * Url for advices.
 */
export const URL_ADVICES = '/advices'

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
                        selectedIcon: (
                            <SvgIcon>
                                <AdvicesSelectedIcon />
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
