import { authTypes, IRoute } from 'src/common/react-platform-components'
import EcogestListPage from 'src/modules/Ecogestes/components/ecogestesList/ecogestListPage'

/**
 * Url for ecogestes.
 */
export const URL_ECOGESTES = `/ecogestes`

/**
 * Get all the sstags.
 */
export const URL_ECOGESTES_TAGS = `${URL_ECOGESTES}/tags`

/**
 * Get only one of the tags, and see its ecogestes.
 */
export const URL_ECOGESTES_TAGS_DETAILS = `${URL_ECOGESTES_TAGS}/:tagId`

/**
 * Endpoint Configuration for Ecogestes view.
 */
export const EcogestesConfig = [
    {
        path: URL_ECOGESTES_TAGS,
        component: EcogestListPage,
        auth: { authType: authTypes.loginRequired },
        // eslint-disable-next-line jsdoc/require-jsdoc -- jsdoc is confused.
    } as IRoute<{}>,
    {
        path: URL_ECOGESTES_TAGS_DETAILS,
        component: EcogestListPage,
        auth: { authType: authTypes.loginRequired },
        // eslint-disable-next-line jsdoc/require-jsdoc -- jsdoc is confused.
    } as IRoute<{}>,
]
