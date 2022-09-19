import { useCallback, useEffect, useRef, useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { API_RESOURCES_URL } from 'src/configs'
import { IFaq } from 'src/modules/FAQ/FAQHook/FAQhook.d'
/**
 * FAQ url.

 */
export const FAQ_API = `${API_RESOURCES_URL}/faq`

/**
 * Hooks for FAQ.
 *
 * @returns UseFAQ.
 */
export function useFAQ() {
    const [dataFAQ, setDataFAQ] = useState<IFaq[]>()
    const { enqueueSnackbar } = useSnackbar()
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)
    const { formatMessage } = useIntl()
    const isInitialMount = useRef(true)
    /**
     * Function to get FAQ data.
     *
     * @returns FAQ data.
     */
    const loadFAQ = useCallback(async () => {
        setIsLoadingInProgress(true)
        try {
            const { data: responseData } = await axios.get<IFaq[]>(FAQ_API)
            setDataFAQ(responseData)
            setIsLoadingInProgress(false)
        } catch (error: any) {
            enqueueSnackbar(
                formatMessage({
                    id: error.response.data.detail,
                    defaultMessage: error.response.data.detail,
                }),
                { variant: 'error' },
            )
            setIsLoadingInProgress(false)
        }
    }, [enqueueSnackbar, formatMessage])
    // UseEffect executes on initial intantiation of FAQ.
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            loadFAQ()
        }
    }, [loadFAQ])

    return {
        isLoadingInProgress,
        dataFAQ,
    }
}
