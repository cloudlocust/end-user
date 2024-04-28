import { chunk, filter, zip } from 'lodash'
import { equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType.d'
import { Theme } from '@mui/material'
import { API_RESOURCES_URL } from 'src/configs'
import { EquipmentOptionsType, SelectForm } from 'src/modules/MyHouse/utils/MyHouseCommonTypes.d'
import { EquipmentIcon } from 'src/modules/MyHouse/components/Equipments/EquipmentIcon'
import { FormattedMessage } from 'src/common/react-platform-translation'

/**
 * Access rights url.
 *
 * @param housingId The housingId of the rights we want to get.
 * @returns Access rights base url.
 */
export const ACCESS_RIGHTS_API = (housingId: number) => `${API_RESOURCES_URL}/access-rights/${housingId}`

/**
 * Accomodation labels.
 */
export const accomodationLabelOptions = {
    house: 'Maison',
    apartment: 'Appartement',
    main: 'Principale',
    secondary: 'Secondaire',
    energeticPerformance: 'Performance énergétique',
    isolation: 'Estimation isolation',
    tenant: 'Locataire',
    owner: 'Propriétaire',
}
/**
 * Accomodation names.
 */
export const accomodationNames = {
    houseType: 'houseType',
    houseLocation: 'houseLocation',
    numberOfLevels: 'numberOfLevels',
    houseYear: 'houseYear',
    residenceType: 'residenceType',
    energyPerformanceIndex: 'energyPerformanceIndex',
    isolationLevel: 'isolationLevel',
    numberOfInhabitants: 'numberOfInhabitants',
    houseArea: 'houseArea',
    numberOfWindows: 'numberOfWindows',
    isGlazedWindows: 'isGlazedWindows',
    meterId: 'meterId',
    ownershipStatus: 'ownershipStatus',
}
/**
 * Number of levels options.
 */
export const numberOfLevelsOptions = [
    {
        label: '1 niveau',
        value: 1,
    },
    {
        label: '2 niveaux',
        value: 2,
    },
    {
        label: '3 niveaux',
        value: 3,
    },
]
/**
 * House location options.
 */
export const houseLocationOptions = [
    {
        label: 'Isolée',
        value: 'isolated',
    },
    {
        label: 'Mitoyenne 1 côté',
        value: 'one_sided_attached_house',
    },
    {
        label: 'Mitoyenne 2 côtés',
        value: 'two_sided_attached_house',
    },
]
/**
 * House year options.
 */
export const houseYearOptions = [
    {
        label: 'Ne sais pas',
        value: 'Do_not_know',
    },
    {
        label: 'Avant 1950',
        value: 'Avant_1950',
    },
    {
        label: '1950 - 1975',
        value: 'Entre_1950_1975',
    },
    {
        label: '1976 - 1995',
        value: 'Entre_1976_1995',
    },
    {
        label: '1996 - 2005',
        value: 'Entre_1996_2005',
    },
    {
        label: 'Après 2005',
        value: 'Apres_2005',
    },
]
/**
 * Performance options.
 */
export const performanceOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
/**
 * Isolation options.
 */
export const isolationOptions = ['Faible', 'Moyenne', 'Forte']

/**
 * Heater options.
 */
export const heaterEquipment: SelectForm = {
    name: 'heater',

    titleLabel: <FormattedMessage id="Type" defaultMessage="Type" />,
    formOptions: [
        {
            label: <FormattedMessage id="Électricité" defaultMessage="Électricité" />,
            value: 'electricity',
        },
        {
            label: <FormattedMessage id="Gaz" defaultMessage="Gaz" />,
            value: 'gas',
        },
        {
            label: <FormattedMessage id="Collectif" defaultMessage="Collectif" />,
            value: 'collective',
        },
        {
            label: <FormattedMessage id="Propane en citerne" defaultMessage="Propane en citerne" />,
            value: 'propane_tank',
        },
        {
            label: <FormattedMessage id="Fioul en cuve" defaultMessage="Fioul en cuve" />,
            value: 'fuel_oil_tank',
        },
        {
            label: <FormattedMessage id="Poêle à granulés" defaultMessage="Poêle à granulés" />,
            value: 'pellet_stove',
        },
        {
            label: <FormattedMessage id="Cheminée" defaultMessage="Cheminée" />,
            value: 'chimney',
        },
        {
            label: <FormattedMessage id="Pompe à chaleur" defaultMessage="Pompe à chaleur" />,
            value: 'heat_pump',
        },
        {
            label: <FormattedMessage id="Autre" defaultMessage="Autre" />,
            value: 'other',
        },
    ],
}

/**
 * Sanitary options.
 */
export const sanitaryEquipment: SelectForm = {
    name: 'sanitary',
    titleLabel: <FormattedMessage id="Type" defaultMessage="Type" />,
    formOptions: [
        {
            label: <FormattedMessage id="Électricité" defaultMessage="Électricité" />,
            value: 'electricity',
        },
        {
            label: <FormattedMessage id="Gaz" defaultMessage="Gaz" />,
            value: 'gas',
        },
        {
            label: <FormattedMessage id="Collectif" defaultMessage="Collectif" />,
            value: 'collective',
        },
        {
            label: <FormattedMessage id="Chauffe-eau solaire" defaultMessage="Chauffe-eau solaire" />,
            value: 'solar',
        },
        {
            label: <FormattedMessage id="Chauffe-eau thermodynamique" defaultMessage="Chauffe-eau thermodynamique" />,
            value: 'thermodynamic',
        },
        {
            label: <FormattedMessage id="Propane en citerne" defaultMessage="Propane en citerne" />,
            value: 'propane_tank',
        },
        {
            label: <FormattedMessage id="Fioul en cuve" defaultMessage="Fioul en cuve" />,
            value: 'fuel_oil_tank',
        },
        {
            label: <FormattedMessage id="Autre" defaultMessage="Autre" />,
            value: 'other',
        },
    ],
}

/**
 * Hotplate options.
 */
export const hotPlateEquipment: SelectForm = {
    name: 'hotplate',
    titleLabel: <FormattedMessage id="Type" defaultMessage="Type" />,
    formOptions: [
        {
            label: <FormattedMessage id="Électricité" defaultMessage="Électricité" />,
            value: 'electricity',
        },
        {
            label: <FormattedMessage id="Gaz" defaultMessage="Gaz" />,
            value: 'gas',
        },
        {
            label: <FormattedMessage id="Gaz en bouteille" defaultMessage="Gaz en bouteille" />,
            value: 'bottled_gas',
        },
        {
            label: <FormattedMessage id="Électricité & gaz" defaultMessage="Électricité & gaz" />,
            value: 'electricity_and_gaz',
        },
        {
            label: <FormattedMessage id="Vitrocéramique" defaultMessage="Vitrocéramique" />,
            value: 'vitroceramic',
        },
        {
            label: <FormattedMessage id="Induction" defaultMessage="Induction" />,
            value: 'induction',
        },
        {
            label: <FormattedMessage id="Autre" defaultMessage="Autre" />,
            value: 'other',
        },
    ],
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const myEquipmentOptions = [
    {
        name: 'desktopcomputer',
        labelTitle: 'PC de bureau',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="desktopcomputer" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'laptop',
        labelTitle: 'PC Portable',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="laptop" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'tv',
        labelTitle: 'Téléviseur',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="tv" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'vacuum',
        labelTitle: 'Aspirateur',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="vacuum" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'oven',
        labelTitle: 'Four',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="oven" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'microwave',
        labelTitle: 'Micro-onde',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="microwave" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'fridge',
        labelTitle: 'Réfrigérateur',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="fridge" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'dishwasher',
        labelTitle: 'Lave-vaisselle',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="dishwasher" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'washingmachine',
        labelTitle: 'Lave linge',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="washingmachine" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'dryer',
        labelTitle: 'Sèche linge',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="dryer" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'solarpanel',
        labelTitle: 'Panneaux solaire',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="solarpanel" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
    },
    {
        name: 'freezer',
        labelTitle: 'Congélateur',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="freezer" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'kettle',
        labelTitle: 'Bouilloire',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="kettle" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'coffee_machine',
        labelTitle: 'Machine à café',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="coffee_machine" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'swimmingpool',
        labelTitle: 'Piscine',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="swimmingpool" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'heatpump',
        labelTitle: 'Pompe à chaleur',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="heatpump" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'reversible_heatpump',
        labelTitle: 'Pompe à chaleur réversible',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="reversible_heatpump" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'swimmingpool_heatpump',
        labelTitle: 'Pompe à chaleur de piscine',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="swimmingpool_heatpump" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'electric_car',
        labelTitle: 'Voiture électrique',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="electric_car" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'aquarium',
        labelTitle: 'Aquarium',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="aquarium" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'ceramic_hob',
        labelTitle: 'Plaque vitrocéramique',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="ceramic_hob" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'iron_plate',
        labelTitle: 'Plaque électrique',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="iron_plate" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'induction_plate',
        labelTitle: 'Plaque à induction',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="induction_plate" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'radiator',
        labelTitle: 'Radiateur',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="radiator" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'air_conditioner',
        labelTitle: 'Climatiseur',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="air_conditioner" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'dry_towel',
        labelTitle: 'Sèche serviette',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="dry_towel" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
    {
        name: 'water_heater',
        labelTitle: 'Chauffe eau',
        // eslint-disable-next-line jsdoc/require-jsdoc
        iconComponent: (theme: Theme, isDisabled?: boolean, fill?: string) => (
            <EquipmentIcon equipmentName="water_heater" theme={theme} isDisabled={isDisabled} fill={fill} />
        ),
        disableDecrement: true,
    },
] as EquipmentOptionsType[]

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

/**
 * Grouped Cards for showing in flex mode.
 *
 * @param cards Cards Type.
 * @param colNumber Number of colons.
 * @returns Grouped Cards component.
 */
export function groupedCards<T>(cards: T[], colNumber = 2) {
    const chunkArray = cards && chunk(cards, colNumber)
    return zip(...chunkArray).map((item) => filter(item)) as T[][]
}

/**
 * Regex for meter guid. Accept only 14 numbers.
 */
export const meteGuidNumberRegex = /^\d{14}$/.source

/**
 * Text for meter guid regex.
 */
export const METER_GUID_REGEX_TEXT = 'Veuillez entrer votre numéro de compteur contenant exactement 14 chiffres.'
