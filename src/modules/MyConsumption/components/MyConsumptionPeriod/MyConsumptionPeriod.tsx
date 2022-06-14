import { useTheme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { dataConsumptionPeriod } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { IMyConsumptionPeriod } from 'src/modules/MyConsumption/myConsumptionTypes'
/**
 * MyConsumptionPeriod Component.
 *
 * @param param0 N/A.
 * @param param0.setPeriodValue SetPeriodValue function.
 * @param param0.setRange SetRange function.
 * @param param0.setPeriod SetPeriod function.
 * @returns  MyConsumptionPeriod.
 */
export const MyConsumptionPeriod = ({ setRange, setPeriod, setPeriodValue }: IMyConsumptionPeriod) => {
    const theme = useTheme()
    const [tabValue, setTabValue] = useState(0)
    return (
        <div className="flex flex-row items-center">
            <Tabs
                value={tabValue}
                onChange={(event, value) => {
                    setTabValue(value)
                    setRange(dataConsumptionPeriod[value].range)
                    setPeriod(dataConsumptionPeriod[value].interval)
                    setPeriodValue(dataConsumptionPeriod[value].period)
                }}
                indicatorColor="primary"
                textColor="inherit"
                variant="scrollable"
                scrollButtons={false}
                className="w-full mx-4 min-h-40"
                classes={{
                    indicator: 'flex justify-center bg-transparent w-full h-full  ',
                    flexContainer: 'flex justify-center',
                }}
                TabIndicatorProps={{
                    children: (
                        <Box sx={{ bgcolor: theme.palette.primary.dark }} className="w-full h-full rounded-full " />
                    ),
                }}
            >
                {dataConsumptionPeriod.map((item) => (
                    <Tab
                        key={item.name}
                        className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 capitalize opacity-50"
                        disableRipple
                        label={item.name}
                        style={{
                            color: theme.palette.background.paper,
                            zIndex: 1,
                            backgroundColor: theme.palette.primary.dark,
                            borderRadius: '35px',
                        }}
                    />
                ))}
            </Tabs>
        </div>
    )
}
