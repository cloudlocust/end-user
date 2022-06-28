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
} from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { IMyConsumptionDatePicker, periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useTheme } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import 'src/modules/MyConsumption/components/MyConsumptionDatePicker/MyConsumptionDatePicker.scss'
import { getRange, getRangeFns, isInvalidDate } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
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
export const MyConsumptionDatePicker = ({ period, setRange }: IMyConsumptionDatePicker) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const isFutureDate = differenceInCalendarDays(currentDate, new Date()) >= 0
    const theme = useTheme()

    // If invalid date is selected, then today's date is set
    useEffect(() => {
        if (isInvalidDate(currentDate)) setCurrentDate(new Date())
    }, [currentDate])
    // If a future date is selected, then today's date is set
    useEffect(() => {
        isFutureDate && setCurrentDate(new Date())
    }, [isFutureDate])
    /**
     * SetCurrentPeriodDate.
     *
     * @param periodToChange Substract or add the specified years, months, weeks from/to the current date.
     * @returns The date from which the data is shown.
     */
    const setCurrentPeriodDate = useCallback(
        (periodToChange: (date: number | Date, amount: number) => Date) => {
            return periodToChange(currentDate, 1)
        },
        [currentDate],
    )
    /**
     * Set calendar changes the value of the current date according to the selected period.
     *
     * @param period Selected period.
     * @param arrowName Name of the clicked arrow.
     */
    const setCalendar = (period: periodType, arrowName: string) => {
        const subData = arrowName === 'sub'
        /**
         * SetCalendarData function based on argument values.
         *
         * @param sub Subtract the specified years, months, weeks, days from the given date.
         * @param add Add the specified years, months, weeks, days to the given date.
         */
        const setCalendarData = (
            sub: (date: number | Date, amount: number) => Date,
            add: (date: number | Date, amount: number) => Date,
        ) => {
            setCurrentDate(setCurrentPeriodDate(subData ? sub : add))
        }
        switch (period) {
            case 'daily':
                setCalendarData(subDays, addDays)
                break
            case 'weekly':
                setCalendarData(subWeeks, addWeeks)
                break
            case 'monthly':
                setCalendarData(subMonths, addMonths)
                break
            case 'yearly':
                setCalendarData(subYears, addYears)
                break
        }
    }
    // console.log('Days,add ', getRangeFns('years', new Date(), 'sub'))
    // console.log('days,sub ', getRangeFns('days', currentDate, 'sub'))
    console.log('days,add ', getRangeFns(period))
    // console.log('days1,add ', getRangeFns('days', new Date(2022, 5, 27, 17, 20, 0), 'add'))
    // console.log('weeks,add ', getRangeFns('weeks', currentDate, 'sub'))
    /**
     * SetRangeFrom function sets the date according to the selected period until which the range will exist.
     *
     * @param period Selected period.
     * @returns According to the selected period setRangeFrom sets the value from which data should be shown.
     */
    // const setRangeFrom = (period: periodType) => {
    //     switch (period) {
    //         case 'daily':
    //             return getRange('day', 'add', currentDate)
    //         // return setCurrenteriodDate(subDays)
    //         case 'weekly':P
    //             return getRange('week', 'sub', currentDate)
    //         // return setCurrentPeriodDate(subWeeks)
    //         case 'monthly':
    //             return getRange('month', 'add', currentDate)
    //         // return setCurrentPeriodDate(subMonths)
    //         case 'yearly':
    //             return getRange('year', 'add', currentDate)
    //         // return setCurrentPeriodDate(subYears)
    //     }
    // }
    // console.log('')
    // [setCurrentPeriodDate],

    // /**
    //  * Get range function.
    //  *
    //  * @param period Selected period.
    //  * @returns Object with formatted range.
    //  */
    // const getRange = useCallback(
    //     (period: periodType) => {
    //         return {
    //             from: setRangeFrom(period).toISOString(),
    //             to: currentDate.toISOString(),
    //         }
    //     },
    //     [currentDate, setRangeFrom],
    // )

    useEffect(() => {
        setRange(getRange(period))
    }, [period, setRange])

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
            <Tooltip title="Previous">
                <IconButton
                    aria-label="Previous"
                    onClick={() => {
                        // setCalendar(period, 'sub')
                        setRange(getRange(period, 'sub'))
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
                        // setCalendar(period, 'add')
                        setRange(getRange(period, 'add'))
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
