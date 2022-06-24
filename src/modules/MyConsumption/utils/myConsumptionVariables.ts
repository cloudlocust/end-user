import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
/**
 * Data Consumption Period.
 */
export const dataConsumptionPeriod = [
    {
        name: 'Jour',
        interval: '1min',
        period: 'daily' as periodType,
    },
    {
        name: 'Semaine',
        interval: '1d',
        period: 'weekly' as periodType,
    },
    {
        name: 'Mois',
        interval: '1d',
        period: 'monthly' as periodType,
    },

    {
        name: 'Année',
        interval: '1m',
        period: 'yearly' as periodType,
    },
]
