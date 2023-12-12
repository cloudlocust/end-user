import { useTheme } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import ReactApexChart from 'react-apexcharts'
import { useEffect, useMemo, useState } from 'react'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { startOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import {
    formatMetricFilter,
    getDateWithoutTimezoneOffset,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import {
    createDataForConsumptionWidgetGraph,
    getApexChartOptions,
} from 'src/modules/Dashboard/DashboardConsumptionWidget/utils'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'

/**
 * Consumption widget component for the dashboard.
 *
 * @returns DashboardConsumptionWidget Component.
 */
export const DashboardConsumptionWidget = () => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const currentTime = utcToZonedTime(new Date(), 'Etc/UTC')
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

    const chartOptions = useMemo(
        () => getApexChartOptions(theme.palette.primary.main, theme.palette.primary.light, labels),
        [labels, theme.palette.primary.light, theme.palette.primary.main],
    )

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
