import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { useMeterList } from 'src/modules/Meters/metersHook'
import { formatMetricFilter } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { MyConsumptionPeriod, SelectMeters } from 'src/modules/MyConsumption'
import { SelectChangeEvent, useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType } from 'src/modules/Metrics/Metrics'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { Icon, Typography } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { WidgetList } from 'src/modules/MyConsumption/WidgetsList'

/**
 * InitialMetricsStates for useMetrics.
 */
export const initialMetricsHookValues: getMetricType = {
    interval: '1min',
    range: {
        from: dayjs().subtract(1, 'day').startOf('day').toDate().toISOString(),
        to: dayjs().startOf('day').toDate().toISOString(),
    },
    targets: [
        {
            target: 'consumption_metrics',
            type: 'timeseries',
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
    const { setMetricsInterval, setRange, setFilters, isMetricsLoading, data, metricsInterval, filters } =
        useMetrics(initialMetricsHookValues)
    const [period, setPeriod] = useState<periodType>('daily')

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

    if (nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT' && enedisConsent?.enedisConsentState === 'NONEXISTENT') {
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

                <MyConsumptionChart
                    isMetricsLoading={isMetricsLoading}
                    data={data}
                    chartType={metricsInterval === '1min' ? 'area' : 'bar'}
                    period={period}
                />
                <MyConsumptionPeriod
                    setPeriod={setPeriod}
                    setRange={setRange}
                    setMetricsInterval={setMetricsInterval}
                />
            </div>
            <div className="p-12 sm:p-24 ">
                <div className="flex justify-center items-center md:justify-start">
                    <TypographyFormatMessage variant="h5" className="sm:mr-8 text-black font-medium">
                        Chiffres clés
                    </TypographyFormatMessage>
                </div>
                <WidgetList period={period} />
            </div>
        </>
    )
}
