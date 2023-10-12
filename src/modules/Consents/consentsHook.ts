import { useCallback, useState } from 'react'
import {
    EnphaseLink,
    IEnedisSgeConsent,
    IEnphaseConsent,
    INrlinkConsent,
    MeterVerificationEnum,
} from 'src/modules/Consents/Consents.d'
import { useSnackbar } from 'notistack'
import { useIntl } from 'react-intl'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'
import { sgeConsentFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { useAxiosCancelToken } from 'src/hooks/AxiosCancelToken'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { isProductionActiveAndHousingHasAccess } from 'src/modules/MyHouse/MyHouseConfig'

const NO_HOUSING_ID_ERROR_TEXT = 'No housing id provided'

/**
 * Nrlink consent endpoint.
 */
export const NRLINK_CONSENT_API = `${API_RESOURCES_URL}/nrlink/consent`

/**
 * Enedis Sge consent endpoint.
 */
export const ENEDIS_SGE_CONSENT_API = `${API_RESOURCES_URL}/enedis-sge/consent`

/**
 * Enphase consent endpoint.
 */
export const ENPHASE_CONSENT_API = `${API_RESOURCES_URL}/enphase/consent`

/**
 * Get Enphase URL.
 */
export const ENPHASE_URL = `${API_RESOURCES_URL}/enphase/consent/link`

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
    const [enphaseConsent, setEnphaseConsent] = useState<IEnphaseConsent>()
    const [meterVerification, setMeterVerification] = useState<MeterVerificationEnum>(
        MeterVerificationEnum.NOT_VERIFIED,
    )
    const [isMeterVerifyLoading, setIsMeterVerifyLoading] = useState(false)
    const [enedisSgeConsent, setEnedisSgeConsent] = useState<IEnedisSgeConsent>()
    const [isCreateEnedisSgeConsentLoading, setIsCreateEnedisSgeConsentLoading] = useState(false)
    const [isEnphaseConsentLoading, setIsEnphaseConsentLoading] = useState(false)
    const [isNrlinkConsentLoading, setIsNrlinkConsentLoading] = useState(false)
    const [createEnedisSgeConsentError, setCreateEnedisSgeConsentError] = useState<boolean>(false)
    const [enphaseLink, setEnphaseLink] = useState<EnphaseLink['url']>('')
    const { isCancel, source } = useAxiosCancelToken()

    const { currentHousingScopes, currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    /**
     * Function that performs HTTP call to get consents.
     *
     * @param houseId HouseId.
     */
    const getConsents = useCallback(
        async (houseId?: number) => {
            setNrlinkConsent(undefined)
            setEnedisSgeConsent(undefined)
            setEnphaseConsent(undefined)
            if (!houseId || !currentHousing?.meter?.guid) return

            setConsentsLoading(true)
            /**
             * Used Promise.allSettled() instead of Promise.all to return a promise that resolves after all of the given requests have either been fulfilled or rejected.
             * Because Promise.all() throws only when the first promise is rejected and it returns only that rejection.
             * If the promise status is "fulfilled" it returns "value", If it's "rejetected" it returns "reason".
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled .
             */
            const [nrlinkConsent, enedisSgeConsent, enphaseConsent] = await Promise.allSettled([
                axios.get<INrlinkConsent>(`${NRLINK_CONSENT_API}/${houseId}`, { cancelToken: source.current.token }),
                sgeConsentFeatureState
                    ? axios.get<IEnedisSgeConsent>(`${ENEDIS_SGE_CONSENT_API}/${houseId}`, {
                          cancelToken: source.current.token,
                      })
                    : null, // If env is disabled, the request for SgeConsent won't be performed.
                isProductionActiveAndHousingHasAccess(currentHousingScopes)
                    ? axios.get<IEnphaseConsent>(`${ENPHASE_CONSENT_API}/${houseId}`, {
                          cancelToken: source.current.token,
                      })
                    : null,
            ])

            // Cancel previous request.
            if (enedisSgeConsent.status === 'rejected' && isCancel(enedisSgeConsent.reason)) return
            if (enphaseConsent.status === 'rejected' && isCancel(enphaseConsent.reason)) return
            if (nrlinkConsent.status === 'rejected' && isCancel(nrlinkConsent.reason)) return

            // Set Consents when Fulfilled.
            if (nrlinkConsent.status === 'fulfilled') setNrlinkConsent(nrlinkConsent.value?.data)
            if (enedisSgeConsent.status === 'fulfilled') setEnedisSgeConsent(enedisSgeConsent.value?.data)
            if (enphaseConsent.status === 'fulfilled') setEnphaseConsent(enphaseConsent.value?.data)

            // Show error message when rejeected.
            if (
                enedisSgeConsent.status === 'rejected' ||
                nrlinkConsent.status === 'rejected' ||
                enphaseConsent.status === 'rejected'
            ) {
                enqueueSnackbar(
                    formatMessage({
                        id: 'Nous rencontrons une erreur lors de la récupération de vos consentements d’un de vos compteurs ou capteurs. Veuillez réessayer plus tard',
                        defaultMessage:
                            'Nous rencontrons une erreur lors de la récupération de vos consentements d’un de vos compteurs ou capteurs. Veuillez réessayer plus tard',
                    }),
                    {
                        variant: 'error',
                        autoHideDuration: 5000,
                    },
                )
            }
            setConsentsLoading(false)
        },
        [source, currentHousingScopes, isCancel, currentHousing?.meter?.guid, enqueueSnackbar, formatMessage],
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
                if (!housingId) throw new Error(NO_HOUSING_ID_ERROR_TEXT)
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

    /**
     * Revoke Enphase Consent handler.
     */
    const revokeEnphaseConsent = useCallback(
        async (houseId?: number) => {
            try {
                if (!houseId) return
                setIsEnphaseConsentLoading(true)
                await axios.patch(`${ENPHASE_CONSENT_API}/${houseId}/revoke`)
                setEnphaseConsent(undefined)
                setIsEnphaseConsentLoading(false)
            } catch (error: any) {
                setIsEnphaseConsentLoading(false)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors de la révokation de votre consentement enphase',
                        defaultMessage: 'Erreur lors de la révokation de votre consentement enphase',
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

    const getEnphaseLink = useCallback(
        async (housingId: number) => {
            try {
                if (!housingId) throw new Error(NO_HOUSING_ID_ERROR_TEXT)
                const { data: responseData } = await axios.get<EnphaseLink>(`${ENPHASE_URL}/${housingId}`)
                setEnphaseLink(responseData.url)
            } catch (error) {
                enqueueSnackbar(
                    formatMessage({
                        id: "Erreur lors de la récupération du lien d'Enphase",
                        defaultMessage: "Erreur lors de la récupération du lien d'Enphase",
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

    /**
     * Revoke Nrlink Consent handler.
     */
    const revokeNrlinkConsent = useCallback(
        async (houseId?: number, nrlinkGuid?: string) => {
            if (!houseId || !nrlinkGuid) return
            setIsNrlinkConsentLoading(true)
            try {
                await axios.delete(`${NRLINK_CONSENT_API}/${houseId}?nrlink_guid=${nrlinkGuid}`)
                setNrlinkConsent(undefined)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Consentement nrLINK révoqué avec succès',
                        defaultMessage: 'Consentement nrLINK révoqué avec succès',
                    }),
                    {
                        autoHideDuration: 5000,
                        variant: 'success',
                    },
                )
            } catch (error: any) {
                if (error?.response?.data?.detail) {
                    enqueueSnackbar(error.response.data.detail, { variant: 'error' })
                } else {
                    enqueueSnackbar(
                        formatMessage({
                            id: 'Erreur lors de la révokation de votre Consentement nrLINK',
                            defaultMessage: 'Erreur lors de la révokation de votre Consentement nrLINK',
                        }),
                        {
                            autoHideDuration: 5000,
                            variant: 'error',
                        },
                    )
                }
            } finally {
                setIsNrlinkConsentLoading(false)
            }
        },
        [enqueueSnackbar, formatMessage],
    )

    return {
        nrlinkConsent,
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
        getEnphaseLink,
        enphaseLink,
        setEnphaseLink,
        isEnphaseConsentLoading,
        revokeEnphaseConsent,
        isNrlinkConsentLoading,
        revokeNrlinkConsent,
    }
}
