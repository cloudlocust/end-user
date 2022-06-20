import dayjs from 'dayjs'
import { periodValueType } from 'src/modules/MyConsumption/myConsumptionTypes'
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
        period: 'daily' as periodValueType,
    },
    {
        name: 'Semaine',
        interval: '1d',
        range: getRange('week'),
        period: 'weekly' as periodValueType,
    },
    {
        name: 'Mois',
        interval: '1d',
        range: getRange('month'),
        period: 'monthly' as periodValueType,
    },

    {
        name: 'Année',
        interval: '1m',
        range: getRange('year'),
        period: 'yearly' as periodValueType,
    },
]
