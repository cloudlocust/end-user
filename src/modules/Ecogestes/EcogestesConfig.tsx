import { authTypes, IRoute } from 'src/common/react-platform-components'
import EcogestListPage from 'src/modules/Ecogestes/components/ecogestesList/ecogestListPage'

/**
 * Url for ecogestes.
 */
export const URL_ECOGESTES = `/ecogestes`

/**
 * Endpoint Configuration for Ecogestes view.
 */
export const EcogestesConfig = [
    {
        path: URL_ECOGESTES,
        component: EcogestListPage,
        auth: { authType: authTypes.loginRequired },
        // eslint-disable-next-line jsdoc/require-jsdoc -- jsdoc is confused.
    } as IRoute<{}>,
]
