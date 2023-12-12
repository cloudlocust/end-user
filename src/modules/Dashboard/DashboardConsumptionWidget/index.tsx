import { useTheme } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
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
    calculateTotalConsumptionAndPrice,
    createDataForConsumptionWidgetGraph,
    getApexChartOptions,
} from 'src/modules/Dashboard/DashboardConsumptionWidget/utils'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { ConsumptionAndPrice } from 'src/modules/Dashboard/DashboardConsumptionWidget/ConsumptionAndPrice'
import { ConsumptionStatisticsType } from 'src/modules/Dashboard/DashboardConsumptionWidget/DashboardConsumptionWidget'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { useConsumptionAlerts } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlertHooks'
import {
    computeWidgetAssets,
    getWidgetPreviousRange,
    getWidgetRange,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import { ChangeTrend } from 'src/modules/Dashboard/DashboardConsumptionWidget/ChangeTrend'

/**
 * Consumption widget component for the dashboard.
 *
 * @returns DashboardConsumptionWidget Component.
 */
export const DashboardConsumptionWidget = () => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { pricePerKwh } = useConsumptionAlerts(currentHousing!.id)
    const [serieValues, setSerieValues] = useState<number[]>([])
    const [labels, setLabels] = useState<string[]>([])
    const [totalDailyConsumption, setTotalDailyConsumption] = useState<ConsumptionStatisticsType>({
        value: 0,
        unit: 'Wh',
    })
    const [totalDailyPrice, setTotalDailyPrice] = useState<number>(0)
    const [percentageChange, setPercentageChange] = useState<number>(0)
    const { isMetricsLoading, getMetricsWithParams } = useMetrics()
    const METRIC_INTERVAL: '1m' | '30m' = '30m'

    const updateWidgetValues = useCallback(async () => {
        const currentTime = utcToZonedTime(new Date(), 'Etc/UTC')
        const todayRange = {
            from: getDateWithoutTimezoneOffset(startOfDay(currentTime)),
            to: getDateWithoutTimezoneOffset(currentTime),
        }
        const data: IMetric[] = await getMetricsWithParams(
            {
                interval: METRIC_INTERVAL,
                range: todayRange,
                targets: [metricTargetsEnum.consumption],
                filters: formatMetricFilter(currentHousing!.id) ?? [],
            },
            false,
        )
        if (data?.length) {
            const { labels, serieValues } = createDataForConsumptionWidgetGraph(data)
            setLabels(labels)
            setSerieValues(serieValues)

            // Calculate the total daily consumption and price
            const { totalDailyConsumption, consumptionUnit, totalDailyPrice } = calculateTotalConsumptionAndPrice(
                serieValues,
                pricePerKwh,
            )
            setTotalDailyPrice(totalDailyPrice)
            setTotalDailyConsumption({ value: totalDailyConsumption, unit: consumptionUnit })

            // TODO: Duplicate code, need to be refactored
            // Calculate the percentage of change for the consumption
            const oldData = await getMetricsWithParams(
                {
                    interval: METRIC_INTERVAL,
                    range: getWidgetPreviousRange(getWidgetRange(todayRange, 'daily'), 'daily'),
                    targets: [metricTargetsEnum.consumption],
                    filters: formatMetricFilter(currentHousing!.id) ?? [],
                },
                false,
            )
            const { value } = !data?.length ? { value: 0 } : computeWidgetAssets(data, metricTargetsEnum.consumption)
            const { value: oldDataValue } = !oldData?.length
                ? { value: 0 }
                : computeWidgetAssets(oldData, metricTargetsEnum.consumption)
            const percentageChange = computePercentageChange(oldDataValue as number, value as number)
            setPercentageChange(percentageChange)
        }
    }, [currentHousing, getMetricsWithParams, pricePerKwh])

    useEffect(() => {
        updateWidgetValues()
    }, [updateWidgetValues])

    const chartOptions = useMemo(
        () => getApexChartOptions(theme.palette.primary.main, theme.palette.primary.light, labels, METRIC_INTERVAL),
        [labels, theme.palette.primary.light, theme.palette.primary.main],
    )

    return (
        <FuseCard sx={{ height: 220 }} isLoading={isMetricsLoading} loadingColor={theme.palette.primary.main}>
            <div className="h-128 flex justify-between items-center gap-24 mx-24">
                <ConsumptionAndPrice
                    consumptionValue={totalDailyConsumption.value}
                    consumptionUnit={totalDailyConsumption.unit}
                    priceValue={totalDailyPrice}
                />

                <ChangeTrend percentageChange={percentageChange} />
            </div>
            <div className="flex flex-col flex-auto h-92">
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
        </FuseCard>
    )
}
