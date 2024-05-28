import { useTheme } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import { Link } from 'react-router-dom'
import ReactApexChart from 'react-apexcharts'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { startOfDay, subDays } from 'date-fns'
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
import { FuseCard } from 'src/modules/shared/FuseCard'
import { ConsumptionAndPrice } from 'src/modules/Dashboard/DashboardConsumptionWidget/ConsumptionAndPrice'
import { ConsumptionStatisticsType } from 'src/modules/Dashboard/DashboardConsumptionWidget/DashboardConsumptionWidget'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { computeWidgetAssets } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import { ChangeTrend } from 'src/modules/Dashboard/DashboardConsumptionWidget/ChangeTrend'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { totalConsumptionUnits } from 'src/modules/MyConsumption/components/Widget/Widget'
import convert, { Unit } from 'convert-units'
import { useCurrentDayConsumption } from 'src/modules/MyConsumption/components/Widget/currentDayConsumptionHook'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
const emptyConsumptionValueUnit = { value: 0, unit: 'Wh' }
const emptyEuroValueUnit = { value: 0, unit: '€' }
const PARIS_TIMEZONE = 'Europe/Paris'

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
    const [totalDailyEuroConsumption, setTotalDailyEuroConsumption] = useState<number>(0)
    const [percentageChange, setPercentageChange] = useState<number>(0)
    const { currentDayConsumption, currentDayEuroConsumption, getCurrentDayConsumption, getCurrentDayEuroConsumption } =
        useCurrentDayConsumption(currentHousing?.id)
    const { isMetricsLoading, getMetricsWithParams } = useMetrics()

    /**
     * Calculate the total daily consumption and price for the current day.
     */
    const calculateCurrentDayConsumptionAndEuro = useCallback(async () => {
        const currentTime = utcToZonedTime(new Date(), PARIS_TIMEZONE)
        const todayRange = {
            from: getDateWithoutTimezoneOffset(startOfDay(currentTime)),
            to: getDateWithoutTimezoneOffset(currentTime),
        }

        const todayDataInterval1m = await getMetricsWithParams(
            {
                interval: '1m',
                range: todayRange,
                targets: [metricTargetsEnum.consumption, metricTargetsEnum.eurosConsumption],
                filters: formatMetricFilter(currentHousing!.id) ?? [],
            },
            false,
        )

        if (currentDayConsumption !== null) {
            const { value, unit } = consumptionWattUnitConversion(currentDayConsumption!)
            setTotalDailyConsumption({ value, unit })
        } else {
            const { value, unit } = !todayDataInterval1m?.length
                ? emptyConsumptionValueUnit
                : computeWidgetAssets(todayDataInterval1m, metricTargetsEnum.consumption)
            setTotalDailyConsumption({
                value,
                unit: unit as totalConsumptionUnits,
            })
        }

        if (currentDayEuroConsumption !== null) {
            setTotalDailyEuroConsumption(Number(currentDayEuroConsumption!.toFixed(2)))
        } else {
            const { value } = !todayDataInterval1m?.length
                ? emptyEuroValueUnit
                : computeWidgetAssets(todayDataInterval1m, metricTargetsEnum.eurosConsumption)
            setTotalDailyEuroConsumption(value)
        }
    }, [currentDayConsumption, currentDayEuroConsumption, currentHousing, getMetricsWithParams])

    /**
     * Calculate the total daily consumption for yesterday.
     */
    const calculateYesterdayConsumption = useCallback(async () => {
        const currentTime = utcToZonedTime(new Date(), PARIS_TIMEZONE)
        const yesterdaysCurrentTime = subDays(currentTime, 1)
        const yesterdayRange = {
            from: getDateWithoutTimezoneOffset(startOfDay(yesterdaysCurrentTime)),
            to: getDateWithoutTimezoneOffset(yesterdaysCurrentTime),
        }
        const yesterdayDataInterval1m = await getMetricsWithParams(
            {
                interval: '1m',
                range: yesterdayRange,
                targets: [metricTargetsEnum.consumption],
                filters: formatMetricFilter(currentHousing!.id) ?? [],
            },
            false,
        )
        return !yesterdayDataInterval1m?.length
            ? emptyConsumptionValueUnit
            : computeWidgetAssets(yesterdayDataInterval1m, metricTargetsEnum.consumption)
    }, [currentHousing, getMetricsWithParams])

    /**
     * Update the widget values.
     */
    const updateWidgetValues = useCallback(async () => {
        const currentTime = utcToZonedTime(new Date(), PARIS_TIMEZONE)
        const todayRange = {
            from: getDateWithoutTimezoneOffset(startOfDay(currentTime)),
            to: getDateWithoutTimezoneOffset(currentTime),
        }

        const todayDataInterval30m: IMetric[] = await getMetricsWithParams(
            {
                interval: '30m',
                range: todayRange,
                targets: [metricTargetsEnum.consumption],
                filters: formatMetricFilter(currentHousing!.id) ?? [],
            },
            false,
        )
        if (todayDataInterval30m?.length) {
            const { labels, serieValues } = createDataForConsumptionWidgetGraph(todayDataInterval30m)
            setLabels(labels)
            setSerieValues(serieValues)
        }

        // Calculate the total daily consumption and price for the current day
        await calculateCurrentDayConsumptionAndEuro()

        // Calculate the total daily consumption for yesterday
        const { value: yesterdayConsumptionValue, unit: yesterdayConsumptionUnit } =
            await calculateYesterdayConsumption()

        // Calculate the percentage of change compared to yesterday.
        const percentageChange = computePercentageChange(
            Number(
                convert(yesterdayConsumptionValue as number)
                    .from(yesterdayConsumptionUnit as Unit)
                    .to('Wh'),
            ),
            Number(
                convert(totalDailyConsumption.value as number)
                    .from(totalDailyConsumption.unit as Unit)
                    .to('Wh'),
            ),
        )
        setPercentageChange(percentageChange)
    }, [
        calculateCurrentDayConsumptionAndEuro,
        calculateYesterdayConsumption,
        currentHousing,
        getMetricsWithParams,
        totalDailyConsumption.unit,
        totalDailyConsumption.value,
    ])

    useEffect(() => {
        getCurrentDayConsumption()
        getCurrentDayEuroConsumption()
    }, [getCurrentDayConsumption, getCurrentDayEuroConsumption])

    useEffect(() => {
        if (currentDayConsumption !== undefined && currentDayEuroConsumption !== undefined) {
            updateWidgetValues()
        }
    }, [currentDayConsumption, currentDayEuroConsumption, updateWidgetValues])

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
                        priceValue={totalDailyEuroConsumption}
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
