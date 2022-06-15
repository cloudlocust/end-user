import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    formatMetricFilter,
    MyConsumptionChart,
    MyConsumptionSelectMeters,
    MyConsumptionPeriod,
} from 'src/modules/MyConsumption/'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType, periodValue } from 'src/modules/Metrics/Metrics'
import dayjs from 'dayjs'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTheme } from '@mui/material'
import { useMeterList } from 'src/modules/Meters/metersHook'
import Icon from '@mui/material/Icon'

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
            target: 'nrlink_consumption_metrics',
            type: 'timeseries',
        },
    ],
    addHookFilters: [],
}

/**
 * MyConsoContainer. Parent component.
 *
 * @returns MyConsoContainer.
 */
export const MyConsumptionContainer = () => {
    const { setPeriod, setRange, setFilters, isMetricsLoading, data, interval, nrlinkConsent, enedisConsent } =
        useMetrics(initialMetricsHookValues)
    const [periodValue, setPeriodValue] = useState<periodValue>(1)
    const [isConsentError, setIsConsentError] = useState(false)
    const { elementList: metersList } = useMeterList()
    const theme = useTheme()

    useEffect(() => {
        if (!metersList) return
        if (metersList.length === 1) setFilters(formatMetricFilter(metersList[0].guid))
    }, [metersList, setFilters])

    useEffect(() => {
        if (
            nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT' &&
            enedisConsent?.enedisConsentState === 'NONEXISTENT'
        ) {
            setIsConsentError(true)
        } else {
            setIsConsentError(false)
        }
    }, [enedisConsent?.enedisConsentState, nrlinkConsent?.nrlinkConsentState])

    /**
     * Show text according to interval.
     *
     * @returns Text that represents the interval.
     */
    const showPerPeriodText = () => {
        if (periodValue === 1) {
            return 'par jour'
        } else if (periodValue === 7) {
            return 'par semaine'
        } else if (periodValue === 30) {
            return 'par mois'
        } else if (periodValue === 365) {
            return 'par année'
        } else {
            throw Error('PeriodValue not set')
        }
    }

    if (isConsentError) {
        return (
            <div className="container relative h-200 sm:h-256 p-16 sm:p-24 flex-col text-center flex items-center justify-center">
                <>
                    <Icon style={{ fontSize: '4rem', marginBottom: '1rem', color: theme.palette.secondary.main }}>
                        error_outline_outlined
                    </Icon>
                </>
                <Typography>
                    Pour voir votre consommation vous devez d'abord{' '}
                    <Link to="/nrlink-connection-steps" className="underline">
                        enregistrer votre compteur et votre nrLink
                    </Link>
                </Typography>
            </div>
        )
    }

    return (
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
                            {/* Consommation par Jour / Semaiine / Mois / Année */}
                            <TypographyFormatMessage variant="h5" style={{ color: theme.palette.primary.contrastText }}>
                                {showPerPeriodText()}
                            </TypographyFormatMessage>
                        </div>
                    </div>
                </motion.div>
                {metersList && metersList?.length > 1 && (
                    <MyConsumptionSelectMeters setFilters={setFilters} metersList={metersList} />
                )}
            </div>

            <MyConsumptionChart
                isMetricsLoading={isMetricsLoading}
                data={data}
                chartType={interval === '1min' ? 'area' : 'bar'}
                period={periodValue}
            />
            <MyConsumptionPeriod setPeriod={setPeriod} setRange={setRange} setPeriodValue={setPeriodValue} />
        </div>
    )
}
