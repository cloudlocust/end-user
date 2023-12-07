import { Button, CircularProgress } from '@mui/material'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { motion } from 'framer-motion'
import { Add as AddIcon } from '@mui/icons-material'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { useTheme } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import {
    IMetric,
    metricFiltersType,
    metricIntervalType,
    metricRangeType,
    metricTargetType,
} from 'src/modules/Metrics/Metrics'
import { filterMetricsData, getDefaultConsumptionTargets } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'

/**
 * MyConsumptionChartContainer Component.
 *
 * @param props N/A.
 * @param props.range Current range so that we handle the xAxis values according to period and range selected.
 * @param props.metricsInterval Boolean state to know whether the stacked option is true or false.
 * @param props.filters Consumption or production chart type.
 * @param props.isSolarProductionConsentOff Boolean indicating if solar production consent is off.
 * @param props.setRange Set Range.
 * @returns MyConsumptionChartContainer Component.
 */
const SimplifiedConsumptionChartContainer = ({
    range,
    metricsInterval,
    filters,
    isSolarProductionConsentOff,
    setRange,
}: /**
 */
{
    /**
     * Range.
     */
    range: metricRangeType
    /**
     * Metrics interval.
     */
    metricsInterval: metricIntervalType
    /**
     * Filters.
     */
    filters: metricFiltersType
    /**
     * Is production consent off.
     */
    isSolarProductionConsentOff: boolean
    /**
     * Set Range.
     */
    setRange: (range: metricRangeType) => void
}) => {
    const theme = useTheme()
    // Handling the targets makes it simpler instead of the useMetrics as it's a straightforward array of metricTargetType
    // Meanwhile the setTargets for useMetrics needs to add {type: 'timeserie'} everytime...
    const [targets, setTargets] = useState<metricTargetType[]>(
        getDefaultConsumptionTargets(isSolarProductionConsentOff),
    )
    const period = PeriodEnum.DAILY

    const { data, getMetricsWithParams, isMetricsLoading } = useMetrics({
        interval: metricsInterval,
        range: range,
        targets: [],
        filters,
    })

    const [consumptionChartData, setConsumptionChartData] = useState<IMetric[]>(data)

    // When switching to period daily, if Euros Charts or Idle charts buttons are selected, metrics should be reset.
    // This useEffect reset metrics.
    useEffect(() => {
        setTargets(getDefaultConsumptionTargets(isSolarProductionConsentOff))
    }, [isSolarProductionConsentOff])

    const getMetrics = useCallback(async () => {
        await getMetricsWithParams({ interval: metricsInterval, range, targets, filters })
    }, [getMetricsWithParams, metricsInterval, range, targets, filters])

    // Happens everytime getMetrics dependencies change, and doesn't execute when hook is instanciated.
    useEffect(() => {
        getMetrics()
    }, [getMetrics])

    // To avoid multiple rerendering and thus calculation in MyConsumptionChart, CosnumptionChartData change only once, when targets change or when the first getMetrics targets is loaded, thus avoiding to rerender when the second getMetrics is loaded with all targets which should only happen in the background.
    useEffect(() => {
        if (data.length > 0) {
            let chartData = data
            const fileteredMetricsData = filterMetricsData(chartData, period, isSolarProductionConsentOff)
            if (fileteredMetricsData) chartData = fileteredMetricsData
            setConsumptionChartData(chartData)
        } else {
            setConsumptionChartData(data)
        }
        // Only use data & targets as dependencies.
        // TODO REMOVE this exhausitve-deps due to filteredMetricsData
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, targets])

    return (
        <div className="flex flex-col justify-center my-20">
            <div className="flex flex-row justify-end mr-20">
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
                    <Button
                        className="whitespace-nowrap"
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        sx={{
                            '&:hover': {
                                backgroundColor: `${theme.palette.secondary.main}`,
                                opacity: '.7',
                            },
                        }}
                    >
                        <TypographyFormatMessage>Ajouter un label</TypographyFormatMessage>
                    </Button>
                </motion.div>
            </div>
            <div>
                <MyConsumptionDatePicker period={period} setRange={setRange} range={range} />
                {isMetricsLoading ? (
                    <div
                        className="flex h-full w-full flex-col items-center justify-center"
                        style={{ height: '320px' }}
                    >
                        <CircularProgress style={{ color: theme.palette.primary.main }} />
                    </div>
                ) : (
                    <MyConsumptionChart
                        data={consumptionChartData}
                        period={period}
                        isSolarProductionConsentOff={isSolarProductionConsentOff}
                        axisColor={theme.palette.common.black}
                    />
                )}
            </div>
        </div>
    )
}

export default SimplifiedConsumptionChartContainer
