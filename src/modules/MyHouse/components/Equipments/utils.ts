import { isNil } from 'lodash'
import {
    HousingEquipmentListType,
    HousingEquipmentType,
} from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'
import {
    IEquipmentMeter,
    equipmentAllowedTypeT,
    equipmentNameType,
    equipmentType,
} from 'src/modules/MyHouse/components/Installation/InstallationType'
import { ReactComponent as TvIcon } from 'src/assets/images/content/housing/equipments/tv.svg'
import { ReactComponent as DesktopComputerIcon } from 'src/assets/images/content/housing/equipments/desktopcomputer.svg'
import { ReactComponent as LaptopIcon } from 'src/assets/images/content/housing/equipments/laptop.svg'
import { ReactComponent as VaccumIcon } from 'src/assets/images/content/housing/equipments/vacuum.svg'
import { ReactComponent as OvenIcon } from 'src/assets/images/content/housing/equipments/oven.svg'
import { ReactComponent as MicrowaveIcon } from 'src/assets/images/content/housing/equipments/microwave.svg'
import { ReactComponent as FridgeIcon } from 'src/assets/images/content/housing/equipments/fridge.svg'
import { ReactComponent as DisahwasherIcon } from 'src/assets/images/content/housing/equipments/dishwasher.svg'
import { ReactComponent as WashingmachineIcon } from 'src/assets/images/content/housing/equipments/washingmachine.svg'
import { ReactComponent as DryerIcon } from 'src/assets/images/content/housing/equipments/dryer.svg'
import { ReactComponent as FreezerIcon } from 'src/assets/images/content/housing/equipments/freezer.svg'
import { ReactComponent as KettleIcon } from 'src/assets/images/content/housing/equipments/kettle.svg'
import { ReactComponent as CoffeeMachineIcon } from 'src/assets/images/content/housing/equipments/coffee_machine.svg'
import { ReactComponent as SwimmingPoolIcon } from 'src/assets/images/content/housing/equipments/swimmingpool.svg'
import { ReactComponent as HeatPumpIcon } from 'src/assets/images/content/housing/equipments/heatpump.svg'
import { ReactComponent as ReversibleHeatPumpIcon } from 'src/assets/images/content/housing/equipments/reversible_heatpump.svg'
import { ReactComponent as SwimmingPoolHeatPumpIcon } from 'src/assets/images/content/housing/equipments/swimmingpool_heatpump.svg'
import { ReactComponent as ElectricCarIcon } from 'src/assets/images/content/housing/equipments/electric_car.svg'
import { ReactComponent as AquariumIcon } from 'src/assets/images/content/housing/equipments/aquarium.svg'
import { ReactComponent as CeramicHobIcon } from 'src/assets/images/content/housing/equipments/ceramic_hob.svg'
import { ReactComponent as IronPlateIcon } from 'src/assets/images/content/housing/equipments/iron_plate.svg'
import { ReactComponent as InductionPlateIcon } from 'src/assets/images/content/housing/equipments/induction_plate.svg'
import { ReactComponent as RadiatorIcon } from 'src/assets/images/content/housing/equipments/radiator.svg'
import { ReactComponent as AirConditionerIcon } from 'src/assets/images/content/housing/equipments/air_conditioner.svg'
import { ReactComponent as DryTowelIcon } from 'src/assets/images/content/housing/equipments/dry_towel.svg'
import { ReactComponent as WaterHeaterIcon } from 'src/assets/images/content/housing/equipments/water_heater.svg'
import { SolarPower as SolarPanelIcon } from '@mui/icons-material'
import {
    ALLOWED_EQUIPMENT_TYPES,
    equipmentsOptions,
    mappingEquipmentNameToType,
} from 'src/modules/MyHouse/components/Equipments/EquipmentsVariables'
import { orderListBy } from 'src/modules/utils'

/**
 * Function that compares housingEquipments & equipments.
 *
 * @param housingEquipments Housing equipments list.
 * @param equipments Equipments list.
 * @returns Available equipments that were not chosen.
 */
export function getAvailableEquipments(
    housingEquipments?: HousingEquipmentListType,
    equipments?: equipmentType[] | null,
) {
    if (isNil(housingEquipments) || isNil(equipments)) return
    // Filter out the equipments that are already chosen
    return equipments?.filter((equipment) => {
        // Check if the equipment is in the housing equipment list
        const isChosen = housingEquipments?.some((housingEquipment) => housingEquipment.id === equipment.id)
        // Only include equipment if it's not already chosen
        return !isChosen
    })
}

