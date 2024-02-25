import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import { motion } from 'framer-motion'
import { subDays, addDays } from 'date-fns'
import { dateFnsPeriod, IMyConsumptionDatePicker, ViewsType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useTheme } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import 'src/modules/MyConsumption/components/MyConsumptionDatePicker/MyConsumptionDatePicker.scss'
import {
    addPeriod,
    convertToDateFnsPeriod,
    getCalendarDates,
    getDateWithTimezoneOffset,
    getRangeFromDate,
    subPeriod,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import TextField from '@mui/material/TextField'
import DateFnsUtils from '@date-io/date-fns'
import { fr } from 'date-fns/locale'
import { useIntl } from 'src/common/react-platform-translation'
import { mobileDatePickerPeriodProps } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { useState } from 'react'

/**
 * MyConsumptionDatePicker component allows the user to select a new date and use
 * the right and left buttons to trigger the range change for all the consumption container.
 *
 * @param root0 N/A.
 * @param root0.period Period range.
 * @param root0.setRange SetRange function.
 * @param root0.range Range data.
 * @param root0.onDatePickerChange Callback function that overwrites the default handleDateChange for DatePicker used in MyConsumption modules.
 * @param root0.maxDate Max Date the DatePicker can go to..
 * @param root0.isPreviousButtonDisabling Use it to disable previous button.
 * @param root0.handleYears Use it to enable or disable a years in the calender.
 * @returns MyConsumptionDatePicker.
 */
const MyConsumptionDatePicker = ({
    period,
    setRange,
    range,
    onDatePickerChange,
    maxDate,
    isPreviousButtonDisabling = false,
    handleYears,
}: IMyConsumptionDatePicker) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const [isRangeLoading, setIsRangeLoading] = useState(false)

    const rangeDateFormat = {
        from: getDateWithTimezoneOffset(range.from),
        // Because range is already in local time and ISO String, we convert from string to Date without applying local time.
        to: getDateWithTimezoneOffset(range.to),
    }

    const isFutureDate = rangeDateFormat.to >= (maxDate || new Date())

    /**
     * Handle data change.
     *
     * @param newDate New Date to set.
     */
    const handleDateChange = (newDate: Date | null) => {
        if (newDate) {
            if (onDatePickerChange) onDatePickerChange(newDate)
            else {
                setRange(getRangeFromDate(newDate, period))
            }
        }
    }

    /**
     * Handle the click on next and previous buttons in the date picker, sub will be triggered on the previous button click,
     * and add will be triggered on the next button click.
     *
     * @param calculateDays SubDays or AddDays.
     * @param date Current date.
     * @param operator Sub or add operator.
     */
    const handleClick = (
        calculateDays: (date: number | Date, amount: number) => Date,
        date: Date,
        operator: 'add' | 'sub' | 'none',
    ) => {
        setIsRangeLoading(true)
        setTimeout(() => setIsRangeLoading(false), 1500) // This will reset  disabled state of the arrows
        const toDate = period === 'daily' ? calculateDays(date, 1) : date
        if (onDatePickerChange) {
            onDatePickerChange(
                operator === 'sub'
                    ? subPeriod(toDate, convertToDateFnsPeriod(period) as dateFnsPeriod)
                    : addPeriod(toDate, convertToDateFnsPeriod(period) as dateFnsPeriod),
            )
        } else {
            setRange(getCalendarDates(range, operator, period))
        }
    }

    const disablePreviousButton = isPreviousButtonDisabling || isRangeLoading

    return (
        <motion.div
            className="flex items-center justify-center wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
            <IconButton
                aria-label="Previous"
                onClick={() => handleClick(subDays, rangeDateFormat.from, 'sub')}
                size="large"
                style={{ color: disablePreviousButton ? theme.palette.grey[600] : theme.palette.common.white }}
                disabled={disablePreviousButton}
            >
                <Icon>chevron_left </Icon>
            </IconButton>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr} utils={DateFnsUtils}>
                {mobileDatePickerPeriodProps.map(
                    (item) =>
                        item.period === period && (
                            <MobileDatePicker
                                date-testid="date-picker"
                                views={item.views as ViewsType[]}
                                value={rangeDateFormat.from}
                                inputFormat={item.inputFormat}
                                maxDate={
                                    maxDate || subPeriod(new Date(), convertToDateFnsPeriod(period) as dateFnsPeriod)
                                }
                                onChange={() => {
                                    return null
                                }}
                                onAccept={handleDateChange}
                                cancelText={formatMessage({ id: 'Annuler', defaultMessage: 'Annuler' })}
                                toolbarTitle={null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        sx={{
                                            input: {
                                                color: theme.palette.common.white,
                                                textAlign: 'center',
                                                width: item.width,
                                                fontSize: '1.6rem',
                                            },
                                        }}
                                    />
                                )}
                                {...(handleYears && { shouldDisableYear: handleYears })}
                            />
                        ),
                )}
            </LocalizationProvider>
            <IconButton
                aria-label="Next"
                onClick={() => handleClick(addDays, rangeDateFormat.to, 'add')}
                size="large"
                disabled={isFutureDate || isRangeLoading}
                style={{
                    color: isFutureDate || isRangeLoading ? theme.palette.grey[600] : theme.palette.common.white,
                }}
            >
                <Icon>chevron_right</Icon>
            </IconButton>
        </motion.div>
    )
}
export default MyConsumptionDatePicker
