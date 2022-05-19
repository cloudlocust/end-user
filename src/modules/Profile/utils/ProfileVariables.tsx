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

/**
 *
 */
export const myEquipmentOptions = [
    { name: 'PC de bureau', labelTitle: 'PC de bureau', iconLabel: 'computer', disableDecrement: true },
    { name: 'PC Portable', labelTitle: 'PC Portable', iconLabel: 'computer', disableDecrement: true },
    { name: 'Téléviseur', labelTitle: 'Téléviseur', iconLabel: 'tv', disableDecrement: true },
    {
        name: 'Aspirateur',
        labelTitle: 'Aspirateur',
        iconPath: '/assets/images/content/equipment/aspirator.svg',
        disableDecrement: true,
        value: '',
    },
    { name: 'Four', labelTitle: 'Four', iconPath: '/assets/images/content/equipment/oven.svg', disableDecrement: true },
    { name: 'Micro-onde', labelTitle: 'Micro-onde', iconLabel: 'microwave', disableDecrement: true },
    { name: 'Réfrigérateur', labelTitle: 'Réfrigérateur', iconLabel: 'kitchen', disableDecrement: true },
    {
        name: 'Lave-vaisselle',
        labelTitle: 'Lave-vaisselle',
        iconPath: '/assets/images/content/equipment/dishwasher.svg',
        disableDecrement: true,
    },
    {
        name: 'Lave linge',
        labelTitle: 'Lave linge',
        iconPath: '/assets/images/content/equipment/washing-machine.svg',
        disableDecrement: true,
    },
    {
        name: 'Sèche linge',
        labelTitle: 'Sèche linge',
        iconPath: '/assets/images/content/equipment/clothes-dryer.svg',
        disableDecrement: true,
    },
]
