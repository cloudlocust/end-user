import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { motion } from 'framer-motion'
import { subDays, addDays, differenceInCalendarDays } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { IMyConsumptionDatePicker, ViewsType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useTheme } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import 'src/modules/MyConsumption/components/MyConsumptionDatePicker/MyConsumptionDatePicker.scss'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import TextField from '@mui/material/TextField'
import DateFnsUtils from '@date-io/date-fns'
import { fr } from 'date-fns/locale'
import { useIntl } from 'src/common/react-platform-translation'
import { mobileDatePickerPeriodProps } from 'src/modules/MyConsumption/utils/myConsumptionVariables'

/**
 * MyConsumptionDatePicker component.
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
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const [buttonAction, setButtonAction] = useState({ sub: false, add: false })
    const isFutureDate = differenceInCalendarDays(currentDate, new Date()) >= 0
    useEffect(() => {
        if (buttonAction.sub) {
            period === 'daily' ? setCurrentDate(subDays(new Date(range.from), 1)) : setCurrentDate(new Date(range.from))
            setButtonAction({ sub: false, add: false })
        }
        if (buttonAction.add) {
            period === 'daily' ? setCurrentDate(addDays(new Date(range.to), 1)) : setCurrentDate(new Date(range.to))
            setButtonAction({ sub: false, add: false })
        }
    }, [buttonAction, period, range])

    useEffect(() => {
        setRange(getRange(period, currentDate))
    }, [currentDate, period, setRange])

    // If a future date is selected, then today's date is set
    useEffect(() => {
        isFutureDate && setCurrentDate(new Date())
    }, [isFutureDate])

    /**
     * Handle data change.
     *
     * @param newDate New Date to set.
     */
    const handleDateChange = (newDate: Date | null) => {
        newDate && setCurrentDate(newDate)
    }

    return (
        <motion.div
            className="flex items-center justify-center wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
            <Tooltip title="Previous">
                <IconButton
                    aria-label="Previous"
                    onClick={() => {
                        setRange(getRange(period, currentDate, 'sub'))
                        setButtonAction({ sub: true, add: false })
                    }}
                    size="large"
                    style={{ color: theme.palette.primary.contrastText }}
                >
                    <Icon>chevron_left </Icon>
                </IconButton>
            </Tooltip>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr} utils={DateFnsUtils}>
                {mobileDatePickerPeriodProps.map(
                    (item) =>
                        item.period === period && (
                            <MobileDatePicker
                                views={item.views as ViewsType[]}
                                value={currentDate}
                                inputFormat={item.inputFormat}
                                maxDate={new Date()}
                                onChange={handleDateChange}
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
            <Tooltip title="Next">
                <IconButton
                    aria-label="Next"
                    onClick={() => {
                        setRange(getRange(period, currentDate, 'add'))
                        setButtonAction({ sub: false, add: true })
                    }}
                    size="large"
                    disabled={isFutureDate}
                    style={{
                        color: isFutureDate ? theme.palette.grey[500] : theme.palette.primary.contrastText,
                    }}
                >
                    <Icon>chevron_right</Icon>
                </IconButton>
            </Tooltip>
        </motion.div>
    )
}
export default MyConsumptionDatePicker
