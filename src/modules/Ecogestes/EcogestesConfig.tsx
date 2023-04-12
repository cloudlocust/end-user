import { authTypes, IRoute } from 'src/common/react-platform-components'
import EcogestListPage from 'src/modules/Ecogestes/components/ecogestesList/ecogestListPage'
import { Advices, URL_ADVICES } from '../Advices'

/**
 * Url for ecogestes.
 */
export const URL_ECOGESTES = URL_ADVICES + `/ecogestes`

/**
 * Get all the tags.
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
        path: '/advices/:selectedItem',
        component: Advices,
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

/**
 * PillSwitcherComponent Configuration for Ecogestes.
 */
export const EcogestePillSwitcherProps = {
    actualRoute: '/advices',
    defaultComponent: {
        btnText: 'Postes de conso',
    },
    otherComponent: {
        btnText: 'Pièces',
        paramKey: 'rooms',
    },
}
/**
 * Enum listing all Ecogestes Categories.
 */
export enum IEcogesteCategoryTypes {
    /**
     * Poles de consommations (par default).
     */
    CONSUMPTION = 'consumption',
    /**
     * Pieces.
     */
    ROOMS = 'rooms',
}
