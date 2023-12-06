import { useTheme } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import { Link } from 'react-router-dom'
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
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import {
    calculateTotalDailyConsumptionAndPrice,
    createDataForConsumptionWidgetGraph,
} from 'src/modules/Dashboard/DashboardConsumptionWidget/utils'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'
import { ConsumptionAndPrice } from 'src/modules/Dashboard/DashboardConsumptionWidget/ConsumptionAndPrice'
import {
    DashboardConsumptionWidgetProps,
    totalDailyConsumptionType,
} from 'src/modules/Dashboard/DashboardConsumptionWidget/DashboardConsumptionWidget'
import {
    computeWidgetAssets,
    getWidgetPreviousRange,
    getWidgetRange,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import { TendanceVeille } from 'src/modules/Dashboard/DashboardConsumptionWidget/TendanceVeille'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Consumption widget component for the dashboard.
 *
 * @param root0 N/A.
 * @param root0.getMetricsWithParams Function to get Metrics.
 * @param root0.isMetricsLoading Is Metrics getting is in progress.
 * @param root0.metricInterval Metrics intervals.
 * @param root0.pricePerKwh Price per kWh.
 * @returns DashboardConsumptionWidget Component.
 */
export const DashboardConsumptionWidget = ({
    getMetricsWithParams,
    isMetricsLoading,
    metricInterval,
    pricePerKwh,
}: DashboardConsumptionWidgetProps) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const [serieValues, setSerieValues] = useState<number[]>([])
    const [labels, setLabels] = useState<string[]>([])
    const [totalDailyConsumption, setTotalDailyConsumption] = useState<totalDailyConsumptionType>({
        value: 0,
        unit: 'Wh',
    })
    const [totalDailyPrice, setTotalDailyPrice] = useState<number>(0)
    const [percentageChange, setPercentageChange] = useState<number>(0)

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

    const updateWidgetValues = useCallback(async () => {
        const currentTime = new Date()
        const range = {
            from: getDateWithoutTimezoneOffset(startOfDay(currentTime)),
            to: getDateWithoutTimezoneOffset(currentTime),
        }
        const data = await getMetricsWithParams(
            {
                interval: metricInterval,
                range,
                targets: [metricTargetsEnum.consumption],
                filters: formatMetricFilter(currentHousing?.id!),
            },
            false,
        )

        if (data.length) {
            const { labels, serieValues } = createDataForConsumptionWidgetGraph(data)
            setLabels(labels)
            setSerieValues(serieValues)

            // Calculate the total daily consumption and price
            const { totalDailyConsumption, consumptionUnit, totalDailyPrice } = calculateTotalDailyConsumptionAndPrice(
                serieValues,
                pricePerKwh,
            )
            setTotalDailyPrice(totalDailyPrice)
            setTotalDailyConsumption({ value: totalDailyConsumption, unit: consumptionUnit })

            // Calculate the percentage of change for the consumption
            const oldData = await getMetricsWithParams(
                {
                    interval: metricInterval,
                    range: getWidgetPreviousRange(getWidgetRange(range, 'daily'), 'daily'),
                    targets: [metricTargetsEnum.consumption],
                    filters: formatMetricFilter(currentHousing?.id!),
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
    }, [currentHousing?.id, getMetricsWithParams, metricInterval, pricePerKwh])

    useEffect(() => {
        updateWidgetValues()
    }, [updateWidgetValues])

    return (
        <FuseCard
            sx={{ minHeight: 280 }}
            isLoading={isMetricsLoading}
            loadingColor={theme.palette.primary.main}
            className="flex flex-col justify-between"
        >
            <div className="p-20 pb-28">
                <TypographyFormatMessage variant="h3" className="text-24 font-400 text-grey-900 mb-10">
                    Conso
                </TypographyFormatMessage>
                <div className="flex justify-between items-center gap-24">
                    <ConsumptionAndPrice
                        consumptionValue={totalDailyConsumption.value}
                        consumptionUnit={totalDailyConsumption.unit}
                        priceValue={totalDailyPrice}
                    />

                    <TendanceVeille percentageChange={percentageChange} />
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
            <div className="text-center pb-5 pt-2" style={{ backgroundColor: `${theme.palette.primary.light}23` }}>
                <Link to="/my-consumption" className="text-grey-700 underline">
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
