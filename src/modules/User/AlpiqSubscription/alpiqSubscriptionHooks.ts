import { useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { axios } from 'src/common/react-platform-components'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import {
    IAlpiqMeterEligibiltyResponse,
    IApliqMonthlySubscriptionEstimationResponse,
    CreateAlpiqSubscriptionDataType,
    ICreateAlpiqSubscriptionResponse,
} from 'src/modules/User/AlpiqSubscription/index.d'
import { AxiosResponse } from 'axios'

/**
 * Errror message when testing meter eligibility.
 */
export const ELIGIBILITY_ERROR_MESSAGE = "Erreur lors de la vérification de l'éligibilité du compteur"

/**
 * Error No housing.
 */
export const NO_HOUSING_ERROR_MESSAGE = 'Aucun logement renseigné'

/**
 * Error Message when getting estimation for monthly subscription.
 */
export const MONTHLY_ESTIMATION_ERROR_MESSAGE = 'Erreur lors du calcul de votre mensualité'

/**
 * Use Alpiq Provider hook.
 *
 * @returns Use Alpiq Provider hook.
 */
export const useAlpiqProvider = () => {
    const [loadingInProgress, setLoadingInProgress] = useState(false)
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()

    /**
     * Function that verify meter eligibility for alpiq provider.
     *
     * @param housingId Housing Id.
     * @param onAfterValidation Callback after validation.
     * @returns Apliq api response.
     */
    const verifyMeterEligibility = async (housingId: number, onAfterValidation: () => void) => {
        setLoadingInProgress(true)
        try {
            const { data: responseData } = await axios.get<IAlpiqMeterEligibiltyResponse>(
                `${HOUSING_API}/${housingId}/alpiq/verify-meter-eligibility`,
            )

            if (responseData.isMeterEligible) {
                onAfterValidation()
            } else {
                enqueueSnackbar(
                    formatMessage({
                        id: "Votre PDL/PRM n'est pas éligible",
                        defaultMessage: "Votre PDL/PRM n'est pas éligible",
                    }),
                    { variant: 'error' },
                )
            }
            setLoadingInProgress(false)
            return responseData?.isMeterEligible
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: ELIGIBILITY_ERROR_MESSAGE,
                    defaultMessage: ELIGIBILITY_ERROR_MESSAGE,
                }),
                { variant: 'error' },
            )

            setLoadingInProgress(false)
        }
    }

    /**
     * Get Monthly subscription estimation.
     *
     * @param power Power in KVA.
     * @param contractType Contract type.
     * @param housingId HousingId.
     * @returns Estimation of monthly subscription value.
     */
    const getMonthlySubscriptionEstimation = async (
        power: number,
        contractType: 'HPHC' | 'BASE',
        housingId?: number,
    ) => {
        if (!housingId) {
            enqueueSnackbar(
                formatMessage({
                    id: NO_HOUSING_ERROR_MESSAGE,
                    defaultMessage: NO_HOUSING_ERROR_MESSAGE,
                }),
                { variant: 'error' },
            )
            return
        }
        setLoadingInProgress(true)
        try {
            const { data: responseData } = await axios.get<IApliqMonthlySubscriptionEstimationResponse>(
                `${HOUSING_API}/${housingId}/alpiq/monthly-subscription-estimation?power=${power}&offer_name=${contractType}`,
            )

            setLoadingInProgress(false)
            return responseData?.monthlySubscriptionEstimation
        } catch (error) {
            enqueueSnackbar(
                formatMessage({
                    id: MONTHLY_ESTIMATION_ERROR_MESSAGE,
                    defaultMessage: MONTHLY_ESTIMATION_ERROR_MESSAGE,
                }),
                { variant: 'error' },
            )
            setLoadingInProgress(false)
        }
    }

    /**
     * Hook for alpiq subscription.
     *
     * @param body Data for alpiq subscription.
     * @param housingId Housing Id.
     * @returns Void.
     */
    const createAlpiqSubscription = async (body: CreateAlpiqSubscriptionDataType, housingId?: number) => {
        if (!housingId) {
            enqueueSnackbar(
                formatMessage({
                    id: NO_HOUSING_ERROR_MESSAGE,
                    defaultMessage: NO_HOUSING_ERROR_MESSAGE,
                }),
                { variant: 'error' },
            )
            return
        }
        setLoadingInProgress(true)
        try {
            await axios.post<CreateAlpiqSubscriptionDataType, AxiosResponse<ICreateAlpiqSubscriptionResponse>>(
                `${HOUSING_API}/${housingId}/alpiq/create-subscription`,
                body,
            )

            enqueueSnackbar(
                formatMessage({
                    id: 'Souscription reçue',
                    defaultMessage: 'Souscription reçue',
                }),
                { variant: 'success' },
            )
        } catch (error: any) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Erreur lors de la souscription au contract Alpiq',
                    defaultMessage: 'Erreur lors de la souscription au contract Alpiq',
                }),
                {
                    variant: 'error',
                },
            )
        }
        setLoadingInProgress(false)
    }

    return { verifyMeterEligibility, getMonthlySubscriptionEstimation, loadingInProgress, createAlpiqSubscription }
}
