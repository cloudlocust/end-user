import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MyConsumptionChart } from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { MyConsumptionSelectMeters } from 'src/modules/MyConsumption/components/MyConsumptionSelectMeters'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption/components/MyConsumptionPeriod'
import { useConsumptionMetrics } from 'src/modules/Metriics/metricsHook'
import { getMetricType, metricFilters, metricInterval, metricRange, metricTargets } from 'src/modules/Metriics/Metrics'
import dayjs from 'dayjs'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'

/**
 * Range value type.
 *
 */
type rangeValue = 1 | 7 | 30 | 365

/**
 * InitialMetricsStates for useConsumptionMetrics.
 */
export const initialMetricsHookValues: getMetricType = {
    interval: '1m',
    range: {
        from: dayjs().subtract(7, 'day').startOf('day').toDate().toJSON(),
        to: dayjs().toDate().toJSON(),
    },
    targets: [
        {
            target: 'nrlink_consumption_metrics',
            type: 'timeseries',
        },
    ],
}

/**
 * MyConsoContainer. Parent component.
 *
 * @returns MyConsoContainer.
 */
export const MyConsumptionContainer = () => {
    const { setPeriod, setTargets, setRange, setFilters, isMetricsLoading, data, interval, getMetrics } =
        useConsumptionMetrics(initialMetricsHookValues)
    const [error, setError] = useState<boolean>(false)
    const [periodValue, setPeriodValue] = useState<rangeValue>(1)

    /* Load the metrics data when when component loads */
    useEffect(() => {
        getMetrics()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (data?.every((element) => !element.nrlinkConsent || !element.enedisConsent)) {
            setError(true)
        } else {
            setError(false)
        }
    }, [data])

    /**
     * OnChange function that handles metrics.
     * To be passed to children component.
     *
     * @param root0 N/A.
     * @param root0.targets Targets..
     * @param root0.filters Filters.
     * @param root0.range Range.
     * @param root0.interval Interval.
     */
    const onHandleMetricsChange = ({
        targets,
        filters,
        range,
        interval,
    }: /**
     *
     */
    {
        /**
         *
         */
        targets?: metricTargets
        /**
         *
         */
        filters?: metricFilters
        /**
         *
         */
        range?: metricRange
        /**
         *
         */
        interval?: metricInterval
    }) => {
        if (targets) setTargets(targets)
        if (filters) setFilters(filters)
        if (interval && range) {
            setPeriod(interval)
            setRange(range)
        }
    }

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

    return (
        <>
            {error ? (
                <div className="container relative h-200 sm:h-256 pb-16 sm:p-24 text-center flex items-center justify-center">
                    <Typography>
                        Pour voir votre consommation vous devez d'abord{' '}
                        <Link to="/nrlink-connection" className="underline">
                            enregistrer votre compteur et votre nrLink
                        </Link>
                    </Typography>
                </div>
            ) : (
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
                        <MyConsumptionSelectMeters />
                    </div>
                    {/* TODO: MYEM-2422 */}
                    <MyConsumptionChart
                        isMetricsLoading={isMetricsLoading}
                        data={data}
                        chartType={interval === '1min' ? 'area' : 'column'}
                    />

                    {/* TODO: MYEM-2425 */}
                    <MyConsumptionPeriod
                        onHandleMetricsChange={onHandleMetricsChange}
                        setPeriodValue={setPeriodValue}
                    />
                </>
            )}
        </>
    )
}
