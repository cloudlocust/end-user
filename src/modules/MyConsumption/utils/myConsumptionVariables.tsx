import { periodValue } from 'src/modules/MyConsumption/myConsumptionTypes'
/**
 * Data Consumption Period.
 */
export const dataConsumptionPeriod = [
    {
        name: 'Jour',
        interval: '1min',
        period: 1 as periodValue,
    },
    {
        name: 'Semaine',
        interval: '1d',
        period: 7 as periodValue,
    },
    {
        name: 'Mois',
        interval: '1d',
        period: 30 as periodValue,
    },

    {
        name: 'Année',
        interval: '1m',
        period: 365 as periodValue,
    },
]
