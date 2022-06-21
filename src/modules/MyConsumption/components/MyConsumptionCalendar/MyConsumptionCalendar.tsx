import Icon from '@mui/material/Icon'
import { styled, ThemeProvider } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// import { selectMainThemeDark } from 'app/store/fuse/settingsSlice'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import {
    formatDistance,
    subDays,
    format,
    subWeeks,
    subMonths,
    subYears,
    addDays,
    addWeeks,
    addYears,
    addMonths,
} from 'date-fns'

import { useState } from 'react'

function CalendarHeader({ period }: any) {
    const getCurrentDate = () => {
        // eslint-disable-next-line sonarjs/no-duplicate-string
        return new Date()
    }
    const [currentDate, setCurrentDate] = useState(getCurrentDate())
    const subCalendar = (period: any) => {
        switch (period) {
            case 1:
                setCurrentDate(subDays(currentDate, 1))
                break
            case 7:
                setCurrentDate(subWeeks(currentDate, 1))
                break
            case 30:
                setCurrentDate(subMonths(currentDate, 1))
                break
            case 365:
                setCurrentDate(subYears(currentDate, 1))
                break
        }
    }
    const addCalendar = (period: any) => {
        switch (period) {
            case 1:
                setCurrentDate(addDays(currentDate, 1))
                break
            case 7:
                setCurrentDate(addWeeks(currentDate, 1))
                break
            case 30:
                setCurrentDate(addMonths(currentDate, 1))
                break
            case 365:
                setCurrentDate(addYears(currentDate, 1))
                break
        }
    }
    return (
        // <ThemeProvider theme={mainThemeDark}>
        <div>
            <div className="flex flex-1 flex-col p-12 justify-between z-10 container">
                <motion.div
                    className="flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.3 } }}
                >
                    <Tooltip title="Previous">
                        <IconButton
                            aria-label="Previous"
                            onClick={() => {
                                subCalendar(period)
                            }}
                            size="large"
                        >
                            {/* <Icon>{mainThemeDark.direction === 'ltr' ? 'chevron_left' : 'chevron_right'}</Icon> */}
                            <Icon>chevron_left </Icon>
                        </IconButton>
                    </Tooltip>
                    <Typography>{format(currentDate, 'dd/MM/yyyy')}</Typography>
                    <Tooltip title="Next">
                        <IconButton
                            aria-label="Next"
                            onClick={() => {
                                addCalendar(period)
                            }}
                            size="large"
                        >
                            <Icon>chevron_right</Icon>
                        </IconButton>
                    </Tooltip>
                </motion.div>
            </div>
        </div>
    )
}

export default CalendarHeader
