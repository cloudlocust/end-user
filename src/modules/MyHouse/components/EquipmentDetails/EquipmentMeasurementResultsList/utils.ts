import { axios } from 'src/common/react-platform-components'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { MeasurementResultApiResponse } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurement'

/**
 * Function to get the measurement result for an equipment.
 *
 * @param measurementMode The measurement mode.
 * @param housingEquipmentId The global equipment id.
 * @param equipmentNumber The equipment number.
 * @returns The measurement result for an equipment.
 */
export const getEquipmentMeasurementResult = async (
    measurementMode: string,
    housingEquipmentId: number,
    equipmentNumber: number | null,
) => {
    if (!measurementMode || !housingEquipmentId || !equipmentNumber) return null
    try {
        const { data } = await axios.get<MeasurementResultApiResponse>(
            `${HOUSING_API}/equipments/${housingEquipmentId}/measurement/${measurementMode}/result/${equipmentNumber}`,
        )
        return data?.value
    } catch (error: any) {
        return null
    }
}
