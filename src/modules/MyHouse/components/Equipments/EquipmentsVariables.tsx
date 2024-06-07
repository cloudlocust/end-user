import { Theme } from '@mui/material'
import { equipmentAllowedTypeT, equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { EquipmentIcon } from 'src/modules/MyHouse/components/Equipments/EquipmentIcon'
import { EquipmentOptionsType } from 'src/modules/MyHouse/utils/MyHouseCommonTypes'

/**
 * List of equipment types that are allowed to be displayed.
 */
export const ALLOWED_EQUIPMENT_TYPES: equipmentAllowedTypeT[] = ['existant', 'electricity']

/**
 * Equipment Name type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const mappingEquipmentNameToType: { [key in equipmentNameType]: 'number' | 'type' } = {
    heater: 'type',
    sanitary: 'type',
    hotplate: 'type',
    tv: 'number',
    vacuum: 'number',
    oven: 'number',
    microwave: 'number',
    fridge: 'number',
    dishwasher: 'number',
    washingmachine: 'number',
    dryer: 'number',
    laptop: 'number',
    desktopcomputer: 'number',
    solarpanel: 'type',
    freezer: 'number',
    kettle: 'number',
    coffee_machine: 'number',
    swimmingpool: 'number',
    heatpump: 'number',
    reversible_heatpump: 'number',
    swimmingpool_heatpump: 'number',
    electric_car: 'number',
    aquarium: 'number',
    ceramic_hob: 'number',
    iron_plate: 'number',
    induction_plate: 'number',
    radiator: 'number',
    air_conditioner: 'number',
    dry_towel: 'number',
    water_heater: 'number',
}

/**
 * Mapping equipment name to frontend labels.
 */
export const mapppingEquipmentToLabel = {
    tv: 'Téléviseur',
    vacuum: 'Aspirateur',
    oven: 'Four',
    microwave: 'Micro-onde',
    fridge: 'Réfrigérateur',
    dishwasher: 'Lave-vaisselle',
    washingmachine: 'Lave linge',
    dryer: 'Sèche linge',
    laptop: 'PC Portable',
    desktopcomputer: 'PC de bureau',
    freezer: 'Congélateur',
    kettle: 'Bouilloire',
    coffee_machine: 'Cafetière',
    swimmingpool: 'Piscine',
    heatpump: 'Pompe à chaleur',
    reversible_heatpump: 'Pompe à chaleur réversible',
    swimmingpool_heatpump: 'Pompe à chaleur de piscine',
    electric_car: 'Voiture électrique',
    aquarium: 'Aquarium',
    ceramic_hob: 'Plaque vitrocéramique',
    iron_plate: 'Plaque électrique',
    induction_plate: 'Plaque à induction',
    radiator: 'Radiateur',
    air_conditioner: 'Climatiseur',
    dry_towel: 'Sèche serviette',
    water_heater: 'Chauffe eau',
    // Other doesn't exisit in the backend. It's just used for frontend purpose.
    // To display the option "Autre" when creating a custom equipment.
    other: 'Autre',
} as { [key in equipmentNameType]?: string }

// TODO: check the utility of `disableDecrement` property, it's not needed, so it should be removed.
// eslint-disable-next-line jsdoc/require-jsdoc
export const equipmentsOptions: EquipmentOptionsType[] = [
    {
        name: 'desktopcomputer',
        labelTitle: 'PC de bureau',
        equipmentName: 'desktopcomputer',
        disableDecrement: true,
    },
    {
        name: 'laptop',
        labelTitle: 'PC Portable',
        equipmentName: 'laptop',
        disableDecrement: true,
    },
    {
        name: 'tv',
        labelTitle: 'Téléviseur',
        equipmentName: 'tv',
        disableDecrement: true,
    },
    {
        name: 'vacuum',
        labelTitle: 'Aspirateur',
        equipmentName: 'vacuum',
        disableDecrement: true,
    },
    {
        name: 'oven',
        labelTitle: 'Four',
        equipmentName: 'oven',
        disableDecrement: true,
    },
    {
        name: 'microwave',
        labelTitle: 'Micro-onde',
        equipmentName: 'microwave',
        disableDecrement: true,
    },
    {
        name: 'fridge',
        labelTitle: 'Réfrigérateur',
        equipmentName: 'fridge',
        disableDecrement: true,
    },
    {
        name: 'dishwasher',
        labelTitle: 'Lave-vaisselle',
        equipmentName: 'dishwasher',
        disableDecrement: true,
    },
    {
        name: 'washingmachine',
        labelTitle: 'Lave linge',
        equipmentName: 'washingmachine',
        disableDecrement: true,
    },
    {
        name: 'dryer',
        labelTitle: 'Sèche linge',
        equipmentName: 'dryer',
        disableDecrement: true,
    },
    {
        name: 'solarpanel',
        labelTitle: 'Panneaux solaire',
        equipmentName: 'solarpanel',
        disableDecrement: false,
    },
    {
        name: 'freezer',
        labelTitle: 'Congélateur',
        equipmentName: 'freezer',
        disableDecrement: true,
    },
    {
        name: 'kettle',
        labelTitle: 'Bouilloire',
        equipmentName: 'kettle',
        disableDecrement: true,
    },
    {
        name: 'coffee_machine',
        labelTitle: 'Machine à café',
        equipmentName: 'coffee_machine',
        disableDecrement: true,
    },
    {
        name: 'swimmingpool',
        labelTitle: 'Piscine',
        equipmentName: 'swimmingpool',
        disableDecrement: true,
    },
    {
        name: 'heatpump',
        labelTitle: 'Pompe à chaleur',
        equipmentName: 'heatpump',
        disableDecrement: true,
    },
    {
        name: 'reversible_heatpump',
        labelTitle: 'Pompe à chaleur réversible',
        equipmentName: 'reversible_heatpump',
        disableDecrement: true,
    },
    {
        name: 'swimmingpool_heatpump',
        labelTitle: 'Pompe à chaleur de piscine',
        equipmentName: 'swimmingpool_heatpump',
        disableDecrement: true,
    },
    {
        name: 'electric_car',
        labelTitle: 'Voiture électrique',
        equipmentName: 'electric_car',
        disableDecrement: true,
    },
    {
        name: 'aquarium',
        labelTitle: 'Aquarium',
        equipmentName: 'aquarium',
        disableDecrement: true,
    },
    {
        name: 'ceramic_hob',
        labelTitle: 'Plaque vitrocéramique',
        equipmentName: 'ceramic_hob',
        disableDecrement: true,
    },
    {
        name: 'iron_plate',
        labelTitle: 'Plaque électrique',
        equipmentName: 'iron_plate',
        disableDecrement: true,
    },
    {
        name: 'induction_plate',
        labelTitle: 'Plaque à induction',
        equipmentName: 'induction_plate',
        disableDecrement: true,
    },
    {
        name: 'radiator',
        labelTitle: 'Radiateur',
        equipmentName: 'radiator',
        disableDecrement: true,
    },
    {
        name: 'air_conditioner',
        labelTitle: 'Climatiseur',
        equipmentName: 'air_conditioner',
        disableDecrement: true,
    },
    {
        name: 'dry_towel',
        labelTitle: 'Sèche serviette',
        equipmentName: 'dry_towel',
        disableDecrement: true,
    },
    {
        name: 'water_heater',
        labelTitle: 'Chauffe eau',
        equipmentName: 'water_heater',
        disableDecrement: true,
    },
].map((equipmentOptions) => ({
    name: equipmentOptions.name,
    labelTitle: equipmentOptions.labelTitle,
    disableDecrement: equipmentOptions.disableDecrement,
    // eslint-disable-next-line jsdoc/require-jsdoc
    iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
        <EquipmentIcon
            equipmentName={equipmentOptions.equipmentName as equipmentNameType}
            theme={theme}
            isDisabled={isDisabled}
            fill={fill}
        />
    ),
}))
