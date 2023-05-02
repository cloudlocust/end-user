import { authTypes, IRoute } from 'src/common/react-platform-components'
import { EcogestesList } from '.'
import EcogestListPage from './components/ecogestesList/ecogestListPage'

/**
 * Enum listing all Ecogestes Category Type.
 */
export enum IEcogesteCategoryTypes {
    /**
     * Poles de consommations (par default).
     */
    CONSUMPTION = 'consumptions',
    /**
     * Pieces.
     */
    ROOMS = 'rooms',
}

/**
 * Root URL of the Ecogeste Module.
 */
export const URL_ROOT_ECOGESTES = `/advices`

/**
 * URL to get Ecogestes related to Poles of Consumptions.
 */
export const URL_CONSUMPTION_ECOGESTES = `${URL_ROOT_ECOGESTES}/consumptions/:categoryId`

/**
 * URL to get Ecogestes related to Rooms.
 */
export const URL_ROOMS_ECOGESTES = `${URL_ROOT_ECOGESTES}/rooms/:categoryId`

/**
 * Endpoint Configuration for Ecogestes view.
 */
export const EcogestesConfig = [
    {
        path: URL_CONSUMPTION_ECOGESTES,
        component: EcogestListPage,
        auth: { authType: authTypes.loginRequired },
        // eslint-disable-next-line jsdoc/require-jsdoc -- jsdoc is confused.
    } as IRoute<{}>,
    {
        path: URL_ROOMS_ECOGESTES,
        component: EcogestesList,
        auth: { authType: authTypes.loginRequired },
        /**
         * We pass props only when we're using Rooms cause as default we use Poles of Consumption.
         */
        props: {
            categoryType: IEcogesteCategoryTypes.ROOMS,
        },
        // eslint-disable-next-line jsdoc/require-jsdoc -- jsdoc is confused.
    } as IRoute<{}>,
]
