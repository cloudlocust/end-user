import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MyConsumptionSelectMeters } from 'src/modules/MyConsumption/components/MyConsumptionSelectMeters'
import { useConsumptionMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType } from 'src/modules/Metrics/Metrics'
import dayjs from 'dayjs'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useMeterList } from 'src/modules/Meters/metersHook'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption/components/MyConsumptionPeriod/MyConsumptionPeriod'
import MyConsumptionChart from './components/MyConsumptionChart/MyConsumptionChart'
import { periodValue } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useTheme } from '@mui/material'

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
    const { setPeriod, setRange, setFilters, isMetricsLoading, data, interval } =
        useConsumptionMetrics(initialMetricsHookValues)
    const [periodValue, setPeriodValue] = useState<periodValue>(1)
    const { elementList: metersList } = useMeterList()
    const theme = useTheme()

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
        <div style={{ background: theme.palette.primary.main }} className="p-24">
            <div className="relative flex flex-col md:flex-row justify-between items-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16 md:mb-0">
                    <div className="flex flex-col md:flex-row items-center">
                        <TypographyFormatMessage
                            variant="h4"
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

                {/* TODO: MYEM-2418 */}
                {metersList && metersList?.length > 1 && (
                    <MyConsumptionSelectMeters metersList={metersList} setFilters={setFilters} />
                )}
            </div>

            <MyConsumptionChart
                isMetricsLoading={isMetricsLoading}
                data={data}
                chartType={interval === '1min' ? 'area' : 'bar'}
                period={periodValue}
            />

            {/* TODO: MYEM-2425 */}
            <MyConsumptionPeriod setPeriod={setPeriod} setRange={setRange} setPeriodValue={setPeriodValue} />
        </div>
    )
}
