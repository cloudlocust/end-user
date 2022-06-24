import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import dayjs from 'dayjs'
/**
 * Function to get range.
 *
 * @param rangePeriod Period for range.
 * @returns Object with range data.
 */
export const getRange = (rangePeriod: dayjs.ManipulateType) => {
    const fromDay = dayjs().subtract(1, rangePeriod)

    return {
        from: fromDay.startOf('day').toDate().toISOString(),
        /**
         * When rangePeriod is day then the end of date is the end of the same day ie: 23:59.
         */
        to:
            rangePeriod === 'day'
                ? fromDay.endOf('day').toDate().toISOString()
                : dayjs().subtract(1, 'day').startOf('day').toDate().toISOString(),
    }
}
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
