import { useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { API_RESOURCES_URL } from 'src/configs'
import { IFaq } from 'src/modules/FAQ/FAQHook/FAQhook.d'
/**
 * Accomodation url.
 *
 * @returns Meters base url.
 */
export const FAQ_API = `${API_RESOURCES_URL}/faq`

/**
 * Hooks for FAQ.
 *
 * @returns UseFAQ.
 */
export function useFAQ() {
    const [dataFAQ, setDataFAQ] = useState<IFaq>()
    const { enqueueSnackbar } = useSnackbar()
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)
    const { formatMessage } = useIntl()

    /**
     * Function hook responsible for  the function responsible for fetching Accomodation.
     *
     * @returns The function throw an error, and show snackbar message containing successful and errors message.
     */
    const loadFAQ = async () => {
        setIsLoadingInProgress(true)
        try {
            const { data: responseData } = await axios.get<IFaq>(FAQ_API)
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
    }

    return {
        isLoadingInProgress,
        dataFAQ,
        loadFAQ,
    }
}
