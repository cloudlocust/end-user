import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { useMeterList } from 'src/modules/Meters/metersHook'
import { formatMetricFilter, getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { SelectChangeEvent, useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType, metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { Link } from 'react-router-dom'
import { Icon, Typography } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { WidgetList } from 'src/modules/MyConsumption/components/Widget/WidgetsList'
import CircularProgress from '@mui/material/CircularProgress'
import { MyConsumptionPeriod, SelectMeters } from 'src/modules/MyConsumption'
import TargetButtonGroup from 'src/modules/MyConsumption/components/TargetButtonGroup'

/**
 * InitialMetricsStates for useMetrics.
 */
export const initialMetricsHookValues: getMetricType = {
    interval: '2min',
    range: getRange('day'),
    targets: [
        {
            target: metricTargetsEnum.consumption,
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
    const { elementList: metersList } = useMeterList()
    const theme = useTheme()
    const { formatMessage } = useIntl()
    const { getConsents, nrlinkConsent, enedisConsent } = useConsents()
    const { setMetricsInterval, setRange, setFilters, isMetricsLoading, data, filters, range } =
        useMetrics(initialMetricsHookValues)
    const [period, setPeriod] = useState<periodType>('daily')
    const [filteredTargets, setFilteredTargets] = useState<metricTargetType[]>([metricTargetsEnum.consumption])

    useEffect(() => {
        if (!metersList) return
        if (metersList.length === 1) setFilters(formatMetricFilter(metersList[0].guid))
    }, [metersList, setFilters])

    // UseEffect to check for consent whenever a meter is selected.
    useEffect(() => {
        if (filters.length > 0) {
            getConsents(filters[0].value)
        }
    }, [filters, getConsents])

    /**
     * Show text according to interval.
     *
     * @returns Text that represents the interval.
     */
    const showPerPeriodText = () => {
        if (period === 'daily') {
            return 'par jour'
        } else if (period === 'weekly') {
            return 'par semaine'
        } else if (period === 'monthly') {
            return 'par mois'
        } else if (period === 'yearly') {
            return 'par année'
        } else {
            throw Error('PeriodValue not set')
        }
    }

    /**
     * HandleOnChange function.
     *
     * @param event HandleOnChange event.
     * @param setSelectedMeter Set Selected Meter on value change.
     */
    const handleOnChange = (event: SelectChangeEvent, setSelectedMeter: (value: string) => void) => {
        setSelectedMeter(event.target.value)
        if (event.target.value === 'allMeters') {
            setFilters([])
        } else {
            setFilters(formatMetricFilter(event.target.value))
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
    const addTarget = (target: metricTargetType) => {
        if (!filteredTargets.find((filteredTargetsEl) => filteredTargetsEl === target)) {
            setFilteredTargets((prevState) => {
                return [...prevState, target]
            })
        }
    }

    // By checking if the metersList is true we make sure that if someone has skipped the step of connecting their PDL, they will see this error message.
    // Else if they have a PDL, we check its consent.
    if (
        (nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT' && enedisConsent?.enedisConsentState === 'NONEXISTENT') ||
        (metersList && metersList.length === 0)
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
                    <Link to="/nrlink-connection-steps" className="underline">
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
                            <div className="flex flex-row items-end">
                                {/* TODO: kWh can also be P.max in MYEM-2408, to be dynamic. */}
                                <TypographyFormatMessage
                                    variant="h5"
                                    className="mr-8 sm:mr-8"
                                    style={{ color: theme.palette.primary.contrastText }}
                                >
                                    en kWh
                                </TypographyFormatMessage>
                                {/* Consommation par Jour / Semaine / Mois / Année */}
                                <TypographyFormatMessage
                                    variant="h5"
                                    style={{ color: theme.palette.primary.contrastText }}
                                >
                                    {showPerPeriodText()}
                                </TypographyFormatMessage>
                            </div>
                        </div>
                    </motion.div>
                    {metersList && metersList?.length > 1 && (
                        <SelectMeters
                            metersList={metersList}
                            handleOnChange={handleOnChange}
                            inputTextColor={theme.palette.primary.contrastText}
                            inputColor={theme.palette.primary.contrastText}
                        />
                    )}
                </div>

                <div className="my-16 flex justify-center">
                    <TargetButtonGroup
                        removeTarget={removeTarget}
                        addTarget={addTarget}
                        hidePmax={period === 'daily' || enedisConsent?.enedisConsentState === 'NONEXISTENT'}
                    />
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
                        data={data.filter((metric) => filteredTargets.includes(metric.target))}
                        chartType={period === 'daily' ? 'area' : 'bar'}
                        period={period}
                        range={range}
                    />
                )}
                <MyConsumptionPeriod
                    setPeriod={setPeriod}
                    setRange={setRange}
                    setMetricsInterval={setMetricsInterval}
                />
            </div>
            {data.length === 0 ? null : (
                <div className="p-12 sm:p-24 ">
                    <div className="flex justify-center items-center md:justify-start">
                        <TypographyFormatMessage variant="h5" className="sm:mr-8 text-black font-medium">
                            Chiffres clés
                        </TypographyFormatMessage>
                    </div>
                    <WidgetList data={data} isMetricsLoading={isMetricsLoading} />
                </div>
            )}
        </>
    )
}
