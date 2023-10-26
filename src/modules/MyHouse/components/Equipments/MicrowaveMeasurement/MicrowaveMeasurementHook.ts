import { useState, useCallback, useEffect, useRef } from 'react'
import { axios } from 'src/common/react-platform-components'
import { parseISO, differenceInSeconds } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import {
    MeasurementResultApiResponse,
    MeasurementStatusApiResponse,
    MeasurementStatusStateType,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement.d'

/**
 * Microwave measurement hook.
 *
 * @param housingEquipmentId The global equipment id.
 * @param measurementMode The selected measurement mode.
 * @param equipmentNumber The number of the equipment to test.
 * @param measurementMaxDuration Estimated value for the maximum duration of the measurement process (in seconds).
 * @returns Microwave measurement status and functions...
 */
export function useMicrowaveMeasurement(
    housingEquipmentId: number,
    measurementMode: string,
    equipmentNumber: number,
    measurementMaxDuration: number,
) {
    const { enqueueSnackbar } = useSnackbar()
    const { formatMessage } = useIntl()
    const [measurementStatus, setMeasurementStatus] = useState<MeasurementStatusStateType | null>(null)
    const [measurementResult, setMeasurementResult] = useState<number | null>(null)
    const updateStatusIntervalRef = useRef<NodeJS.Timer | null>(null)
    const measurementWaitingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    /**
     * Function that get the result of the measurement process.
     */
    const getMeasurementResult = useCallback(async () => {
        try {
            const { data } = await axios.get<MeasurementResultApiResponse>(
                `${HOUSING_API}/equipments/${housingEquipmentId}/measurement/${measurementMode}/result/${equipmentNumber}`,
            )
            return data?.value
        } catch (_) {
            return null
        }
    }, [equipmentNumber, housingEquipmentId, measurementMode])

    /**
     * Fonction that update the measurement result from the backend.
     */
    const updateResult = useCallback(async () => {
        const result = await getMeasurementResult()
        setMeasurementResult(result)
    }, [getMeasurementResult])

    /**
     * Function that get the status of the measurement process.
     */
    const getMeasurementStatus = useCallback(async () => {
        if (!equipmentNumber || !housingEquipmentId || !measurementMode) return null
        try {
            const { data } = await axios.get<MeasurementStatusApiResponse>(
                `${HOUSING_API}/equipments/${housingEquipmentId}/measurement/${measurementMode}/status/${equipmentNumber}`,
            )
            return data
        } catch (_) {
            return { status: measurementStatusEnum.FAILED }
        }
    }, [equipmentNumber, housingEquipmentId, measurementMode])

    /**
     * Fonction that update the measurement status from the backend.
     */
    const updateStatus = useCallback(async () => {
        const newStatus = await getMeasurementStatus()
        if (newStatus === null) setMeasurementStatus(null)
        else setMeasurementStatus({ status: newStatus.status, updatedAt: newStatus.updatedAt })
    }, [getMeasurementStatus])

    /**
     * Function that start the measurement of the equipment.
     */
    const startMeasurement = useCallback(async () => {
        const newStatus = await getMeasurementStatus()
        if (newStatus === null) setMeasurementStatus(null)
        else if (
            newStatus.status === measurementStatusEnum.PENDING ||
            newStatus.status === measurementStatusEnum.IN_PROGRESS
        ) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Un test de mesure est déjà en cours',
                    defaultMessage: 'Un test de mesure est déjà en cours',
                }),
                { autoHideDuration: 5000, variant: 'info' },
            )
            setMeasurementStatus({
                status: newStatus.status,
                ...(newStatus.updatedAt ? { updatedAt: newStatus.updatedAt } : {}),
            })
        } else {
            axios
                .post(`${HOUSING_API}/equipments/${housingEquipmentId}/measurement/${measurementMode}`, {
                    equipment_number: equipmentNumber,
                })
                .then(() => {
                    setMeasurementStatus({ status: measurementStatusEnum.PENDING })
                })
                .catch((error) => {
                    setMeasurementStatus({ status: measurementStatusEnum.FAILED })
                    const errorMessage = error?.response?.data?.detail || 'Erreur lors du lancement du test de mesure'
                    enqueueSnackbar(
                        formatMessage({
                            id: errorMessage,
                            defaultMessage: errorMessage,
                        }),
                        { autoHideDuration: 5000, variant: 'error' },
                    )
                })
        }
    }, [equipmentNumber, housingEquipmentId, measurementMode, enqueueSnackbar, formatMessage, getMeasurementStatus])

    /**
     * Function to get the passed time (in seconds) from the last update of status.
     */
    const getTimeFromStatusLastUpdate = useCallback(() => {
        const currentUtcDate = utcToZonedTime(new Date(), 'Etc/UTC')
        return measurementStatus?.updatedAt
            ? differenceInSeconds(currentUtcDate, parseISO(measurementStatus.updatedAt))
            : 0
    }, [measurementStatus])

    /**
     * Function that cleared the interval used to update the measurement status.
     */
    const clearUpdateStatusInterval = () => {
        if (updateStatusIntervalRef.current) {
            clearInterval(updateStatusIntervalRef.current)
            updateStatusIntervalRef.current = null
        }
    }

    /**
     * Function that cleared the timeout used to wait for the measurement progress.
     */
    const clearMeasurementWaitingTimeout = () => {
        if (measurementWaitingTimeoutRef.current) {
            clearTimeout(measurementWaitingTimeoutRef.current)
            measurementWaitingTimeoutRef.current = null
        }
    }

    useEffect(() => {
        /**
         * Clearing the measurementWaitingTimeout and updateStatusInterval if they exists.
         */
        clearMeasurementWaitingTimeout()
        clearUpdateStatusInterval()

        switch (measurementStatus?.status) {
            case measurementStatusEnum.PENDING:
                /**
                 * When the status changes to the value PENDING, an interval will be created to update
                 * the status state from the backend every 3 seconds (to check if the measurement has
                 * started or not).
                 */
                updateStatusIntervalRef.current = setInterval(updateStatus, 3000)
                break

            case measurementStatusEnum.IN_PROGRESS:
                /**
                 * This is the time left for the test ending and it's the time that we should wait
                 * until restarting checking if the test has finished (the status changed to SUCCESS
                 * or FAILED), it's equal to the measurement duration minus the passed time from
                 * the starting of the test minus 3 (we subtracted the 3 to avoid waiting another
                 * 3 seconds, due to the updateStatusInterval interval, before restarting the check).
                 */
                const waitingTime = Math.max(measurementMaxDuration - getTimeFromStatusLastUpdate() - 3, 0)
                /**
                 * When the status changes to the value IN_PROGRESS (the measurement has started),
                 * we wait a moment to let the measurement progress, then we start updating the status
                 * state from the backend every 3 seconds (to check if the measurement has succeeded
                 * or failed).
                 */
                measurementWaitingTimeoutRef.current = setTimeout(() => {
                    updateStatusIntervalRef.current = setInterval(updateStatus, 3000)
                }, waitingTime * 1000)
                break

            case measurementStatusEnum.SUCCESS:
                /**
                 * When the status changes to the value SUCCESS, we get the measurement result value.
                 */
                updateResult()
                break
        }
    }, [measurementStatus, measurementMaxDuration, updateResult, updateStatus, getTimeFromStatusLastUpdate])

    return {
        measurementStatus,
        measurementResult,
        setMeasurementStatus,
        getTimeFromStatusLastUpdate,
        updateResult,
        updateStatus,
        startMeasurement,
    }
}
