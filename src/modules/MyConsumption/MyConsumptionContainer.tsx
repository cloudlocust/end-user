import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { formatMetricFilter, getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useTheme, Typography, Icon } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useIntl } from 'react-intl'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { WidgetList } from 'src/modules/MyConsumption/components/Widget/WidgetsList'
import CircularProgress from '@mui/material/CircularProgress'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import EurosConsumptionButtonToggler from 'src/modules/MyConsumption/components/EurosConsumptionButtonToggler'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption'
import TargetButtonGroup from 'src/modules/MyConsumption/components/TargetButtonGroup'
import { Link, NavLink } from 'react-router-dom'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { useHasMissingHousingContracts } from 'src/hooks/HasMissingHousingContracts'
import { tempPmaxFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import Tooltip from '@mui/material/Tooltip'
import { ChartErrorMessage } from 'src/modules/MyConsumption/components/ChartErrorMessage'
import { ENPHASE_OFF_MESSAGE, NRLINK_ENEDIS_OFF_MESSAGE } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import { productionChartErrorState } from 'src/modules/MyConsumption/MyConsumptionConfig'

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

const defaultFilteredTargetsValues = [metricTargetsEnum.consumption, metricTargetsEnum.autoconsumption]

/**
 * MyConsumptionContainer.
 * Parent component.
 *
 * @returns MyConsumptionContainer and its children.
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
export const MyConsumptionContainer = () => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { getConsents, nrlinkConsent, enedisSgeConsent, enphaseConsent } = useConsents()
    const { setMetricsInterval, setRange, setFilters, isMetricsLoading, data, filters, range } =
        useMetrics(initialMetricsHookValues)
    const [period, setPeriod] = useState<periodType>('daily')
    const [filteredTargets, setFilteredTargets] = useState<metricTargetType[]>(defaultFilteredTargetsValues)
    // This state represents whether or not the chart is stacked: true.
    const [isStackedEnabled, setIsStackedEnabled] = useState<boolean>(true)
    const isEurosConsumptionChart = filteredTargets.includes(metricTargetsEnum.eurosConsumption)
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    const nrlinkOff = nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT'
    const enedisOff = enedisSgeConsent?.enedisSgeConsentState === 'NONEXISTENT'
    const enphaseOff = enphaseConsent?.enphaseConsentState !== 'ACTIVE'

    useEffect(() => {
        if (!currentHousing) return
        if (currentHousing?.meter) setFilters(formatMetricFilter(currentHousing.meter?.guid))
    }, [currentHousing, setFilters])

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
            getConsents(filters[0].value, currentHousing?.id)
        }
    }, [currentHousing?.id, filters, getConsents])

    // Storing the chartData with useMemo, so that we don't compute data.filter on every state change (period, range ...etc), and thus we won't reender heavy computation inside MyConsumptionChart because chartData will be stable.
    const consumptionChartData = useMemo(
        () => data.filter((metric) => filteredTargets.includes(metric.target)),
        [data, filteredTargets],
    )

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
        let textUnit = `en ${
            chartType === 'consumption' && isEurosConsumptionChart ? '€' : period === 'daily' ? 'Wh' : 'kWh'
        }`
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

    /**
     * Function that removes target from graph.
     *
     * @param target Metric target.
     */
    const removeTarget = useCallback((target: metricTargetType) => {
        if (
            target === metricTargetsEnum.externalTemperature ||
            target === metricTargetsEnum.internalTemperature ||
            target !== metricTargetsEnum.pMax
        ) {
            setIsStackedEnabled(true)
        }
        setFilteredTargets((prevState) => prevState.filter((filteredTargetsEl) => filteredTargetsEl !== target))
    }, [])

    /**
     * Function that adds target to the graph.
     *
     * @param target Metric target.
     */
    const addTarget = useCallback(
        (target: metricTargetType) => {
            if (!filteredTargets.find((filteredTargetsEl) => filteredTargetsEl === target)) {
                if (
                    target === metricTargetsEnum.externalTemperature ||
                    target === metricTargetsEnum.internalTemperature ||
                    target !== metricTargetsEnum.pMax
                ) {
                    setIsStackedEnabled(false)
                }
                setFilteredTargets((prevState) => {
                    return [...prevState, target]
                })
            }
        },
        [filteredTargets],
    )

    const memoizedTargetButtonGroup = useMemo(() => {
        return (
            <TargetButtonGroup
                removeTarget={removeTarget}
                addTarget={addTarget}
                hidePmax={period === 'daily' || enedisSgeConsent?.enedisSgeConsentState === 'NONEXISTENT'}
            />
        )
    }, [addTarget, enedisSgeConsent?.enedisSgeConsentState, period, removeTarget])

    const memoizedMyConsumptionPeriod = useMemo(() => {
        return (
            <MyConsumptionPeriod
                setPeriod={setPeriod}
                setRange={setRange}
                setMetricsInterval={setMetricsInterval}
                range={range}
            />
        )
    }, [range, setMetricsInterval, setRange])

    // By checking if the metersList is true we make sure that if someone has skipped the step of connecting their PDL, they will see this error message.
    // Else if they have a PDL, we check its consent.
    if (!currentHousing?.meter?.guid) {
        return (
            <div className="container relative h-200 sm:h-256 p-16 sm:p-24 flex-col text-center flex items-center justify-center">
                <>
                    <Icon style={{ fontSize: '4rem', marginBottom: '1rem', color: theme.palette.secondary.main }}>
                        error_outline_outlined
                    </Icon>
                </>
                <Typography>
                    {formatMessage({
                        id: "Pour voir votre consommation vous devez d'abord ",
                        defaultMessage: "Pour voir votre consommation vous devez d'abord ",
                    })}
                    <Link to={`/nrlink-connection-steps/${currentHousing?.id}`} className="underline">
                        {formatMessage({
                            id: 'enregistrer votre compteur et votre nrLink',
                            defaultMessage: 'enregistrer votre compteur et votre nrLink',
                        })}
                    </Link>
                </Typography>
            </div>
        )
    }

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
                            {memoizedMyConsumptionPeriod}
                            <MyConsumptionDatePicker period={period} setRange={setRange} range={range} />
                        </div>

                        {/* Consumption Chart */}
                        <div className="mb-12">
                            <div className="relative flex flex-col md:flex-row justify-between items-center">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16 md:mb-0">
                                    <div className="flex flex-col md:flex-row items-center">
                                        <TypographyFormatMessage
                                            variant="h5"
                                            className="sm:mr-8"
                                            style={{ color: theme.palette.primary.contrastText }}
                                        >
                                            Ma Consommation
                                        </TypographyFormatMessage>
                                        {/* Consommation Wh par Jour / Semaine / Mois / Année */}
                                        <TypographyFormatMessage
                                            variant="h5"
                                            style={{ color: theme.palette.primary.contrastText }}
                                        >
                                            {showPerPeriodText('consumption')}
                                        </TypographyFormatMessage>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="my-16 flex justify-between">
                                <EurosConsumptionButtonToggler
                                    removeTarget={removeTarget}
                                    addTarget={addTarget}
                                    showEurosConsumption={!isEurosConsumptionChart}
                                />
                                <Tooltip
                                    arrow
                                    placement="bottom-end"
                                    disableHoverListener={!tempPmaxFeatureState}
                                    title={formatMessage({
                                        id: "Cette fonctionnalité n'est pas disponible sur cette version",
                                        defaultMessage: "Cette fonctionnalité n'est pas disponible sur cette version",
                                    })}
                                >
                                    <div className={`${tempPmaxFeatureState && 'cursor-not-allowed'}`}>
                                        {memoizedTargetButtonGroup}
                                    </div>
                                </Tooltip>
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
                                    data={consumptionChartData}
                                    period={period}
                                    range={range}
                                    isStackedEnabled={isStackedEnabled}
                                    chartType="consumption"
                                />
                            )}

                            {isEurosConsumptionChart && hasMissingHousingContracts && (
                                <div className="flex items-center justify-center flex-col mt-12">
                                    <ErrorOutlineIcon
                                        sx={{
                                            color: warningMainHashColor,
                                            width: { xs: '24px', md: '32px' },
                                            height: { xs: '24px', md: '32px' },
                                            margin: { xs: '0 0 4px 0', md: '0 8px 0 0' },
                                        }}
                                    />

                                    <div className="w-full">
                                        <TypographyFormatMessage
                                            sx={{ color: warningMainHashColor }}
                                            className="text-13 md:text-16 text-center"
                                        >
                                            {
                                                "Ce graphe est un exemple basé sur un tarif Bleu EDF Base. Vos données contractuelles de fourniture d'énergie ne sont pas disponibles sur toute la période."
                                            }
                                        </TypographyFormatMessage>
                                        <NavLink to={`${URL_MY_HOUSE}/${currentHousing?.id}/contracts`}>
                                            <TypographyFormatMessage
                                                className="underline text-13 md:text-16 text-center"
                                                sx={{ color: warningMainHashColor }}
                                            >
                                                Renseigner votre contrat d'énergie
                                            </TypographyFormatMessage>
                                        </NavLink>
                                    </div>
                                </div>
                            )}
                        </div>
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
