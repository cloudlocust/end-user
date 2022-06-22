import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { motion } from 'framer-motion'
import {
    subDays,
    format,
    subWeeks,
    subMonths,
    subYears,
    addDays,
    addWeeks,
    addYears,
    addMonths,
    differenceInCalendarDays,
} from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { periodValueType } from 'src/modules/Metrics/Metrics'
import { IMyConsumptionCalendar } from 'src/modules/MyConsumption/myConsumptionTypes'
import _ from 'lodash'
/**
 * MyConsumptionCalendar component.
 *
 * @param root0 N/A.
 * @param root0.period Period range.
 * @param root0.setRange SetRange function.
 * @returns MyConsumptionCalendar.
 */
const MyConsumptionCalendar = ({ period, setRange }: IMyConsumptionCalendar) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const isFutureDate = differenceInCalendarDays(currentDate, new Date()) >= 0
    useEffect(() => {
        isFutureDate && setCurrentDate(new Date())
    }, [isFutureDate])
    /**
     * SetCurrentPeriodDate.
     *
     * @param periodToChange
     * @returns
     */
    const setCurrentPeriodDate = useCallback(
        (periodToChange: (date: number | Date, amount: number) => Date) => {
            return periodToChange(currentDate, 1)
        },
        [currentDate],
    )
    /**
     *
     * @param period
     * @param arrowName
     */
    const setCalendar = (period: any, arrowName: string) => {
        const subData = arrowName === 'sub'
        switch (period) {
            case 1:
                setCurrentDate(setCurrentPeriodDate(subData ? subDays : addDays))
                break
            case 7:
                setCurrentDate(setCurrentPeriodDate(subData ? subWeeks : addWeeks))
                break
            case 30:
                setCurrentDate(setCurrentPeriodDate(subData ? subMonths : addMonths))
                break
            case 365:
                setCurrentDate(setCurrentPeriodDate(subData ? subYears : addYears))
                break
        }
    }
    /**
     * SetRangeFrom function sets the date according to the selected period until which the range will exist.
     *
     * @param period
     * @returns
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
     *
     * @param period
     * @returns
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
        console.log(getRange(period))
    }, [getRange, period, setRange])
    return (
        <div>
            <div className="flex flex-col justify-between z-10 container">
                <motion.div
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.3 } }}
                >
                    <Tooltip title="Previous">
                        <IconButton
                            aria-label="Previous"
                            onClick={() => {
                                console.log(getRange(period))
                                setCalendar(period, 'sub')
                                setRange(getRange(period))
                            }}
                            size="large"
                        >
                            <Icon>chevron_left </Icon>
                        </IconButton>
                    </Tooltip>
                    <Typography>{format(currentDate, 'dd/MM/yyyy')}</Typography>
                    <Tooltip title="Next">
                        <IconButton
                            aria-label="Next"
                            onClick={() => {
                                console.log(getRange(period))
                                setCalendar(period, 'add')
                                setRange(getRange(period))
                            }}
                            size="large"
                            disabled={isFutureDate}
                        >
                            <Icon>chevron_right</Icon>
                        </IconButton>
                    </Tooltip>
                </motion.div>
            </div>
        </div>
    )
}

export default MyConsumptionCalendar
