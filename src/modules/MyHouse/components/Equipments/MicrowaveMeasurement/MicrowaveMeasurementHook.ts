import { useState, useCallback, useEffect } from 'react'
import { axios } from 'src/common/react-platform-components'
import { useIntl } from 'src/common/react-platform-translation'
import { useSnackbar } from 'notistack'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { MeasurementResultApiResponse } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement.d'

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
    const [measurementStatus, setMeasurementStatus] = useState<measurementStatusEnum | null>(null)
    const [measurementResult, setMeasurementResult] = useState<number | null>(null)

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
        try {
            const { data } = await axios.get(
                `${HOUSING_API}/equipments/${housingEquipmentId}/measurement/${measurementMode}/status/${equipmentNumber}`,
            )
            return data?.status || measurementStatusEnum.failed
        } catch (_) {
            return measurementStatusEnum.failed
        }
    }, [equipmentNumber, housingEquipmentId, measurementMode])

    /**
     * Fonction that update the measurement status from the backend.
     */
    const updateStatus = useCallback(async () => {
        const status = await getMeasurementStatus()
        setMeasurementStatus(status)
    }, [getMeasurementStatus])

    /**
     * Function that start the measurement of the equipment.
     */
    const startMeasurement = useCallback(async () => {
        const status = await getMeasurementStatus()
        if (status === measurementStatusEnum.pending || status === measurementStatusEnum.inProgress) {
            enqueueSnackbar(
                formatMessage({
                    id: 'Un test de mesure est déjà en cours',
                    defaultMessage: 'Un test de mesure est déjà en cours',
                }),
                { autoHideDuration: 5000, variant: 'info' },
            )
            setMeasurementStatus(status)
        } else {
            try {
                await axios.post(`${HOUSING_API}/equipments/${housingEquipmentId}/measurement/${measurementMode}`, {
                    equipment_number: equipmentNumber,
                })
                await setMeasurementStatus(measurementStatusEnum.pending)
            } catch (_) {
                if (status !== measurementStatusEnum.failed) setMeasurementStatus(measurementStatusEnum.failed)
                enqueueSnackbar(
                    formatMessage({
                        id: 'Erreur lors du lancement du test de mesure',
                        defaultMessage: 'Erreur lors du lancement du test de mesure',
                    }),
                    { autoHideDuration: 5000, variant: 'error' },
                )
            }
        }
    }, [equipmentNumber, housingEquipmentId, measurementMode, enqueueSnackbar, formatMessage, getMeasurementStatus])

    useEffect(() => {
        let intervalId: NodeJS.Timer
        let timeoutId: NodeJS.Timeout

        switch (measurementStatus) {
            case measurementStatusEnum.pending:
                intervalId = setInterval(updateStatus, 3000)
                break

            case measurementStatusEnum.inProgress:
                timeoutId = setTimeout(() => {
                    intervalId = setInterval(updateStatus, 3000)
                }, Math.max(measurementMaxDuration - 3, 0) * 1000)
                break

            default:
                if (measurementStatus === measurementStatusEnum.success) updateResult()
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
        updateResult,
        updateStatus,
        startMeasurement,
    }
}
