import { useCallback, useEffect, useRef, useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { getMsgFromAxiosError } from 'src/modules/utils'
import { AxiosResponse } from 'axios'
import { AccomodationDataType } from 'src/modules/MyHouse/components/Accomodation/AccomodationType'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { equipmentsAccomodationFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
/**
 * Accomodation url.
 *
 * @param housingId The meterId of the accomodation.
 * @returns Meters base url.
 */
export const ACCOMODATION_API = (housingId: number) => `${HOUSING_API}/${housingId}/home-configuration`

/**
 * Hooks for accomodation.
 *
 * @param housingId MeterId.
 * @returns UseAccomodation.
 */
export function useAccomodation(housingId: number) {
    const [accomodation, setAccomodation] = useState<AccomodationDataType>()
    const { enqueueSnackbar } = useSnackbar()
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)

    const { formatMessage } = useIntl()
    const isInitialMount = useRef(true)
    const [isAccomodationMeterListEmpty, setIsAccomodationMeterListEmpty] = useState(false)

    /**
     * Update Accomodation Form.
     *
     * @param body Accomodation data.
     */
    const updateAccomodation = async (body: AccomodationDataType) => {
        setIsLoadingInProgress(true)
        try {
            await axios.post<AccomodationDataType, AxiosResponse<AccomodationDataType>>(
                `${ACCOMODATION_API(housingId)}`,
                body,
            )
            enqueueSnackbar(
                formatMessage({
                    id: 'Vos modifications ont été sauvegardées',
                    defaultMessage: 'Vos modifications ont été sauvegardées',
                }),
                { variant: 'success' },
            )
            setIsLoadingInProgress(false)
        } catch (error) {
            const message = getMsgFromAxiosError(error)
            enqueueSnackbar(message, { variant: 'error' })
            setIsLoadingInProgress(false)
            throw message
        }
    }
    /**
     * Function hook responsible for fetching the function responsible for fetching Accomodation.
     *
     * @param housingId Represent the housingId of the Accomodation to be fetched.
     * @returns The function throw an error, and show snackbar message containing successful and errors message.
     */
    const loadAccomodation = useCallback(async () => {
        setIsLoadingInProgress(true)
        setIsAccomodationMeterListEmpty(false)
        try {
            const { data: responseData } = await axios.get<AccomodationDataType>(ACCOMODATION_API(housingId))
            setAccomodation(responseData)
            setIsLoadingInProgress(false)
        } catch (error: any) {
            if (error.response.status === 404) {
                setIsAccomodationMeterListEmpty(true)
                setIsLoadingInProgress(false)
                return
            }
            enqueueSnackbar(
                formatMessage({
                    id: error.response.data.detail,
                    defaultMessage: error.response.data.detail,
                }),
                { variant: 'error' },
            )
            setIsLoadingInProgress(false)
        }
    }, [enqueueSnackbar, formatMessage, housingId])

    // UseEffect executes on initial intantiation of Accomodation.
    useEffect(() => {
        if (isInitialMount.current && !equipmentsAccomodationFeatureState) {
            isInitialMount.current = false
            loadAccomodation()
        }
    }, [loadAccomodation])
    return {
        isLoadingInProgress,
        accomodation,
        loadAccomodation,
        updateAccomodation,
        isAccomodationMeterListEmpty,
    }
}
