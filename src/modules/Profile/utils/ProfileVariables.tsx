import { INumberFieldForm } from 'src/common/ui-kit/components/NumberField/NumberFieldTypes'
import { ISelectButtons } from 'src/common/ui-kit/form-fields/SelectButtons/SelectButtonsTypes'
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
// eslint-disable-next-line jsdoc/require-jsdoc
const getEquipmentIconPath = (name: string) => `/assets/images/content/equipment/${name}.svg`

// eslint-disable-next-line jsdoc/require-jsdoc
export const heatingEquipment: ISelectButtons = {
    name: 'heating',
    wrapperStyles,
    titleLabel: 'Type de chauffage :',
    formOptions: [
        {
            label: 'Eléctricité',
            iconPath: getEquipmentIconPath('heatingElectricity'),
            buttonStyle,
            iconStyles,
            value: 'electricity',
        },
        {
            label: 'Autre',
            iconPath: getEquipmentIconPath('heatingOther'),
            buttonStyle: buttonStyleLast,
            iconStyles,
            value: 'other',
        },
    ],
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const hotPlatesEquipment: ISelectButtons = {
    name: 'hotplates',
    wrapperStyles,
    titleLabel: 'Type de chauffage :',
    formOptions: [
        {
            label: 'Eléctricité',
            iconPath: getEquipmentIconPath('hotplatesElectricity'),
            buttonStyle,
            iconStyles,
            value: 'electricity',
        },
        {
            label: 'Induction',
            iconPath: getEquipmentIconPath('hotplatesInduction'),
            buttonStyle,
            iconStyles,
            value: 'induction',
        },
        {
            label: 'Autre',
            iconPath: getEquipmentIconPath('hotplatesOther'),
            buttonStyle: buttonStyleLast,
            iconStyles,
            value: 'other',
        },
    ],
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const myEquipmentOptions: INumberFieldForm[] = [
    {
        name: 'computer',
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
        name: 'television',
        labelTitle: 'Téléviseur',
        iconLabel: 'tv',
        disableDecrement: true,
    },
    {
        name: 'aspirator',
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
    { name: 'Réfrigérateur', labelTitle: 'Réfrigérateur', iconLabel: 'kitchen', disableDecrement: true },
    {
        name: 'dishwasher',
        labelTitle: 'Lave-vaisselle',
        disableDecrement: true,
        // eslint-disable-next-line jsdoc/require-jsdoc
        get iconPath() {
            return getEquipmentIconPath(this.name)
        },
    },
    {
        name: 'washingMachine',
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
