import { useCallback, useEffect, useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { MeasurementResultApiResponse } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'
import { measurementResultsStateType } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/EquipmentMeasurementResults'

/**
 * Equipment measurement results hook.
 *
 * @param equipmentNumber The equipment number.
 * @param housingEquipmentId The global equipment id.
 * @param measurementModes The list of measurement modes for the equipment.
 * @returns The tests result values.
 */
export function useEquipmentMeasurementResults(
    equipmentNumber: number | null,
    housingEquipmentId?: number,
    measurementModes?: string[],
) {
    const [measurementResults, setMeasurementResults] = useState<measurementResultsStateType>({})

    /**
     * Function to get a measurement result for the equipment in a specific mode.
     *
     * @param measurementMode The measurement mode.
     * @returns The measurement result value.
     */
    const getEquipmentMeasurementResult = useCallback(
        async (measurementMode: string) => {
            if (!measurementMode || !housingEquipmentId || !equipmentNumber) return null
            try {
                const { data } = await axios.get<MeasurementResultApiResponse>(
                    `${HOUSING_API}/equipments/${housingEquipmentId}/measurement/${measurementMode}/result/${equipmentNumber}`,
                )
                return data?.value
            } catch (error: any) {
                return null
            }
        },
        [equipmentNumber, housingEquipmentId],
    )

    /**
     * Function to update the measurement result values for the equipment.
     */
    const updateEquipmentMeasurementResults = useCallback(async () => {
        // Renitialize the measurementResults state
        let measurementResultsInit: measurementResultsStateType = {}
        measurementModes?.forEach((measurementMode) => {
            measurementResultsInit[measurementMode] = { isLoading: true }
        })
        await setMeasurementResults(measurementResultsInit!)

        // Update the measurementResults state
        measurementModes?.forEach(async (measurementMode) => {
            const resultValue = await getEquipmentMeasurementResult(measurementMode)
            setMeasurementResults((currentResults) => ({
                ...currentResults,
                [measurementMode]: { value: resultValue, isLoading: false },
            }))
        })
    }, [getEquipmentMeasurementResult, measurementModes])

    /**
     * Getting the measurement results every time the parameters chenges.
     */
    useEffect(() => {
        updateEquipmentMeasurementResults()
    }, [updateEquipmentMeasurementResults])

    return {
        measurementResults,
    }
}
