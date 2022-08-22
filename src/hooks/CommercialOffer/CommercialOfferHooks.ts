import { useEffect, useState, useCallback, useRef } from 'react'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { API_RESOURCES_URL } from 'src/configs'
import { ICommercialOffer } from './CommercialOffers.d'

// Commercial Offers API
// eslint-disable-next-line jsdoc/require-jsdoc
export const COMMERCIAL_OFFERS_API = `${API_RESOURCES_URL}/commercial_offer`

/**
`* Hooks for commercialOffer.
 *
 * @returns Hook useCommercialOffer.
 */
export const useCommercialOffer = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const isInitialMount = useRef(true)
    const [loadingCommercialInProgress, setLoadingCommercialInProgress] = useState(false)
    const [commercialOffer, setCommercialOffer] = useState<ICommercialOffer | null>(null)

    /**
     * Fetching Commercial offers function.
     */
    const loadCommercialOffer = useCallback(async () => {
        setLoadingCommercialInProgress(true)
        try {
            const { data: responseData } = await axios.get<ICommercialOffer>(COMMERCIAL_OFFERS_API)
            setCommercialOffer(responseData)
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors du chargement des offres commerciales',
                    defaultMessage: 'Erreur lors du chargement des offres commerciales',
                }),
                { variant: 'error' },
            )
        }
        setLoadingCommercialInProgress(false)
    }, [formatMessage, enqueueSnackbar])

    // UseEffect executes on initial intantiation of useCommercialOffer, responsible for loadCommercialOffer on initialLoad.
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            loadCommercialOffer()
        }
    }, [loadCommercialOffer])

    return {
        loadingCommercialInProgress,
        commercialOffer,
    }
}
