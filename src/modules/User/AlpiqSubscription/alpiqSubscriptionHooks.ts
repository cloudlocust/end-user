import { useState } from 'react'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { axios } from 'src/common/react-platform-components'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { IAlpiqMeterEligibiltyResponse } from 'src/modules/User/AlpiqSubscription'

/**
 * Errror message when testing meter eligibility.
 */
export const ELIGIBILITY_ERROR_MESSAGE = "Erreur lors de la vérification de l'éligibilité du compteur"

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

    return { verifyMeterEligibility, loadingInProgress }
}
