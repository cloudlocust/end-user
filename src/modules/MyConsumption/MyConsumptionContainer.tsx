import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { motion } from 'framer-motion'
import { MyConsumptionChart } from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { MyConsumptionSelectMeters } from 'src/modules/MyConsumption/components/MyConsumptionSelectMeters'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption/components/MyConsumptionPeriod'
import { useConsumptionMetrics } from 'src/modules/Metriics/metricsHook'
import { metricFilters, metricInterval, metricRange, metricTargets } from 'src/modules/Metriics/Metrics'

/**
 * MyConsoContainer. Parent component.
 *
 * @returns MyConsoContainer.
 */
export const MyConsumptionContainer = () => {
    const { setPeriod, setTargets, setRange, setFilters, isMetricsLoading, data, interval, getMetrics } =
        useConsumptionMetrics()

    /* Load the metrics data when when component loads */
    useEffect(() => {
        getMetrics()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
    const onhandleMetricsChange = ({
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

    return (
        <>
            <div className="container relative p-16 sm:p-24 flex flex-col sm:flex-row justify-between items-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex flex-col sm:flex-row items-center sm:items-center mb-16 sm:mb-0 ">
                        <Typography className="h3 sm:mr-3" color="textPrimary">
                            Ma Consomation
                        </Typography>
                        {/* TODO: kWh can also be P.max in MYEM-2408, to be dynamic. */}
                        <Typography className="h3" color="textSecondary">
                            en kWh
                        </Typography>
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
            <MyConsumptionPeriod onhandleMetricsChange={onhandleMetricsChange} />
        </>
    )
}
