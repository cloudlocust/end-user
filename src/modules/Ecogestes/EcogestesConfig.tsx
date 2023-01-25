import { authTypes } from 'src/common/react-platform-components'
import { IRouteNavigationConfig } from 'src/routes'
import { URL_ADVICES } from 'src/modules/Advices'
import { advicesFeatureState, AdvicesProps } from 'src/modules/Advices/AdvicesConfig'
import { EcogestesList } from 'src/modules/Ecogestes'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as AdvicesIcon } from 'src/assets/images/navbarItems/Advices.svg'

/**
 * Url for ecogestes.
 */
export const URL_ECOGESTES = `/ecogestes`

/**
 * Url for ecogestes by category.
 */
export const URL_ECOGESTES_BY_CATEGORY = `${URL_ECOGESTES}/by-category/:categoryId`

/**
 * Endpoint Configuration for Ecogestes view.
 */
export const EcogestesConfig = [
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
