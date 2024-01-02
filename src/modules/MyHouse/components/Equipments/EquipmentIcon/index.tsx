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
import { equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { EquipmentIconProps } from 'src/modules/MyHouse/components/Equipments/EquipmentIcon/equipmentIcon'
import { SolarPower as SolarPanelIcon } from '@mui/icons-material'
/**
 * Function to get icon component.
 *
 * @param equipmentName Equipment name typE.
 * @returns Equipment Icon.
 */
const getIconComponent = (equipmentName: equipmentNameType) => {
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
 * EquipmentIcon component.
 *
 * Renders an icon based on the provided equipment name.
 *
 * @param root0 N/A.
 * @param root0.equipmentName Equipment name.
 * @param root0.theme Mui Theme.
 * @param root0.isDisabled Is disabled state.
 * @param root0.fill Fill.
 * @returns EquipmentIcon component.
 */
export const EquipmentIcon = ({ equipmentName, theme, isDisabled, fill }: EquipmentIconProps) => {
    const IconComponent = getIconComponent(equipmentName)
    return (
        <IconComponent
            fill={isDisabled ? theme.palette.grey[300] : fill || theme.palette.primary.main}
            width={'35'}
            height={'35'}
        />
    )
}
