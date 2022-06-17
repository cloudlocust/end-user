import dayjs from 'dayjs'
import { metricTarget } from 'src/modules/Metrics/Metrics'
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
/**
 *  Button options.
 */
export const buttonOptions = [
    { value: 'reset', label: '∅', targets: [] },
    {
        value: 'temperature',
        label: 'T°',
        targets: ['nrlink_internal_temperature_metrics', 'external_temperature_metrics'],
    },
    { value: 'Pmax', label: 'Pmax', targets: ['enedis_max_power'] },
]
/**
 * Target options.
 */
export const targetOptions: metricTarget[] = [
    'nrlink_internal_temperature_metrics',
    'external_temperature_metrics',
    'enedis_max_power',
]
