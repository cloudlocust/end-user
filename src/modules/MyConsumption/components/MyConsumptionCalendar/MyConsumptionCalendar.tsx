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
import { periodValueType } from 'src/modules/Metrics/Metrics'
import { IMyConsumptionCalendar } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useTheme } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import 'src/modules/MyConsumption/components/MyConsumptionCalendar/MyConsumptonCalendar.scss'
import { isInvalidDate, setDatePickerData } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
/**
 * MyConsumptionCalendar component.
 *
 * @param root0 N/A.
 * @param root0.period Period range.
 * @param root0.setRange SetRange function.
 * @returns MyConsumptionCalendar.
 */
const MyConsumptionCalendar = ({ period, setRange }: IMyConsumptionCalendar) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const isFutureDate = differenceInCalendarDays(currentDate, new Date()) >= 0
    const theme = useTheme()

    // If invalid date is selected, then today's date is set
    useEffect(() => {
        if (isInvalidDate(currentDate)) setCurrentDate(new Date())
    }, [currentDate])

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
    const setCalendar = (period: periodValueType, arrowName: string) => {
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
            case 1:
                setCalendarData(subDays, addDays)
                break
            case 7:
                setCalendarData(subWeeks, addWeeks)
                break
            case 30:
                setCalendarData(subMonths, addMonths)
                break
            case 365:
                setCalendarData(subYears, addYears)
                break
        }
    }
    /**
     * SetRangeFrom function sets the date according to the selected period until which the range will exist.
     *
     * @param period Selected period.
     * @returns According to the selected period setRangeFrom sets the value from which data should be shown.
     */
    const setRangeFrom = useCallback(
        (period: periodValueType) => {
            switch (period) {
                case 1:
                    return setCurrentPeriodDate(subDays)
                case 7:
                    return setCurrentPeriodDate(subWeeks)
                case 30:
                    return setCurrentPeriodDate(subMonths)
                case 365:
                    return setCurrentPeriodDate(subYears)
            }
        },
        [setCurrentPeriodDate],
    )
    /**
     * Get range function.
     *
     * @param period Selected period.
     * @returns Object with formatted range.
     */
    const getRange = useCallback(
        (period: periodValueType) => {
            return {
                from: setRangeFrom(period).toISOString(),
                to: currentDate.toISOString(),
            }
        },
        [currentDate, setRangeFrom],
    )

    useEffect(() => {
        setRange(getRange(period))
    }, [getRange, period, setRange])

    /**
     * Handle data change.
     *
     * @param newDate New Date to set.
     */
    const handleDateChange = (newDate: Date | null) => {
        newDate && setCurrentDate(newDate)
    }
    /**
     * Set Date Picker fuction sets DatePicker according to the selected period.
     *
     * @param period Selected period.
     * @returns DatePicker.
     */
    const setDatePicker = (period: periodValueType) => {
        switch (period) {
            case 1:
            case 7:
                return setDatePickerData(
                    ['day'],
                    currentDate,
                    handleDateChange,
                    { color: theme.palette.primary.contrastText, width: '80px' },
                    'dd/MM/yyyy',
                )
            case 30:
                return setDatePickerData(
                    ['month', 'year'],
                    currentDate,
                    handleDateChange,
                    { color: theme.palette.primary.contrastText, width: '55px' },
                    'MM/yyyy',
                )
            case 365:
                return setDatePickerData(
                    ['year'],
                    currentDate,
                    handleDateChange,
                    { color: theme.palette.primary.contrastText, width: '40px' },
                    'yyyy',
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
                        setCalendar(period, 'sub')
                        setRange(getRange(period))
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
                        setCalendar(period, 'add')
                        setRange(getRange(period))
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

export default MyConsumptionCalendar
