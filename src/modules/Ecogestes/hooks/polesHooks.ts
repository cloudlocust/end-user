import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { formatMessageType } from 'src/common/react-platform-translation'
import { ECOGESTES_ENDPOINT } from 'src/modules/Ecogestes'

/**
 * API Endpoint to get all Poles of Consumption available.
 */
export const ECOGESTES_POLES_ENDPOINT = `${ECOGESTES_ENDPOINT}/consumptions`

// eslint-disable-next-line jsdoc/require-jsdoc
export const loadElementListError = (_error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des poles de consomations',
        defaultMessage: 'Erreur lors du chargement des poles de consomations',
    })
}

/**
 * Hook used to fetch all Poles of Consumptions.
 *
 * @returns A hook to get Ecogeste Poles of Consumptions.
 */
export const useEcogestePoles = () => {
    const { elementList, loadingInProgress } = BuilderUseElementList<IEcogestCategory, IEcogestCategory, undefined>({
        API_ENDPOINT: ECOGESTES_POLES_ENDPOINT,
        snackBarMessage0verride: { loadElementListError },
    })(undefined, {})

    return {
        elementList,
        loadingInProgress,
    }
}

export default useEcogestePoles
