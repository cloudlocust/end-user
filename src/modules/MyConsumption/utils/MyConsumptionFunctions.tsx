import { metricFiltersType } from 'src/modules/Metrics/Metrics'
import { getDaysInMonth } from 'date-fns'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import TextField from '@mui/material/TextField'
import { IInputStyles, ViewsType } from 'src/modules/MyConsumption/myConsumptionTypes'
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
        date.getFullYear() < 2000
    )
}
/**
 * Set date picker.
 *
 * @param views Available views.
 * @param date Current date.
 * @param handleDateChange Handle Date Change function.
 * @param inputStyles Input styles.
 * @param inputFormat Input date format.
 * @returns Date picker.
 */
export const setDatePickerData = (
    views: ViewsType[],
    date: Date,
    handleDateChange: (newDate: Date | null) => void,
    inputStyles: IInputStyles,
    inputFormat: string,
) => {
    return (
        <MobileDatePicker
            views={views}
            value={date}
            maxDate={new Date()}
            inputFormat={inputFormat}
            onChange={handleDateChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    sx={{
                        input: inputStyles,
                    }}
                />
            )}
        />
    )
}
