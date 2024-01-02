import { chunk, filter, zip } from 'lodash'
import { ISelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtonsTypes'
import { equipmentNameType } from 'src/modules/MyHouse/components/Installation/InstallationType.d'
import { SvgIcon, Theme } from '@mui/material'
import { ReactComponent as ElectricityIcon } from 'src/assets/images/content/housing/Electricity.svg'
import { ReactComponent as OtherIcon } from 'src/assets/images/content/housing/Other.svg'
import { ReactComponent as InductionIcon } from 'src/assets/images/content/housing/Induction.svg'
import { ReactComponent as VitroceramicIcon } from 'src/assets/images/content/housing/Vitroceramic.svg'
import { ReactComponent as FontElectrique } from 'src/assets/images/content/housing/FontElectrique.svg'
import { API_RESOURCES_URL } from 'src/configs'
import { Groups } from '@mui/icons-material'
import { EquipmentOptionsType } from 'src/modules/MyHouse/utils/MyHouseCommonTypes.d'
import { EquipmentIcon } from 'src/modules/MyHouse/components/Equipments/EquipmentIcon'

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
    before1950: 'Avant 1950',
    from1950to1975: '1950 - 1975',
    after1975: 'Après 1975',
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
    houseYear: 'houseYear',
    residenceType: 'residenceType',
    energyPerformanceIndex: 'energyPerformanceIndex',
    isolationLevel: 'isolationLevel',
    numberOfInhabitants: 'numberOfInhabitants',
    houseArea: 'houseArea',
    meterId: 'meterId',
    ownershipStatus: 'ownershipStatus',
}
/**
 * Performance options.
 */
export const performanceOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
/**
 * Isolation options.
 */
export const isolationOptions = ['Faible', 'Moyenne', 'Forte']

const buttonStyleLast = 'w-160 mt-16 mr-12 flex flex-col'
const buttonStyle = `${buttonStyleLast}`
const wrapperStyles = 'flex flex-row justify-center'
const iconStyles = 'my-5 h-56'
const customSvgIconsStyling = {
    marginTop: '5px',
    marginBottom: '5px',
    height: '56px',
    width: '56px',
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const heaterEquipment: ISelectButtons = {
    name: 'heater',
    wrapperStyles,
    titleLabel: 'Type de chauffage :',
    formOptions: [
        {
            label: 'Collectif',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <Groups />
                </SvgIcon>
            ),
            buttonStyle: buttonStyleLast,
            iconStyles,
            value: 'collective',
        },
        {
            label: 'Individuel Electrique',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <ElectricityIcon />
                </SvgIcon>
            ),
            buttonStyle: buttonStyleLast,
            iconStyles,
            value: 'individual',
        },
        {
            label: 'Autre',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <OtherIcon />
                </SvgIcon>
            ),
            buttonStyle: buttonStyleLast,
            iconStyles,
            value: 'other',
        },
    ],
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const sanitaryEquipment: ISelectButtons = {
    name: 'sanitary',
    wrapperStyles,
    titleLabel: 'Eau chaude sanitaire :',
    formOptions: [
        {
            label: 'Collectif',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <Groups />
                </SvgIcon>
            ),
            buttonStyle: buttonStyleLast,
            iconStyles,
            value: 'collective',
        },
        {
            label: 'Individuel Electrique',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <ElectricityIcon />
                </SvgIcon>
            ),
            buttonStyle: buttonStyleLast,
            iconStyles,
            value: 'individual',
        },
        {
            label: 'Autre',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <OtherIcon />
                </SvgIcon>
            ),
            buttonStyle: buttonStyleLast,
            iconStyles,
            value: 'other',
        },
    ],
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const hotPlateEquipment: ISelectButtons = {
    name: 'hotplate',
    wrapperStyles: `${wrapperStyles} flex-wrap`,
    titleLabel: 'Type de plaques de cuisson :',
    formOptions: [
        {
            label: 'Induction',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <InductionIcon />
                </SvgIcon>
            ),
            buttonStyle,
            iconStyles,
            value: 'induction',
        },
        {
            label: 'Électrique (fonte)',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <FontElectrique />
                </SvgIcon>
            ),
            buttonStyle,
            iconStyles,
            value: 'electricity',
        },
        {
            label: 'Vitrocéramique',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <VitroceramicIcon />
                </SvgIcon>
            ),
            buttonStyle,
            iconStyles,
            value: 'vitroceramic',
        },
        {
            label: 'Autre',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <OtherIcon />
                </SvgIcon>
            ),
            buttonStyle: buttonStyleLast,
            iconStyles,
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
    freezer: 'Refrigirateur',
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
