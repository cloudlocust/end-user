import { useTheme } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import { useEffect, useState } from 'react'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { startOfDay } from 'date-fns'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import {
    formatMetricFilter,
    getDateWithoutTimezoneOffset,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { createDataForConsumptionWidgetGraph } from 'src/modules/Dashboard/WidgetConsumptionDashboard/utils'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'

/**
 * Consumption widget component for the dashboard.
 *
 * @returns WidgetConsumptionDashboard Component.
 */
export const WidgetConsumptionDashboard = () => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const currentTime = new Date()
    const filters = formatMetricFilter(currentHousing?.id!)
    const { data, isMetricsLoading } = useMetrics(
        {
            interval: '30m',
            range: {
                from: getDateWithoutTimezoneOffset(startOfDay(currentTime)),
                to: getDateWithoutTimezoneOffset(currentTime),
            },
            targets: [
                {
                    target: metricTargetsEnum.consumption,
                    type: 'timeserie',
                },
            ],
            filters,
        },
        Boolean(filters.length),
    )
    const [serieValues, setSerieValues] = useState<number[]>([])
    const [labels, setLabels] = useState<string[]>([])

    useEffect(() => {
        if (data) {
            const { labels, serieValues } = createDataForConsumptionWidgetGraph(data)
            setLabels(labels)
            setSerieValues(serieValues)
        }
    }, [data])

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
    }

    return (
        <FuseCard isLoading={isMetricsLoading} loadingColor={theme.palette.primary.main}>
            {/* This 1st div is just for add some space, it will be removed in the next PR */}
            <div className="h-128" />
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
