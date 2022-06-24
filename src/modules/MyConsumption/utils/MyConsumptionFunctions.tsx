import { metricFiltersType } from 'src/modules/Metrics/Metrics'
import { getDaysInMonth } from 'date-fns'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import TextField from '@mui/material/TextField'
import { ViewsType } from 'src/modules/MyConsumption/myConsumptionTypes'
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
    ] as metricFiltersType
}
/**
 * Function verify if the current date is valid.
 *
 * @param date Current date.
 * @returns Boolean validation value.
 */
export const isInvalidDate = (date: Date) => {
    return (
        date.getDate() > getDaysInMonth(date) ||
        date.getDate() <= 0 ||
        date.getMonth() > 12 ||
        date.getMonth() <= 0 ||
        date.getFullYear() > new Date().getFullYear() ||
        date.getFullYear() < 2018
    )
}
/**
 *
 * @param views
 * @param date
 * @param inputFormat
 * @param handleDateChange
 * @returns
 */
export const setDatePickerData = (
    views: ViewsType[],
    date: Date,
    handleDateChange: (newDate: Date | null) => void,
    inputFormat?: string,
) => {
    return (
        <MobileDatePicker
            views={views}
            value={date}
            maxDate={new Date()}
            inputFormat={inputFormat}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
        />
    )
}
