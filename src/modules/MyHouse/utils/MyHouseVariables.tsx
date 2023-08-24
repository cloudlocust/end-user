import { chunk, filter, zip } from 'lodash'
import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import { ISelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtonsTypes'
import { equipmentNameType } from 'src/modules/MyHouse/components/Equipments/EquipmentsType'
import { SvgIcon } from '@mui/material'
import { ReactComponent as ElectricityIcon } from 'src/assets/images/content/housing/Electricity.svg'
import { ReactComponent as OtherIcon } from 'src/assets/images/content/housing/Other.svg'
import { ReactComponent as GazIcon } from 'src/assets/images/content/housing/Gaz.svg'
import { ReactComponent as InductionIcon } from 'src/assets/images/content/housing/Induction.svg'
import { ReactComponent as VitroceramicIcon } from 'src/assets/images/content/housing/Vitroceramic.svg'

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

const buttonStyleLast = 'w-160 mt-16 flex flex-col'
const buttonStyle = `${buttonStyleLast} mr-10`
const wrapperStyles = 'flex flex-row justify-center'
const iconStyles = 'my-5 h-56'
const customSvgIconsStyling = {
    marginTop: '5px',
    marginBottom: '5px',
    height: '56px',
    width: '56px',
}

// Just for that eslint does scream at us about the duplication
const ELECTRICITY_LABEL = 'Eléctricité'

// eslint-disable-next-line jsdoc/require-jsdoc
const getEquipmentIconPath = (name: string) => `./assets/images/content/equipment/${name}.svg`

// eslint-disable-next-line jsdoc/require-jsdoc
export const heaterEquipment: ISelectButtons = {
    name: 'heater',
    wrapperStyles,
    titleLabel: 'Type de chauffage :',
    formOptions: [
        {
            label: ELECTRICITY_LABEL,
            buttonStyle,
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <ElectricityIcon />
                </SvgIcon>
            ),
            iconStyles,
            value: 'electricity',
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
            label: ELECTRICITY_LABEL,
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <ElectricityIcon />
                </SvgIcon>
            ),
            buttonStyle,
            iconStyles,
            value: 'electricity',
        },
        {
            label: 'Gaz',
            icon: (
                <SvgIcon sx={customSvgIconsStyling}>
                    <GazIcon />
                </SvgIcon>
            ),
            buttonStyle,
            iconStyles,
            value: 'gaz',
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
    wrapperStyles,
    titleLabel: 'Type de plaques de cuisson :',
    formOptions: [
        {
            label: ELECTRICITY_LABEL,
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
export const myEquipmentOptions: INumberFieldForm[] = [
    {
        name: 'desktopcomputer',
        labelTitle: 'PC de bureau',
        iconLabel: 'computer',
        disableDecrement: true,
    },
    {
        name: 'laptop',
        labelTitle: 'PC Portable',
        iconLabel: 'computer',
        disableDecrement: true,
    },
    {
        name: 'tv',
        labelTitle: 'Téléviseur',
        iconLabel: 'tv',
        disableDecrement: true,
    },
    {
        name: 'vacuum',
        labelTitle: 'Aspirateur',
        // eslint-disable-next-line jsdoc/require-jsdoc
        get iconPath() {
            return getEquipmentIconPath(this.name)
        },
        disableDecrement: true,
    },
    {
        name: 'oven',
        labelTitle: 'Four',
        // eslint-disable-next-line jsdoc/require-jsdoc
        get iconPath() {
            return getEquipmentIconPath(this.name)
        },
        disableDecrement: true,
    },
    { name: 'microwave', labelTitle: 'Micro-onde', iconLabel: 'microwave', disableDecrement: true },
    { name: 'fridge', labelTitle: 'Réfrigérateur', iconLabel: 'kitchen', disableDecrement: true },
    {
        name: 'dishwasher',
        labelTitle: 'Lave-vaisselle',
        // eslint-disable-next-line jsdoc/require-jsdoc
        get iconPath() {
            return getEquipmentIconPath(this.name)
        },
        disableDecrement: true,
    },
    {
        name: 'washingmachine',
        labelTitle: 'Lave linge',
        // eslint-disable-next-line jsdoc/require-jsdoc
        get iconPath() {
            return getEquipmentIconPath(this.name)
        },
        disableDecrement: true,
    },
    {
        name: 'dryer',
        labelTitle: 'Sèche linge',
        // eslint-disable-next-line jsdoc/require-jsdoc
        get iconPath() {
            return getEquipmentIconPath(this.name)
        },
        disableDecrement: true,
    },
]

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
}
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
