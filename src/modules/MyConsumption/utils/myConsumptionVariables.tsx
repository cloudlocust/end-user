import dayjs from 'dayjs'
import { periodValue } from 'src/modules/MyConsumption/myConsumptionTypes'
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
        period: 1 as periodValue,
    },
    {
        name: 'Semaine',
        interval: '1d',
        range: getRange('week'),
        period: 7 as periodValue,
    },
    {
        name: 'Mois',
        interval: '1d',
        range: getRange('month'),
        period: 30 as periodValue,
    },

    {
        name: 'Année',
        interval: '1m',
        range: getRange('year'),
        period: 365 as periodValue,
    },
]