/**
 * Function to get icon component.
 *
 * @param equipmentName Equipment name typE.
 * @returns Equipment Icon.
 */
export const getIconComponent = (equipmentName: equipmentNameType) => {
    switch (equipmentName) {
        case 'desktopcomputer':
            return DesktopComputerIcon
        case 'laptop':
            return LaptopIcon
        case 'tv':
            return TvIcon
        case 'vacuum':
            return VaccumIcon
        case 'oven':
            return OvenIcon
        case 'microwave':
            return MicrowaveIcon
        case 'fridge':
            return FridgeIcon
        case 'dishwasher':
            return DisahwasherIcon
        case 'washingmachine':
            return WashingmachineIcon
        case 'dryer':
            return DryerIcon
        case 'solarpanel':
            return SolarPanelIcon
        case 'freezer':
            return FreezerIcon
        case 'kettle':
            return KettleIcon
        case 'coffee_machine':
            return CoffeeMachineIcon
        case 'swimmingpool':
            return SwimmingPoolIcon
        case 'heatpump':
            return HeatPumpIcon
        case 'reversible_heatpump':
            return ReversibleHeatPumpIcon
        case 'swimmingpool_heatpump':
            return SwimmingPoolHeatPumpIcon
        case 'electric_car':
            return ElectricCarIcon
        case 'aquarium':
            return AquariumIcon
        case 'ceramic_hob':
            return CeramicHobIcon
        case 'iron_plate':
            return IronPlateIcon
        case 'induction_plate':
            return InductionPlateIcon
        case 'radiator':
            return RadiatorIcon
        case 'air_conditioner':
            return AirConditionerIcon
        case 'dry_towel':
            return DryTowelIcon
        case 'water_heater':
            return WaterHeaterIcon
        default:
            throw new Error(`No icon component found for equipment name: ${equipmentName}`)
    }
}

/**
 * Checks if the given housing equipment has an allowed equipment type.
 *
 * @param housingEquipment The housing equipment to be checked.
 * @returns A boolean indicating if the housing equipment has at least one allowed type.
 */
function isAllowedEquipmentType(housingEquipment: IEquipmentMeter) {
    return ALLOWED_EQUIPMENT_TYPES.some((type) =>
        housingEquipment.equipment.allowedType.includes(type as equipmentAllowedTypeT),
    )
}

/**
 * Formats a given housing equipment object into a standardized format.
 *
 * @param housingEquipment The housing equipment to be formatted.
 * @returns A formatted housing equipment object.
 */
export function formatHousingEquipment(housingEquipment: IEquipmentMeter): HousingEquipmentType {
    const equipmentOption = equipmentsOptions.find((option) => option.name === housingEquipment.equipment.name)

    return {
        ...housingEquipment,
        id: housingEquipment.equipmentId,
        housingEquipmentId: housingEquipment.id,
        name: housingEquipment.equipment.name,
        equipmentTitle: equipmentOption?.labelTitle,
        iconComponent: equipmentOption?.iconComponent,
        allowedType: housingEquipment.equipment.allowedType,
        number: housingEquipment.equipmentNumber,
        isNumber: mappingEquipmentNameToType[housingEquipment.equipment.name as equipmentNameType] === 'number',
        measurementModes: housingEquipment.equipment.measurementModes,
        customerId: housingEquipment.equipment.customerId,
    }
}

/**
 * Filters a list of housing equipments by allowed equipment types and formats them into a standardized format.
 *
 * @param housingEquipments The list of housing equipments to be filtered and formatted.
 * @returns A list of formatted housing equipment objects.
 */
export const filterAndFormathousingEquipments = (
    housingEquipments: IEquipmentMeter[] | null,
): HousingEquipmentType[] => {
    if (!housingEquipments?.length) return []
    return orderListBy(
        housingEquipments
            .filter(isAllowedEquipmentType)
            .map(formatHousingEquipment)
            .filter((equipments) => equipments.number && (equipments.isNumber || equipments.customerId)),
        (item) => item.equipmentLabel || item.name,
    )
}
