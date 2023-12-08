import { useTheme } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useCallback, useEffect, useState } from 'react'
import { startOfDay } from 'date-fns'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import {
    convertConsumptionToWatt,
    formatMetricFilter,
    getDateWithoutTimezoneOffset,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import {
    calculateTotalDailyConsumptionAndPrice,
    createDataForConsumptionWidgetGraph,
} from 'src/modules/Dashboard/DashboardConsumptionWidget/utils'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { ConsumptionAndPrice } from 'src/modules/Dashboard/DashboardConsumptionWidget/ConsumptionAndPrice'
import { totalDailyConsumptionType } from 'src/modules/Dashboard/DashboardConsumptionWidget/DashboardConsumptionWidget'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { useConsumptionAlerts } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlertHooks'

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
    const [totalDailyConsumption, setTotalDailyConsumption] = useState<totalDailyConsumptionType>({
        value: 0,
        unit: 'Wh',
    })
    const [totalDailyPrice, setTotalDailyPrice] = useState<number>(0)
    const metricInterval = '30m'
    const { isMetricsLoading, getMetricsWithParams } = useMetrics()

    const updateWidgetValues = useCallback(async () => {
        const currentTime = new Date()
        const data: IMetric[] = await getMetricsWithParams({
            interval: metricInterval,
            range: {
                from: getDateWithoutTimezoneOffset(startOfDay(currentTime)),
                to: getDateWithoutTimezoneOffset(currentTime),
            },
            targets: [metricTargetsEnum.consumption],
            filters: formatMetricFilter(currentHousing!.id) ?? [],
        })
        if (data?.length) {
            const { labels, serieValues } = createDataForConsumptionWidgetGraph(data)
            setLabels(labels)
            setSerieValues(serieValues)
            const { totalDailyConsumption, consumptionUnit, totalDailyPrice } = calculateTotalDailyConsumptionAndPrice(
                serieValues,
                pricePerKwh,
            )
            setTotalDailyPrice(totalDailyPrice)
            setTotalDailyConsumption({ value: totalDailyConsumption, unit: consumptionUnit })
        }
    }, [currentHousing, getMetricsWithParams, pricePerKwh])

    useEffect(() => {
        updateWidgetValues()
    }, [updateWidgetValues])

    const chartOptions: ApexOptions = {
        chart: {
            animations: {
                enabled: false,
            },
            fontFamily: 'inherit',
            foreColor: 'inherit',
            height: '100%',
            type: 'area',
            sparkline: {
                enabled: true,
            },
        },
        colors: [theme.palette.primary.main],
        fill: {
            colors: [theme.palette.primary.light],
            opacity: 0.5,
        },
        stroke: {
            curve: 'smooth',
        },
        tooltip: {
            followCursor: true,
            theme: 'dark',
        },
        xaxis: {
            type: 'category',
            categories: labels,
        },
        yaxis: {
            show: false,
            labels: {
                /**
                 * Function to converts consumption from Wh to Watt.
                 *
                 * @param serieValue Consumption value in Wh.
                 * @returns Consumption value in Watt.
                 */
                formatter: (serieValue) => convertConsumptionToWatt(serieValue, false, metricInterval),
            },
        },
    }

    return (
        <FuseCard sx={{ height: 220 }} isLoading={isMetricsLoading} loadingColor={theme.palette.primary.main}>
            <div className="h-128 flex items-center mx-24">
                <ConsumptionAndPrice
                    consumptionValue={totalDailyConsumption.value}
                    consumptionUnit={totalDailyConsumption.unit}
                    priceValue={totalDailyPrice}
                />
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
