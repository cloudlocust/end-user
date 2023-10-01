import { useTheme } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import {
    dataConsumptionPeriod,
    dataConsumptionPeriodValueList,
} from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { IMyConsumptionPeriod, PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { getRangeV2 } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
/**
 * MyConsumptionPeriod Component.
 *
 * @param param0 N/A.
 * @param param0.setPeriod SetPeriod function.
 * @param param0.setRange SetRange function.
 * @param param0.setMetricsInterval SetMetricsInterval function.
 * @param param0.period Current Period.
 * @returns  MyConsumptionPeriod.
 */
export const MyConsumptionPeriod = ({ setRange, setPeriod, setMetricsInterval, period }: IMyConsumptionPeriod) => {
    const theme = useTheme()

    return (
        <div className="flex flex-row items-center">
            <Tabs
                value={period}
                onChange={(_event, value) => {
                    const valueIndex = dataConsumptionPeriodValueList.indexOf(value as PeriodEnum)
                    setRange(getRangeV2(dataConsumptionPeriod[valueIndex].period))
                    setMetricsInterval(dataConsumptionPeriod[valueIndex].interval)
                    setPeriod(dataConsumptionPeriod[valueIndex].period)
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
                        value={item.period}
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
