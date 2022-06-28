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
const getRange = (rangePeriod: dayjs.ManipulateType, operation: 'substract' | 'add' = 'subtract', toDate?: Date | string) => {
    return {
    from: dayjs(toDate ? toDate : Date.now()).subtract(1, rangePeriod).startOf('day').toDate().toISOString(),
    to: dayjs(toDate ? toDate : Date.now()).startOf('day').toDate().toISOString(),
    }
    }
/**
 * Data Consumption Period.
 */
export const dataConsumptionPeriod = [
    {
        name: 'Jour',
        interval: '2min',
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
        interval: '1 month',
        period: 'yearly' as periodType,
    },
]
