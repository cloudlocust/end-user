import { useCallback, useState } from 'react'
import {
    IEnedisConsent,
    IEnedisSgeConsent,
    IEnphaseConsent,
    INrlinkConsent,
    MeterVerificationEnum,
} from 'src/modules/Consents/Consents.d'
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
 * Enedis Sge consent endpoint.
 */
export const ENEDIS_SGE_CONSENT_API = `${API_RESOURCES_URL}/enedis-sge/consent`

/**
 * Enphase consent endpoint.
 */
export const ENPHASE_CONSENT_API = `${API_RESOURCES_URL}/enphase/consent`

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
    const [enphaseConsent, setEnphaseConsent] = useState<IEnphaseConsent>()
    const [meterVerification, setMeterVerification] = useState<MeterVerificationEnum>(
        MeterVerificationEnum.NOT_VERIFIED,
    )
    const [isMeterVerifyLoading, setIsMeterVerifyLoading] = useState(false)
    const [enedisSgeConsent, setEnedisSgeConsent] = useState<IEnedisSgeConsent>()
    const [isCreateEnedisSgeConsentLoading, setIsCreateEnedisSgeConsentLoading] = useState(false)
    const [createEnedisSgeConsentError, setCreateEnedisSgeConsentError] = useState<boolean>(false)

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
            const [nrlinkConsent, enedisConsent, enphaseConsent] = await Promise.allSettled([
                axios.get<INrlinkConsent>(`${NRLINK_CONSENT_API}/${meterGuid}`),
                axios.get<IEnedisConsent>(`${ENEDIS_CONSENT_API}/${meterGuid}`),
                axios.get<IEnphaseConsent>(`${ENEDIS_CONSENT_API}/${meterGuid}`),
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

            if (enphaseConsent.status === 'fulfilled') {
                setEnphaseConsent(enphaseConsent.value.data)
            } else if (enedisConsent.status === 'rejected') {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la récupération du consentement Enphase',
                        defaultMessage: 'Erreur lors de la récupération du consentement Enphase',
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
        async (housingId: number) => {
            try {
                if (!housingId) throw new Error('No housing id provided')
                setIsMeterVerifyLoading(true)
                const response = await axios.get(`${API_RESOURCES_URL}/enedis-sge/consent/${housingId}/check`)
                if (response.status === 200) setMeterVerification(MeterVerificationEnum.VERIFIED)
                setIsMeterVerifyLoading(false)
            } catch (error: any) {
                setIsMeterVerifyLoading(false)
                setMeterVerification(MeterVerificationEnum.NOT_VERIFIED)
                enqueueSnackbar(
                    error.response.data && error.response.data.detail
                        ? formatMessage({
                              id: error.response.data.detail,
                              defaultMessage: error.response.data.detail,
                          })
                        : formatMessage({
                              id: 'Erreur lors de la vérification de votre compteur',
                              defaultMessage: 'Erreur lors de la vérification de votre compteur',
                          }),

                    {
                        autoHideDuration: 5000,
                        variant: 'error',
                    },
                )
            }
        },
        [enqueueSnackbar, formatMessage],
    )

    const createEnedisSgeConsent = useCallback(
        async (housingId: number) => {
            try {
                if (!housingId) throw new Error('No housing id provided')
                setIsCreateEnedisSgeConsentLoading(true)
                const { status, data } = await axios.post<IEnedisSgeConsent>(
                    `${API_RESOURCES_URL}/enedis-sge/consent/${housingId}`,
                )
                if (status === 201) {
                    setEnedisSgeConsent(data)
                }
                setIsCreateEnedisSgeConsentLoading(false)
            } catch (error: any) {
                setIsCreateEnedisSgeConsentLoading(false)

                if (axios.isAxiosError(error) && error.response?.data.retail) {
                    setCreateEnedisSgeConsentError(true)
                }
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la création de votre compteur',
                        defaultMessage: 'Erreur lors de la création de votre compteur',
                    }),
                    {
                        autoHideDuration: 5000,
                        variant: 'error',
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
        meterVerification,
        setIsMeterVerifyLoading,
        isMeterVerifyLoading,
        setMeterVerification,
        createEnedisSgeConsent,
        enedisSgeConsent,
        setEnedisSgeConsent,
        isCreateEnedisSgeConsentLoading,
        createEnedisSgeConsentError,
        enphaseConsent,
    }
}
