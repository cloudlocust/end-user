import { BuilderUseElementList } from 'src/modules/utils/useElementHookBuilder'
import { IEcogestTag } from './components/ecogeste'
import { formatMessageType } from 'src/common/react-platform-translation'
import { ECOGESTES_ENDPOINT } from 'src/modules/Ecogestes'

/**
 * Endpoint to get all tags.
 */
export const ECOGESTES_TAGS_ENDPOINT = `${ECOGESTES_ENDPOINT}/tag`

// eslint-disable-next-line jsdoc/require-jsdoc
export const loadElementListError = (error: any, formatMessage: formatMessageType) => {
    return formatMessage({
        id: 'Erreur lors du chargement des poles/pièces',
        defaultMessage: 'Erreur lors du chargement des poles/pièces',
    })
}

/**
 * Hook to interact with the tags.
 *
 * @returns A hook to get the tags.
 */
export const useEcogesteTags = () => {
    const { elementList, loadingInProgress } = BuilderUseElementList<IEcogestTag, IEcogestTag, undefined>({
        API_ENDPOINT: ECOGESTES_TAGS_ENDPOINT,
        snackBarMessage0verride: { loadElementListError },
    })(undefined, {})

    return {
        elementList,
        loadingInProgress,
    }
}

export default useEcogesteTags
