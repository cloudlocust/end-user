import { useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { getMsgFromAxiosError } from 'src/modules/utils'
import { AxiosResponse } from 'axios'
import { METERS_API } from '../../../Meters/metersHook'
import { IMeter } from '../../../Meters/Meters'
import { isMatch } from 'lodash'
/**
 * Accomodation url.
 *
 * @param meterId The meterId of the accomodation.
 * @returns Meters base url.
 */
export const ACCOMODATION_API = (meterId: string) => `${METERS_API}/${meterId}/home-configuration`

/**
 * Accomodation Data Type.
 */
export type AccomodationDataType =
    /**
     * Accomodation Data Type.
     */
    {
        /**
         * House type.
         */
        houseType?: string
        /**
         * House Year.
         */
        houseYear?: string
        /**
         * Residence Type.
         */
        residenceType?: string
        /**
         * Energy Performance Index.
         */
        energyPerformanceIndex?: string
        /**
         * Isolation Level.
         */
        isolationLevel?: string
        /**
         * Number Of Inhabitants.
         */
        numberOfInhabitants?: string
        /**
         * House Area.
         */
        houseArea?: string
        /**
         * Meter Id.
         */
        meterId: IMeter
    }
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
    /**
     * Update Accomodation Form.
     *
     * @param meterId Meter Id.
     * @param body Accomodation data.
     */
    const updateAccomodation = async (meterId: string, body: AccomodationDataType) => {
        const dataIsNotModified = isMatch(accomodation as AccomodationDataType, body)
        if (dataIsNotModified) return
        setIsLoadingInProgress(true)
        try {
            await axios.post<AccomodationDataType, AxiosResponse<any>>(`${ACCOMODATION_API(meterId)}`, body)
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
    const loadAccomodation = async (meterId: string) => {
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
    }
    return {
        isLoadingInProgress,
        accomodation,
        loadAccomodation,
        updateAccomodation,
    }
}
