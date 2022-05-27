import { useCallback, useEffect, useRef, useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { getMsgFromAxiosError } from 'src/modules/utils'
import { AxiosResponse } from 'axios'
import { METERS_API, useMeterList } from 'src/modules/Meters/metersHook'
import { isMatch } from 'lodash'
import { AccomodationDataType } from 'src/modules/MyHouse/components/Accomodation/AccomodationType'
/**
 * Accomodation url.
 *
 * @param meterId The meterId of the accomodation.
 * @returns Meters base url.
 */
export const ACCOMODATION_API = (meterId: number) => `${METERS_API}/${meterId}/home-configuration`

/**
 * Hooks for accomodation.
 *
 * @returns UseAccomodation.
 */
export function useAccomodation() {
    const [accomodation, setAccomodation] = useState<AccomodationDataType>()
    const { enqueueSnackbar } = useSnackbar()
    const [isLoadingInProgress, setIsLoadingInProgress] = useState(false)
    const { formatMessage } = useIntl()
    const isInitialMount = useRef(true)
    const { elementList: meterList } = useMeterList()

    /**
     * Update Accomodation Form.
     *
     * @param meterId Meter Id.
     * @param body Accomodation data.
     */
    const updateAccomodation = async (meterId: number, body: AccomodationDataType) => {
        const dataIsNotModified = isMatch(accomodation as AccomodationDataType, body)
        if (dataIsNotModified) return
        setIsLoadingInProgress(true)
        try {
            await axios.post<AccomodationDataType, AxiosResponse<AccomodationDataType>>(
                `${ACCOMODATION_API(meterId)}`,
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
     * @param meterId Represent the meterId of the Accomodation to be fetched.
     * @returns The function throw an error, and show snackbar message containing successful and errors message.
     */
    const loadAccomodation = useCallback(
        async (meterId: number) => {
            setIsLoadingInProgress(true)
            try {
                const { data: responseData } = await axios.get<AccomodationDataType>(ACCOMODATION_API(meterId))
                setAccomodation(responseData)
            } catch (error) {
                enqueueSnackbar(
                    formatMessage({
                        id: "Home configuration n'existe pas",
                        defaultMessage: "Home configuration n'existe pas",
                    }),
                    { variant: 'error' },
                )
            }
            setIsLoadingInProgress(false)
        },
        [enqueueSnackbar, formatMessage],
    )
    // UseEffect executes on initial intantiation of Accomodation.
    useEffect(() => {
        if (!meterList?.length) return
        if (isInitialMount.current) {
            isInitialMount.current = false
            loadAccomodation(meterList[0].id)
        }
    }, [loadAccomodation, meterList])
    return {
        isLoadingInProgress,
        accomodation,
        loadAccomodation,
        updateAccomodation,
    }
}
