import { useTheme } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import { Link } from 'react-router-dom'
import ReactApexChart from 'react-apexcharts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { startOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import {
    formatMetricFilter,
    getDateWithoutTimezoneOffset,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import {
    createDataForConsumptionWidgetGraph,
    getApexChartOptions,
} from 'src/modules/Dashboard/DashboardConsumptionWidget/utils'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { ConsumptionAndPrice } from 'src/modules/Dashboard/DashboardConsumptionWidget/ConsumptionAndPrice'
import { ConsumptionStatisticsType } from 'src/modules/Dashboard/DashboardConsumptionWidget/DashboardConsumptionWidget'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { computeWidgetAssets, getWidgetRange } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import { ChangeTrend } from 'src/modules/Dashboard/DashboardConsumptionWidget/ChangeTrend'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { totalConsumptionUnits } from 'src/modules/MyConsumption/components/Widget/Widget'
const emptyConsumptionValueUnit = { value: 0, unit: 'Wh' }
const emptyEuroValueUnit = { value: 0, unit: '€' }

/**
 * Consumption widget component for the dashboard.
 *
 * @returns DashboardConsumptionWidget Component.
 */
export const DashboardConsumptionWidget = () => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const [serieValues, setSerieValues] = useState<number[]>([])
    const [labels, setLabels] = useState<string[]>([])
    const [totalDailyConsumption, setTotalDailyConsumption] = useState<ConsumptionStatisticsType>({
        value: 0,
        unit: 'Wh',
    })
    const [totalDailyPrice, setTotalDailyPrice] = useState<number>(0)
    const [percentageChange, setPercentageChange] = useState<number>(0)
    const { isMetricsLoading, getMetricsWithParams } = useMetrics()

    const updateWidgetValues = useCallback(async () => {
        const currentTime = utcToZonedTime(new Date(), 'Europe/Paris')
        const todayRange = {
            from: getDateWithoutTimezoneOffset(startOfDay(currentTime)),
            to: getDateWithoutTimezoneOffset(currentTime),
        }
        const currentDayDataInterval30m: IMetric[] = await getMetricsWithParams(
            {
                interval: '30m',
                range: todayRange,
                targets: [metricTargetsEnum.consumption],
                filters: formatMetricFilter(currentHousing!.id) ?? [],
            },
            false,
        )

        if (currentDayDataInterval30m?.length) {
            const { labels, serieValues } = createDataForConsumptionWidgetGraph(currentDayDataInterval30m)
            setLabels(labels)
            setSerieValues(serieValues)
        }

        // TODO: Duplicate code, need to be refactored
        // Calculate the total daily consumption and price
        const currentDayDataInterval1m = await getMetricsWithParams(
            {
                interval: '1m',
                range: getWidgetRange(todayRange, 'daily'),
                targets: [metricTargetsEnum.consumption, metricTargetsEnum.eurosConsumption],
                filters: formatMetricFilter(currentHousing!.id) ?? [],
            },
            false,
        )
        const { value: totalConsumptionValue, unit: totalConsumptionUnit } = !currentDayDataInterval1m?.length
            ? emptyConsumptionValueUnit
            : computeWidgetAssets(currentDayDataInterval1m, metricTargetsEnum.consumption)
        setTotalDailyConsumption({
            value: totalConsumptionValue as number,
            unit: totalConsumptionUnit as totalConsumptionUnits,
        })
        const { value: totalEurosValue } = !currentDayDataInterval1m?.length
            ? emptyEuroValueUnit
            : computeWidgetAssets(currentDayDataInterval1m, metricTargetsEnum.eurosConsumption)
        setTotalDailyPrice(totalEurosValue as number)

        // Calculate the percentage of change compared to yesterday.
        const yesterdaysCurrentTime = new Date()
        yesterdaysCurrentTime.setDate(currentTime.getDate() - 1)
        const dataFromYesterdayToCurrentTime = await getMetricsWithParams(
            {
                interval: '1m',
                range: {
                    from: getDateWithoutTimezoneOffset(yesterdaysCurrentTime),
                    to: getDateWithoutTimezoneOffset(currentTime),
                },
                targets: [metricTargetsEnum.consumption],
                filters: formatMetricFilter(currentHousing!.id) ?? [],
            },
            false,
        )
        const percentageChange = computePercentageChange(
            // The consumption value from yesterday at the same current time.
            dataFromYesterdayToCurrentTime?.at(0)?.datapoints[0][0] ?? 0,
            // The consumption value at the current time today.
            dataFromYesterdayToCurrentTime?.at(0)?.datapoints[
                (dataFromYesterdayToCurrentTime?.at(0)?.datapoints.length ?? 1) - 1
            ][0] ?? 0,
        )
        setPercentageChange(percentageChange)
    }, [currentHousing, getMetricsWithParams])

    useEffect(() => {
        updateWidgetValues()
    }, [updateWidgetValues])

    const chartOptions = useMemo(
        () => getApexChartOptions(theme.palette.primary.main, theme.palette.primary.light, labels, '30m'),
        [labels, theme.palette.primary.light, theme.palette.primary.main],
    )

    return (
        <FuseCard
            sx={{ height: isMetricsLoading ? 290 : 'auto' }}
            isLoading={isMetricsLoading}
            loadingColor={theme.palette.primary.main}
            className="flex flex-col justify-between"
        >
            <div className="p-20 pb-24 sm:pb-10">
                <TypographyFormatMessage variant="h3" className="text-16 sm:text-20 font-400 text-grey-900 mb-10">
                    Conso
                </TypographyFormatMessage>
                <div className="flex justify-between items-center gap-5 flex-wrap">
                    <ConsumptionAndPrice
                        consumptionValue={totalDailyConsumption.value}
                        consumptionUnit={totalDailyConsumption.unit}
                        priceValue={totalDailyPrice}
                    />
                    <ChangeTrend percentageChange={percentageChange} />
                </div>
            </div>
            <div className="flex flex-col flex-auto h-128">
                <ReactApexChart
                    options={chartOptions}
                    series={[
                        {
                            name: formatMessage({
                                id: 'Consommation',
                                defaultMessage: 'Consommation',
                            }),
                            data: serieValues,
                        },
                    ]}
                    type="area"
                    height="100%"
                    data-testid="apexcharts"
                />
            </div>
            <div className="text-center py-4 sm:py-5" style={{ backgroundColor: `${theme.palette.primary.light}23` }}>
                <Link to="/my-consumption" className="text-11 sm:text-13 text-grey-700 underline">
                    {formatMessage({
                        id: 'Voir ma conso du jour',
                        defaultMessage: 'Voir ma conso du jour',
                    })}
                    &nbsp;&gt;
                </Link>
            </div>
        </FuseCard>
    )
}
