import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MyConsumptionChart } from 'src/modules/MyConsumption/components/MyConsumptionChart'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useMeterList } from 'src/modules/Meters/metersHook'
import { formatMetricFilter } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { getMetricType } from 'src/modules/Metrics/Metrics'
import dayjs from 'dayjs'
import { periodValue } from 'src/modules/MyConsumption/myConsumptionTypes'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { MyConsumptionPeriod, SelectMeters } from 'src/modules/MyConsumption'
import { SelectChangeEvent, useTheme } from '@mui/material'
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
    const { setMetricInterval, setRange, setFilters, isMetricsLoading, data, interval } =
        useMetrics(initialMetricsHookValues)
    const [periodValue, setPeriod] = useState<periodValue>(1)

    useEffect(() => {
        if (!metersList) return
        if (metersList.length === 1) setFilters(formatMetricFilter(metersList[0].guid))
    }, [metersList, setFilters])
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
                {metersList && metersList?.length > 1 && (
                    <SelectMeters
                        metersList={metersList}
                        handleOnChange={handleOnChange}
                        inputTextColor={theme.palette.primary.contrastText}
                        inputColor={theme.palette.primary.contrastText}
                    />
                )}
            </div>
            {/* TODO: MYEM-2422 */}
            <MyConsumptionChart
                isMetricsLoading={isMetricsLoading}
                data={data}
                chartType={interval === '1min' ? 'area' : 'bar'}
            />

            {/* TODO: MYEM-2425 */}
            <MyConsumptionPeriod setMetricInterval={setMetricInterval} setRange={setRange} setPeriod={setPeriod} />
        </>
    )
}
