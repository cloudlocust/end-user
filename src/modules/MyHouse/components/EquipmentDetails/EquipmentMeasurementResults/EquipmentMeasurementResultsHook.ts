import { useCallback, useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { MeasurementResultApiResponse } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'
import { measurementResultsStateType } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults/EquipmentMeasurementResults'

/**
 * Equipment measurement results hook.
 *
 * @returns The tests result state and the function that update it.
 */
export function useEquipmentMeasurementResults() {
    const [measurementResults, setMeasurementResults] = useState<measurementResultsStateType>({})
    const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(true)

    /**
     * Function to get a measurement result for the equipment in a specific mode.
     *
     * @param measurementMode The measurement mode.
     * @returns The measurement result value.
     */
    const getEquipmentMeasurementResult = useCallback(
        async (equipmentNumber: number, housingEquipmentId: number, measurementMode: string) => {
            try {
                const { data } = await axios.get<MeasurementResultApiResponse>(
                    `${HOUSING_API}/equipments/${housingEquipmentId}/measurement/${measurementMode}/result/${equipmentNumber}`,
                )
                return { mode: measurementMode, value: data?.value }
            } catch (error: any) {
                return { mode: measurementMode, value: null }
            }
        },
        [],
    )

    /**
     * Function to update the measurement result values for the equipment.
     */
    const updateEquipmentMeasurementResults = useCallback(
        async (equipmentNumber: number, housingEquipmentId: number, measurementModes: string[]) => {
            if (measurementModes && measurementModes.length > 0) {
                setIsLoadingMeasurements(true)
                setMeasurementResults({})
                const promises = measurementModes.map(
                    async (measurementMode) =>
                        await getEquipmentMeasurementResult(equipmentNumber, housingEquipmentId, measurementMode),
                )
                const resultValues = await Promise.all(promises)
                let intermediateMeasurementResults: measurementResultsStateType = {}
                for (const resultValue of resultValues) {
                    intermediateMeasurementResults[resultValue.mode] = resultValue.value
                }
                setMeasurementResults(intermediateMeasurementResults)
                setIsLoadingMeasurements(false)
            }
        },
        [getEquipmentMeasurementResult],
    )

    return {
        measurementResults,
        isLoadingMeasurements,
        updateEquipmentMeasurementResults,
    }
}
