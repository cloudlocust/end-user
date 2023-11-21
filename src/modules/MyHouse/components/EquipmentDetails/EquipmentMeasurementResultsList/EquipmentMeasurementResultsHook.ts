import { useCallback, useState } from 'react'
import { axios } from 'src/common/react-platform-components'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { MeasurementResultApiResponse } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'
import { measurementResultsStateType } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList/EquipmentMeasurementResultsList'

/**
 * Equipment measurement results hook.
 *
 * @returns The tests result state and the function that update it.
 */
export function useEquipmentMeasurementResults() {
    const [measurementResults, setMeasurementResults] = useState<measurementResultsStateType>({})
    const [isLoadingMeasurements, setIsLoadingMeasurements] = useState(false)

    /**
     * Function to get a measurement result for the equipment in a specific mode.
     *
     * @param measurementMode The measurement mode.
     * @returns The measurement result value.
     */
    const getEquipmentMeasurementResult = useCallback(
        async (equipmentNumber: number, housingEquipmentId: number, measurementMode: string) => {
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
                let measurementResultsObj: measurementResultsStateType = {}
                for (const measurementMode of measurementModes) {
                    const resultValue = await getEquipmentMeasurementResult(
                        equipmentNumber!,
                        housingEquipmentId!,
                        measurementMode,
                    )
                    measurementResultsObj[measurementMode] = resultValue
                }
                setMeasurementResults(measurementResultsObj)
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
