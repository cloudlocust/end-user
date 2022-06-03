import dayjs from 'dayjs'
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
    },
    {
        name: 'Semaines',
        interval: '1d',
        range: getRange('week'),
    },
    {
        name: 'Mois',
        interval: '1d',
        range: getRange('month'),
    },

    {
        name: 'Années',
        interval: '1m',
        range: getRange('year'),
    },
]
