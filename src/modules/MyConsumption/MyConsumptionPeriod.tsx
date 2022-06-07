import { useTheme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { dataConsumptionPeriod } from './utils/myConsumptionVariables'
import { IMyConsumptionPeriod } from './myConsumptionTypes'
/**
 * MyConsumptionPeriod Component.
 *
 * @param param0 N/A.
 * @param param0.onHandleMetricsChange OnHandleMetricsChange function.
 * @param param0.setPeriodValue SetPeriodValue function.
 * @returns  MyConsumptionPeriod.
 */
export const MyConsumptionPeriod = ({ onHandleMetricsChange, setPeriodValue }: IMyConsumptionPeriod) => {
    const theme = useTheme()
    const [tabValue, setTabValue] = useState(0)
    return (
        <div
            className="flex flex-row items-center"
            style={{
                backgroundColor: theme.palette.primary.main,
            }}
        >
            <Tabs
                value={tabValue}
                onChange={(event, value) => {
                    setTabValue(value)
                    onHandleMetricsChange(dataConsumptionPeriod[value].interval, dataConsumptionPeriod[value].range)
                    setPeriodValue(dataConsumptionPeriod[value].period)
                }}
                indicatorColor="primary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons={false}
                className="w-full px-24 -mx-4 min-h-40"
                classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                TabIndicatorProps={{
                    children: (
                        <Box sx={{ bgcolor: theme.palette.primary.dark }} className="w-full h-full rounded-full " />
                    ),
                }}
            >
                {dataConsumptionPeriod.map((item) => (
                    <Tab
                        key={item.name}
                        className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 capitalize opacity-60"
                        disableRipple
                        label={item.name}
                        style={{ color: theme.palette.background.paper, zIndex: 1 }}
                    />
                ))}
            </Tabs>
        </div>
    )
}
