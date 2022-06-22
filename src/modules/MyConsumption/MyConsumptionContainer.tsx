import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import MyConsumptionChart from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { useMeterList } from 'src/modules/Meters/metersHook'
import { formatMetricFilter } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { MyConsumptionPeriod, SelectMeters, Widget } from 'src/modules/MyConsumption'
import { SelectChangeEvent, useTheme } from '@mui/material'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { getMetricType } from 'src/modules/Metrics/Metrics'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import dayjs from 'dayjs'

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
    const { setMetricsInterval, setRange, setFilters, isMetricsLoading, data, metricsInterval } =
        useMetrics(initialMetricsHookValues)
    const [period, setPeriod] = useState<periodType>('daily')

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
            <MyConsumptionPeriod setPeriod={setPeriod} setRange={setRange} setMetricsInterval={setMetricsInterval} />

            <Widget type="total_consumption" />
        </div>
    )
}
