import { useCallback, useState } from 'react'
import { IEnedisConsent, INrlinkConsent } from 'src/modules/Consents/Consents'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'

/**
 * Nrlink consent endpoint.
 */
export const NRLINK_CONSENT_API = `${API_RESOURCES_URL}/nrlink/consent`

/**
 * Nrlink consent endpoint.
 */
export const ENEDIS_CONSENT_API = `${API_RESOURCES_URL}/enedis/consent`

/**
 * Consents hook.
 *
 * @returns Consents hook.
 */
export function useConsents() {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [consentsLoading, setConsentsLoading] = useState(false)
    const [nrlinkConsent, setNrlinkConsent] = useState<INrlinkConsent>()
    const [enedisConsent, setEnedisConsent] = useState<IEnedisConsent>()
    const [isMeterVerified, setIsMeterVerified] = useState<boolean>(false)
    const [isMeterVerifyLoading, setIsMeterVerifyLoading] = useState(false)

    /**
     * Function that performs HTTP call to get consents.
     *
     * @param meterGuid MeterGuid.
     */
    const getConsents = useCallback(
        async (meterGuid: string) => {
            setConsentsLoading(true)
            if (!meterGuid) return
            // Used Promise.allSettled() instead of Promise.all to return a promise that resolves after all of the given requests have either been fulfilled or rejected.
            // Because Promise.all() throws only when the first promise is rejected and it returns only that rejection.
            // If the promise status is "fulfilled" it returns "value"
            // If it's "rejetected" it returns "reason"
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
            const [nrlinkConsent, enedisConsent] = await Promise.allSettled([
                axios.get<INrlinkConsent>(`${NRLINK_CONSENT_API}/${meterGuid}`),
                axios.get<IEnedisConsent>(`${ENEDIS_CONSENT_API}/${meterGuid}`),
            ])
            // Nrlink consent.
            if (nrlinkConsent.status === 'fulfilled') {
                setNrlinkConsent(nrlinkConsent.value?.data)
            } else if (nrlinkConsent.status === 'rejected') {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la récupération du consentement Nrlink',
                        defaultMessage: 'Erreur lors de la récupération du consentement Nrlink',
                    }),
                    {
                        variant: 'error',
                        autoHideDuration: 5000,
                    },
                )
            }
            // Enedis consent.
            if (enedisConsent.status === 'fulfilled') {
                setEnedisConsent(enedisConsent.value?.data)
            } else if (enedisConsent.status === 'rejected') {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la récupération du consentement Enedis',
                        defaultMessage: 'Erreur lors de la récupération du consentement Enedis',
                    }),
                    {
                        variant: 'error',
                        autoHideDuration: 5000,
                    },
                )
            }
            setConsentsLoading(false)
        },
        [enqueueSnackbar, formatMessage],
    )

    /**
     * Function that performs API call that verify meter.
     *
     * @param housingId Housing id.
     * @returns Whether meter is verified or not.
     */
    const verifyMeter = useCallback(
        async (houseId: string) => {
            const housingId = parseInt(houseId)
            if (!housingId) return
            try {
                setIsMeterVerifyLoading(true)
                const response = await axios.get(`${API_RESOURCES_URL}/enedis-sge/consent/${housingId}/check`)
                if (response.status === 200) setIsMeterVerified(true)
                else setIsMeterVerified(false)
                setIsMeterVerifyLoading(false)
            } catch (error) {
                setIsMeterVerifyLoading(false)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la vérification de votre compteur',
                        defaultMessage: 'Erreur lors de la vérification de votre compteur',
                    }),
                    {
                        variant: 'error',
                        autoHideDuration: 5000,
                    },
                )
            }
        },
        [enqueueSnackbar, formatMessage],
    )

    return {
        nrlinkConsent,
        enedisConsent,
        consentsLoading,
        getConsents,
        verifyMeter,
        isMeterVerified,
        setIsMeterVerifyLoading,
        isMeterVerifyLoading,
        setIsMeterVerified,
    }
}
