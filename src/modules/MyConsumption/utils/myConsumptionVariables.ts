import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'

/**
 * Data Consumption Period.
 */
export const dataConsumptionPeriod = [
    {
        name: 'Jour',
        interval: '2min',
        range: getRange('day'),
        period: 'daily' as periodType,
    },
    {
        name: 'Semaine',
        interval: '1d',
        range: getRange('week'),
        period: 'weekly' as periodType,
    },
    {
        name: 'Mois',
        interval: '1d',
        range: getRange('month'),
        period: 'monthly' as periodType,
    },

    {
        name: 'Année',
        interval: '1 month',
        range: getRange('year'),
        period: 'yearly' as periodType,
    },
]
