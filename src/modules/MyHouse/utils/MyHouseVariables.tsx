import { chunk, filter, zip } from 'lodash'
import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import { ISelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtonsTypes'
import { equipmentNameType } from 'src/modules/MyHouse/components/Equipments/EquipmentsType'
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

// TODO - Channge this icons on the newer version.

// eslint-disable-next-line jsdoc/require-jsdoc
const getEquipmentIconPath = (name: string) => `/assets/images/content/equipment/${name}.svg`

// eslint-disable-next-line jsdoc/require-jsdoc
export const heaterEquipment: ISelectButtons = {
    name: 'heater',
    wrapperStyles,
    titleLabel: 'Type de chauffage :',
    formOptions: [
        {
            label: 'Eléctricité',
            iconPath: getEquipmentIconPath('electricity'),
            buttonStyle,
            iconStyles,
            value: 'electricity',
        },
        {
            label: 'Autre',
            iconPath: getEquipmentIconPath('heaterOther'),
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
            label: 'Eléctricité',
            iconPath: getEquipmentIconPath('electricity'),
            buttonStyle,
            iconStyles,
            value: 'electricity',
        },
        {
            label: 'Gaz',
            // TODO - Change the icon to gaz in new version.
            iconPath: getEquipmentIconPath('electricity'),
            buttonStyle,
            iconStyles,
            value: 'gaz',
        },
        {
            label: 'Autre',
            iconPath: getEquipmentIconPath('heaterOther'),
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
            label: 'Vitrocéramique',
            iconPath: getEquipmentIconPath('vitroceramic'),
            buttonStyle,
            iconStyles,
            value: 'vitroceramic',
        },
        {
            label: 'Induction',
            iconPath: getEquipmentIconPath('induction'),
            buttonStyle,
            iconStyles,
            value: 'induction',
        },
        {
            label: 'Autre',
            iconPath: getEquipmentIconPath('hotplateOther'),
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
