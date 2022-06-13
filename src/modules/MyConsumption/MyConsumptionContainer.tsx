import React, { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MyConsumptionChart } from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { MyConsumptionSelectMeters } from 'src/modules/MyConsumption/components/MyConsumptionSelectMeters'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption/components/MyConsumptionPeriod'
import { useConsumptionMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType, periodValue } from 'src/modules/Metrics/Metrics'
import dayjs from 'dayjs'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

/**
 * InitialMetricsStates for useConsumptionMetrics.
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
    const { setPeriod, setRange, setFilters, isMetricsLoading, data, interval, consents } =
        useConsumptionMetrics(initialMetricsHookValues)
    const [periodValue, setPeriodValue] = useState<periodValue>(1)
    const [isConsentError, setIsConsentError] = useState<boolean>(false)

    /**
     * Check if consent exist for both Nrlink and Enedis from metrics hook consents state.
     */
    const checkNrlinkAndEnedisConsent = useCallback(() => {
        if (
            consents?.nrlinkConsent.nrlinkConsentState === 'NONEXISTENT' &&
            consents?.enedisConsent.enedisConsentState === 'NONEXISTENT'
        ) {
            setIsConsentError(true)
        } else {
            setIsConsentError(false)
        }
    }, [consents])

    useEffect(() => {
        checkNrlinkAndEnedisConsent()
    }, [checkNrlinkAndEnedisConsent])

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
            <div className="container relative h-200 sm:h-256 pb-16 sm:p-24 text-center flex items-center justify-center">
                <Typography>
                    Pour voir votre consommation vous devez d'abord{' '}
                    <Link to="/nrlink-connection" className="underline">
                        enregistrer votre compteur et votre nrLink
                    </Link>
                </Typography>
            </div>
        )
    }

    return (
        <>
            <div className="container relative p-16 sm:p-24 flex flex-col sm:flex-row justify-between items-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-center mb-16 sm:mb-0 ">
                        <TypographyFormatMessage className="h3 sm:mr-3" color="textPrimary">
                            Ma Consommation
                        </TypographyFormatMessage>
                        <div className="flex flex-row">
                            {/* TODO: kWh can also be P.max in MYEM-2408, to be dynamic. */}
                            <TypographyFormatMessage className="h3 mr-3 sm:mr-3" color="textSecondary">
                                en kWh
                            </TypographyFormatMessage>
                            {/* Consommation par Jour / Semaiine / Mois / Année */}
                            <TypographyFormatMessage className="h3" color="textSecondary">
                                {showPerPeriodText()}
                            </TypographyFormatMessage>
                        </div>
                    </div>
                </motion.div>

                {/* TODO: MYEM-2418 */}
                <MyConsumptionSelectMeters setFilters={setFilters} />
            </div>
            {/* TODO: MYEM-2422 */}
            <MyConsumptionChart
                isMetricsLoading={isMetricsLoading}
                data={data}
                chartType={interval === '1min' ? 'area' : 'bar'}
            />

            {/* TODO: MYEM-2425 */}
            <MyConsumptionPeriod setPeriod={setPeriod} setRange={setRange} setPeriodValue={setPeriodValue} />
        </>
    )
}
