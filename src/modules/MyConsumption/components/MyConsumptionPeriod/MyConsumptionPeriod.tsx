import { useTheme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useState } from 'react'
import Box from '@mui/material/Box'
import { dataConsumptionPeriod } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { IMyConsumptionPeriod } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getDateWithTimezoneOffset, getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
/**
 * MyConsumptionPeriod Component.
 *
 * @param param0 N/A.
 * @param param0.setPeriod SetPeriod function.
 * @param param0.setRange SetRange function.
 * @param param0.setMetricsInterval SetMetricsInterval function.
 * @param param0.range Period to range.
 * @returns  MyConsumptionPeriod.
 */
export const MyConsumptionPeriod = ({ setRange, setPeriod, setMetricsInterval, range }: IMyConsumptionPeriod) => {
    const theme = useTheme()
    const [tabValue, setTabValue] = useState(0)

    return (
        <div className="flex flex-row items-center">
            <Tabs
                value={tabValue}
                onChange={(_event, value) => {
                    setTabValue(value)
                    setRange(
                        getRange(
                            dataConsumptionPeriod[value].period,
                            // Because range is already in local time and ISO String, we convert from string to Date without applying local time.
                            getDateWithTimezoneOffset(range.to),
                        ),
                    )
                    setMetricsInterval(dataConsumptionPeriod[value].interval)
                    setPeriod(dataConsumptionPeriod[value].period)
                }}
                indicatorColor="secondary"
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
                        <Box sx={{ bgcolor: theme.palette.secondary.main }} className="w-full h-full rounded-full " />
                    ),
                }}
            >
                {dataConsumptionPeriod.map((item) => (
                    <Tab
                        key={item.name}
                        className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 capitalize opacity-50"
                        disableRipple
                        label={item.name}
                        sx={{
                            color: theme.palette.primary.contrastText,
                            zIndex: 1,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: '35px',
                            '&.Mui-selected': {
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                            },
                        }}
                    />
                ))}
            </Tabs>
        </div>
    )
}
