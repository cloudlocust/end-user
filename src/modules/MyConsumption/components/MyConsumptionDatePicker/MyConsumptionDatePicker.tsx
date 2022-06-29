import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { motion } from 'framer-motion'
import {
    subDays,
    subWeeks,
    subMonths,
    subYears,
    addDays,
    addWeeks,
    addYears,
    addMonths,
    differenceInCalendarDays,
    startOfYesterday,
} from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { IMyConsumptionDatePicker, periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useTheme } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import 'src/modules/MyConsumption/components/MyConsumptionDatePicker/MyConsumptionDatePicker.scss'
import { getRange, isInvalidDate } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import TextField from '@mui/material/TextField'
/**
 * MyConsumptionDatePicker component.
 *
 * @param root0 N/A.
 * @param root0.period Period range.
 * @param root0.setRange SetRange function.
 * @returns MyConsumptionDatePicker.
 */
export const MyConsumptionDatePicker = ({ period, setRange, range }: IMyConsumptionDatePicker) => {
    const theme = useTheme()
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
        setRange(getRange(period))
    }, [period, setRange])
    console.log('RANGE', new Date(range.from), new Date(range.to))
    // If invalid date is selected, then today's date is set
    useEffect(() => {
        if (isInvalidDate(currentDate)) setCurrentDate(new Date())
    }, [currentDate])
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
    // console.log(setRangeFrom(period))
    /**
     * Set Date Picker fuction sets DatePicker according to the selected period.
     *
     * @param period Selected period.
     * @returns DatePicker.
     */
    const setDatePicker = (period: periodType) => {
        switch (period) {
            case 'daily':
            case 'weekly':
                return (
                    <MobileDatePicker
                        views={['day']}
                        value={currentDate}
                        inputFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                        onAccept={handleDateChange}
                        // eslint-disable-next-line no-console
                        onChange={() => console.log('')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                sx={{
                                    input: { color: theme.palette.primary.contrastText, width: '80px' },
                                }}
                            />
                        )}
                    />
                )
            case 'monthly':
                return (
                    <MobileDatePicker
                        views={['month', 'year']}
                        value={currentDate}
                        inputFormat="MM/yyyy"
                        maxDate={new Date()}
                        onChange={() => console.log('')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                sx={{
                                    input: { color: theme.palette.primary.contrastText, width: '55px' },
                                }}
                            />
                        )}
                    />
                )
            case 'yearly':
                return (
                    <MobileDatePicker
                        views={['year']}
                        value={currentDate}
                        // inputFormat="MM/yyyy"
                        maxDate={new Date()}
                        onChange={() => console.log('')}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                sx={{
                                    input: { color: theme.palette.primary.contrastText, width: '40px' },
                                }}
                            />
                        )}
                    />
                )
        }
    }
    return (
        <motion.div
            className="flex items-center justify-center wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
        >
            {/* <div>{currentDate}</div> */}
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>{setDatePicker(period)} </LocalizationProvider>
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
        // <div>hu</div>
    )
}
