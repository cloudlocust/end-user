import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import { motion } from 'framer-motion'
import { differenceInCalendarDays, subDays, addDays } from 'date-fns'
import { IMyConsumptionDatePicker, ViewsType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useTheme } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import 'src/modules/MyConsumption/components/MyConsumptionDatePicker/MyConsumptionDatePicker.scss'
import { getDateWithTimezoneOffset, getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import TextField from '@mui/material/TextField'
import DateFnsUtils from '@date-io/date-fns'
import { fr } from 'date-fns/locale'
import { useIntl } from 'src/common/react-platform-translation'
import { mobileDatePickerPeriodProps } from 'src/modules/MyConsumption/utils/myConsumptionVariables'

/**
 * MyConsumptionDatePicker component allows the user to select a new date and use
 * the right and left buttons to trigger the range change for all the consumption container.
 *
 * @param root0 N/A.
 * @param root0.period Period range.
 * @param root0.setRange SetRange function.
 * @param root0.range Range data.
 * @returns MyConsumptionDatePicker.
 */
const MyConsumptionDatePicker = ({ period, setRange, range }: IMyConsumptionDatePicker) => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const rangeDateFormat = {
        from: getDateWithTimezoneOffset(range.from),
        // Because range is already in local time and ISO String, we convert from string to Date without applying local time.
        to: getDateWithTimezoneOffset(range.to),
    }

    const isFutureDate = differenceInCalendarDays(rangeDateFormat.to, new Date()) >= 0
    /**
     * Handle data change.
     *
     * @param newDate New Date to set.
     */
    const handleDateChange = (newDate: Date | null) => {
        if (newDate) setRange(getRange(period, newDate, 'sub'))
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
        operator: 'add' | 'sub',
    ) => {
        const toDate = period === 'daily' ? calculateDays(date, 1) : date
        setRange(getRange(period, toDate, operator))
    }

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
                style={{ color: theme.palette.primary.contrastText }}
            >
                <Icon>chevron_left </Icon>
            </IconButton>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr} utils={DateFnsUtils}>
                {mobileDatePickerPeriodProps.map(
                    (item) =>
                        item.period === period && (
                            <MobileDatePicker
                                views={item.views as ViewsType[]}
                                value={rangeDateFormat.to}
                                inputFormat={item.inputFormat}
                                maxDate={new Date()}
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
                                            input: { color: theme.palette.primary.contrastText, width: item.width },
                                        }}
                                    />
                                )}
                            />
                        ),
                )}
            </LocalizationProvider>
            <IconButton
                aria-label="Next"
                onClick={() => handleClick(addDays, rangeDateFormat.to, 'add')}
                size="large"
                disabled={isFutureDate}
                style={{
                    color: isFutureDate ? theme.palette.grey[500] : theme.palette.primary.contrastText,
                }}
            >
                <Icon>chevron_right</Icon>
            </IconButton>
        </motion.div>
    )
}
export default MyConsumptionDatePicker
