import { useState, useCallback, useEffect } from 'react'
import { axios } from 'src/common/react-platform-components'
import { parseISO, differenceInSeconds } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { API_RESOURCES_URL } from 'src/configs'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import {
    MeasurementStatusApiResponse,
    MeasurementStatusStateType,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement.d'

/**
 * Housings equipments endpoint.
 */
export const HOUSINGS_EQUIPMENTS_API = `${API_RESOURCES_URL}/housings/equipments`

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

    /**
     * Function that get the result of the measurement process.
     */
    const getMeasurementResult = useCallback(async () => {
        try {
            const { data } = await axios.get(
                `${HOUSINGS_EQUIPMENTS_API}/${housingEquipmentId}/measurement/${measurementMode}/result/${equipmentNumber}`,
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
        try {
            const { data } = await axios.get<MeasurementStatusApiResponse>(
                `${HOUSINGS_EQUIPMENTS_API}/${housingEquipmentId}/measurement/${measurementMode}/status/${equipmentNumber}`,
            )
            return data || { status: measurementStatusEnum.failed }
        } catch (_) {
            return { status: measurementStatusEnum.failed }
        }
    }, [equipmentNumber, housingEquipmentId, measurementMode])

    /**
     * Fonction that update the measurement status from the backend.
     */
    const updateStatus = useCallback(async () => {
        const { status, updatedAt } = await getMeasurementStatus()
        setMeasurementStatus({ status, ...(updatedAt ? { lastUpdate: updatedAt } : {}) })
    }, [getMeasurementStatus])

    /**
     * Function that start the measurement of the equipment.
     */
    const startMeasurement = useCallback(async () => {
        const { status, updatedAt } = await getMeasurementStatus()
        if (status === measurementStatusEnum.pending || status === measurementStatusEnum.inProgress) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Un test de mesure est déjà en cours',
                    defaultMessage: 'Un test de mesure est déjà en cours',
                }),
                { autoHideDuration: 5000, variant: 'info' },
            )
            setMeasurementStatus({ status, ...(updatedAt ? { lastUpdate: updatedAt } : {}) })
        } else {
            axios
                .post(`${HOUSINGS_EQUIPMENTS_API}/${housingEquipmentId}/measurement/${measurementMode}`, {
                    equipment_number: equipmentNumber,
                })
                .then(() => {
                    setMeasurementStatus({ status: measurementStatusEnum.pending })
                })
                .catch((error) => {
                    setMeasurementStatus({ status: measurementStatusEnum.failed })
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [equipmentNumber, housingEquipmentId, measurementMode, updateStatus])

    const passedTimeFromStatusLastUpdate = useCallback(() => {
        const currentUtcDate = utcToZonedTime(new Date(), 'Etc/UTC')
        return measurementStatus?.lastUpdate
            ? differenceInSeconds(currentUtcDate, parseISO(measurementStatus.lastUpdate))
            : 0
    }, [measurementStatus])

    useEffect(() => {
        let intervalId: NodeJS.Timer
        let timeoutId: NodeJS.Timeout

        switch (measurementStatus?.status) {
            case measurementStatusEnum.pending:
                intervalId = setInterval(updateStatus, 3000)
                break

            case measurementStatusEnum.inProgress:
                const waitingTime = Math.max(measurementMaxDuration - passedTimeFromStatusLastUpdate() - 3, 0)
                timeoutId = setTimeout(() => {
                    intervalId = setInterval(updateStatus, 3000)
                }, waitingTime * 1000)
                break

            default:
                if (measurementStatus?.status === measurementStatusEnum.success) updateResult()
                clearInterval(intervalId!)
                clearTimeout(timeoutId!)
                break
        }

        return () => {
            clearInterval(intervalId!)
            clearTimeout(timeoutId!)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [measurementStatus])

    return {
        measurementStatus,
        measurementResult,
        passedTimeFromStatusLastUpdate,
        updateResult,
        updateStatus,
        startMeasurement,
    }
}
