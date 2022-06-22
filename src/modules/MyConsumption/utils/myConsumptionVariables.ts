import dayjs from 'dayjs'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
/**
 * Function to get range.
 *
 * @param rangePeriod Period for range.
 * @returns Object with range data.
 */
const getRange = (rangePeriod: dayjs.ManipulateType) => {
    return {
        from: dayjs().subtract(1, rangePeriod).startOf('day').toDate().toISOString(),
        to: dayjs().startOf('day').toDate().toISOString(),
    }
}
/**
 * Data Consumption Period.
 */
export const dataConsumptionPeriod = [
    {
        name: 'Jour',
        interval: '1min',
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
        interval: '1m',
        range: getRange('year'),
        period: 'yearly' as periodType,
    },
]
