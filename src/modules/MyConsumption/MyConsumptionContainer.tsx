import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { ConsumptionChartContainer } from 'src/modules/MyConsumption/components/MyConsumptionChart/ConsumptionChartContainer'
import {
    formatMetricFilter,
    getInitialMetricsHookValues,
    getRange,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { WidgetList } from 'src/modules/MyConsumption/components/Widget/WidgetsList'
import CircularProgress from '@mui/material/CircularProgress'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useHasMissingHousingContracts } from 'src/hooks/HasMissingHousingContracts'
import { ChartErrorMessage } from 'src/modules/MyConsumption/components/ChartErrorMessage'
import { ENPHASE_OFF_MESSAGE, NRLINK_ENEDIS_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { productionChartErrorState } from 'src/modules/MyConsumption/MyConsumptionConfig'
import { EcowattWidget } from 'src/modules/Ecowatt/EcowattWidget'
import { MissingHousingMeterErrorMessage } from './utils/ErrorMessages'

/**
 * InitialMetricsStates for useMetrics.
 *
 * ! The order of the targets matters because it set the order in which apexchart will display the graphs.
 */
export const initialMetricsHookValues: getMetricType = {
    interval: '2m',
    range: getRange('day'),
    targets: [
        {
            target: metricTargetsEnum.autoconsumption,
            type: 'timeserie',
        },
        {
            target: metricTargetsEnum.consumption,
            type: 'timeserie',
        },
        {
            target: metricTargetsEnum.eurosConsumption,
            type: 'timeserie',
        },
        {
            target: metricTargetsEnum.pMax,
            type: 'timeserie',
        },
        {
            target: metricTargetsEnum.externalTemperature,
            type: 'timeserie',
        },
        {
            target: metricTargetsEnum.internalTemperature,
            type: 'timeserie',
        },
        {
            target: metricTargetsEnum.totalProduction,
            type: 'timeserie',
        },
        {
            target: metricTargetsEnum.injectedProduction,
            type: 'timeserie',
        },
    ],
    filters: [],
}

/**
 * MyConsumptionContainer.
 * Parent component.
 *
 * @returns MyConsumptionContainer and its children.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export const MyConsumptionContainer = () => {
    const theme = useTheme()
    const { getConsents, nrlinkConsent, enedisSgeConsent, enphaseConsent } = useConsents()
    const { setMetricsInterval, setRange, setFilters, metricsInterval, isMetricsLoading, data, filters, range } =
        useMetrics(getInitialMetricsHookValues())
    // TODO Reset when consumptionChartContainer, WidgetListContainer, ProductionChartContainer is ready.
    // const [range, setRange] = useState<metricRangeType>(initialMetricsHookValues.range)
    // const [metricsInterval, setMetricsInterval] = useState<metricIntervalType>(initialMetricsHookValues.interval)
    // const [filters, setFilters] = useState<metricFiltersType>([])
    const [period, setPeriod] = useState<periodType>('daily')
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    const nrlinkOff = nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT'
    const enedisOff = enedisSgeConsent?.enedisSgeConsentState === 'NONEXISTENT'
    const enphaseOff = enphaseConsent?.enphaseConsentState !== 'ACTIVE'

    useEffect(() => {
        if (!currentHousing?.meter?.guid) return
        setFilters(formatMetricFilter(currentHousing.meter?.guid))
        setFilters(formatMetricFilter(currentHousing.meter?.guid))
    }, [currentHousing?.meter?.guid, setFilters])

    const { hasMissingHousingContracts } = useHasMissingHousingContracts(range, currentHousing?.id)

    useEffect(() => {
        if (period === 'daily' && enphaseConsent?.enphaseConsentState === 'ACTIVE') {
            setMetricsInterval('30m')
        } else if (period === 'daily' && enphaseConsent?.enphaseConsentState !== 'ACTIVE') {
            setMetricsInterval('2m')
        }
    }, [enphaseConsent?.enphaseConsentState, period, setMetricsInterval])

    // UseEffect to check for consent whenever a meter is selected.
    useEffect(() => {
        if (filters.length > 0) {
            // TODO RESET When ConsumptionChartContainer, ProductionChartContainer, WidgetListContainer is done.
            getConsents(filters[0].value, currentHousing?.id)
        }
    }, [currentHousing?.id, filters, getConsents])

    const productionChartData = useMemo(
        () =>
            data.filter(
                (metric) =>
                    metric.target !== metricTargetsEnum.consumption &&
                    metric.target !== metricTargetsEnum.internalTemperature &&
                    metric.target !== metricTargetsEnum.externalTemperature &&
                    metric.target !== metricTargetsEnum.pMax &&
                    metric.target !== metricTargetsEnum.eurosConsumption,
            ),
        [data],
    )

    // TODO: Remove filter when the widget version of those targets are ready.
    const widgetsData = useMemo(
        () =>
            data.filter(
                (metric) =>
                    metric.target !== metricTargetsEnum.autoconsumption &&
                    metric.target !== metricTargetsEnum.totalProduction &&
                    metric.target !== metricTargetsEnum.injectedProduction,
            ),
        [data],
    )

    /**
     * Show text according to interval.
     *
     * @param chartType Chart type: consumption or production.
     * @returns Text that represents the interval.
     */
    const showPerPeriodText = (chartType: 'consumption' | 'production') => {
        let textUnit = `en ${period === 'daily' ? 'Wh' : 'kWh'}`
        if (period === 'daily') {
            return `${textUnit} par jour`
        } else if (period === 'weekly') {
            return `${textUnit} par semaine`
        } else if (period === 'monthly') {
            return `${textUnit} par mois`
        } else if (period === 'yearly') {
            return `${textUnit} par année`
        } else {
            throw Error('PeriodValue not set')
        }
    }

    // By checking if the metersList is true we make sure that if someone has skipped the step of connecting their PDL, they will see this error message.
    // Else if they have a PDL, we check its consent.
    if (!currentHousing?.meter?.guid) return <MissingHousingMeterErrorMessage />

    return (
        <>
            <div style={{ background: theme.palette.primary.dark }} className="p-24">
                {nrlinkOff && enedisOff ? (
                    <ChartErrorMessage
                        nrLinkEnedisOff={nrlinkOff && enedisOff}
                        nrlinkEnedisOffMessage={NRLINK_ENEDIS_OFF_MESSAGE}
                        linkTo={`/my-houses/${currentHousing?.id}`}
                    />
                ) : (
                    <>
                        <div className="mb-24">
                            <MyConsumptionPeriod
                                setPeriod={setPeriod}
                                setRange={setRange}
                                setMetricsInterval={setMetricsInterval}
                                range={range}
                            />
                            <MyConsumptionDatePicker period={period} setRange={setRange} range={range} />
                        </div>

                        <ConsumptionChartContainer
                            period={period}
                            hasMissingHousingContracts={hasMissingHousingContracts}
                            range={range}
                            filters={filters}
                            enedisSgeConsent={enedisSgeConsent}
                            enphaseConsent={enphaseConsent}
                            metricsInterval={metricsInterval}
                        />
                    </>
                )}

                {/* Production Chart */}
                {enphaseConsent?.enphaseConsentState === 'ACTIVE' ? (
                    <div className="mb-12">
                        <div className="relative flex flex-col md:flex-row justify-between items-center">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16 md:mb-0">
                                <div className="flex flex-col md:flex-row items-center">
                                    <TypographyFormatMessage
                                        variant="h5"
                                        className="sm:mr-8"
                                        style={{ color: theme.palette.primary.contrastText }}
                                    >
                                        Ma Production
                                    </TypographyFormatMessage>
                                    {/* Consommation Wh par Jour / Semaine / Mois / Année */}
                                    <TypographyFormatMessage
                                        variant="h5"
                                        style={{ color: theme.palette.primary.contrastText }}
                                    >
                                        {showPerPeriodText('production')}
                                    </TypographyFormatMessage>
                                </div>
                            </motion.div>
                        </div>
                        {isMetricsLoading ? (
                            <div
                                className="flex flex-col justify-center items-center w-full h-full"
                                style={{ height: '320px' }}
                            >
                                <CircularProgress style={{ color: theme.palette.background.paper }} />
                            </div>
                        ) : (
                            <MyConsumptionChart
                                data={productionChartData}
                                period={period}
                                range={range}
                                chartType="production"
                            />
                        )}
                    </div>
                ) : (
                    productionChartErrorState && (
                        <ChartErrorMessage
                            enphaseOff={enphaseOff}
                            enphaseOffMessage={ENPHASE_OFF_MESSAGE}
                            linkTo={`/my-houses/${currentHousing?.id}`}
                        />
                    )
                )}
            </div>
            {/* Ecowatt Widget */}
            <div className="p-12 sm:p-24 ">
                <EcowattWidget />
            </div>
            {data.length !== 0 && (
                <div className="p-12 sm:p-24 ">
                    <div className="flex justify-center items-center md:justify-start">
                        <TypographyFormatMessage variant="h5" className="sm:mr-8 text-black font-medium">
                            Chiffres clés
                        </TypographyFormatMessage>
                    </div>
                    <WidgetList
                        data={widgetsData}
                        hasMissingHousingContracts={hasMissingHousingContracts}
                        isMetricsLoading={isMetricsLoading}
                    />
                </div>
            )}
        </>
    )
}
