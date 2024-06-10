import { chunk, filter, zip } from 'lodash'
import { API_RESOURCES_URL } from 'src/configs'
import { SelectForm } from 'src/modules/MyHouse/utils/MyHouseCommonTypes.d'
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
