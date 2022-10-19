import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { formatMetricFilter, getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { Link } from 'react-router-dom'
import { Icon, Typography } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { WidgetList } from 'src/modules/MyConsumption/components/Widget/WidgetsList'
import CircularProgress from '@mui/material/CircularProgress'
import MyConsumptionDatePicker from 'src/modules/MyConsumption/components/MyConsumptionDatePicker'
import EurosConsumptionButtonToggler from 'src/modules/MyConsumption/components/EurosConsumptionButtonToggler'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption'
import TargetButtonGroup from 'src/modules/MyConsumption/components/TargetButtonGroup'
import { NavLink } from 'react-router-dom'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { useMyConsumptionHooks } from 'src/modules/MyConsumption/hooks/MyConsumptionHooks'
import { tempPmaxFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import Tooltip from '@mui/material/Tooltip'

/**
 * InitialMetricsStates for useMetrics.
 */
export const initialMetricsHookValues: getMetricType = {
    interval: '2m',
    range: getRange('day'),
    targets: [
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
    ],
    filters: [],
}

/**
 * MyConsumptionContainer.
 * Parent component.
 *
 * @returns MyConsumptionContainer and its children.
 */
export const MyConsumptionContainer = () => {
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { getConsents, nrlinkConsent, enedisConsent } = useConsents()
    const { setMetricsInterval, setRange, setFilters, isMetricsLoading, data, filters, range } =
        useMetrics(initialMetricsHookValues)
    const [period, setPeriod] = useState<periodType>('daily')
    const [filteredTargets, setFilteredTargets] = useState<metricTargetType[]>([metricTargetsEnum.consumption])
    const isEurosConsumptionChart = filteredTargets.includes(metricTargetsEnum.eurosConsumption)
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)

    useEffect(() => {
        if (!currentHousing) return
        if (currentHousing?.meter) setFilters(formatMetricFilter(currentHousing.meter?.guid))
    }, [currentHousing, setFilters])

    const { hasMissingHousingContracts } = useMyConsumptionHooks(range, currentHousing?.id)

    // UseEffect to check for consent whenever a meter is selected.
    useEffect(() => {
        if (filters.length > 0) {
            getConsents(filters[0].value)
        }
    }, [filters, getConsents])

    // Storing the chartData with useMemo, so that we don't compute data.filter on every state change (period, range ...etc), and thus we won't reender heavy computation inside MyConsumptionChart because chartData will be stable.
    const chartData = useMemo(
        () => data.filter((metric) => filteredTargets.includes(metric.target)),
        [data, filteredTargets],
    )

    /**
     * Show text according to interval.
     *
     * @returns Text that represents the interval.
     */
    const showPerPeriodText = () => {
        let textUnit = `en ${isEurosConsumptionChart ? '€' : period === 'daily' ? 'Wh' : 'kWh'}`
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
    const removeTarget = (target: metricTargetType) => {
        setFilteredTargets((prevState) => prevState.filter((filteredTargetsEl) => filteredTargetsEl !== target))
    }

    /**
     * Function that adds target to the graph.
     *
     * @param target Metric target.
     */
    const addTarget = useCallback(
        (target: metricTargetType) => {
            if (!filteredTargets.find((filteredTargetsEl) => filteredTargetsEl === target)) {
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
                hidePmax={period === 'daily' || enedisConsent?.enedisConsentState === 'NONEXISTENT'}
            />
        )
    }, [addTarget, enedisConsent?.enedisConsentState, period])

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
    if (
        (nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT' && enedisConsent?.enedisConsentState === 'NONEXISTENT') ||
        (currentHousing && !currentHousing?.meter)
    ) {
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
            <div style={{ background: theme.palette.primary.main }} className="p-24">
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
                            <TypographyFormatMessage variant="h5" style={{ color: theme.palette.primary.contrastText }}>
                                {showPerPeriodText()}
                            </TypographyFormatMessage>
                            <MyConsumptionDatePicker period={period} setRange={setRange} range={range} />
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
                            id: "Cette fonctionnalitée n'est pas encore disponible",
                            defaultMessage: "Cette fonctionnalitée n'est pas encore disponible",
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
                        data={chartData}
                        chartType={period === 'daily' ? 'area' : 'bar'}
                        period={period}
                        range={range}
                    />
                )}
                {memoizedMyConsumptionPeriod}
                {hasMissingHousingContracts && (
                    <NavLink
                        to={`${URL_MY_HOUSE}/${currentHousing?.id}/contracts`}
                        className="flex flex-col items-center mt-16"
                    >
                        <ErrorOutlineIcon sx={{ color: 'secondary.main', width: '32px', height: '32px' }} />
                        <TypographyFormatMessage
                            className="text-13 underline md:text-16 w-full text-center"
                            sx={{ color: 'secondary.main' }}
                        >
                            Ce graphe est un exemple. Renseigner votre contrat d'énergie
                        </TypographyFormatMessage>
                    </NavLink>
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
                        data={
                            // TODO Fix when getting to the story of widget consumptionEuros
                            data.filter((metric) => metric.target !== metricTargetsEnum.eurosConsumption)
                        }
                        isMetricsLoading={isMetricsLoading}
                    />
                </div>
            )}
        </>
    )
}
