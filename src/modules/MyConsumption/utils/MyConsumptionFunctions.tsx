import { IMeter } from 'src/modules/Meters/Meters'
import { metricFilters } from 'src/modules/Metrics/Metrics'

/**
 * FormatMetricFilter function converts the data to the required format.
 *
 * @param valueGuid Meter guid.
 * @returns Formated meter data.
 */
export const formatMetricFilter = (valueGuid: string) => {
    return [
        {
            key: 'meter_guid',
            operator: '=',
            value: valueGuid,
        },
    ] as metricFilters
}
/**
 * FormatMetricFilterList format metersList to metricFilters type.
 *
 * @param metersList Meter List to format.
 * @returns Formated meter list data.
 */
export const formatMetricFilterList = (metersList: IMeter[]) => {
    return metersList.flatMap((meter: IMeter) => {
        return formatMetricFilter(meter.guid)
    })
}
