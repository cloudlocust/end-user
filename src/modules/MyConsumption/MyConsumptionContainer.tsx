import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { motion } from 'framer-motion'
import { MyConsumptionChart } from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { MyConsumptionSelectMeters } from 'src/modules/MyConsumption/components/MyConsumptionSelectMeters'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption/components/MyConsumptionPeriod'
import { useConsumptionMetrics } from 'src/modules/Metriics/metricsHook'
import dayjs from 'dayjs'
import { Button } from '@mui/material'

/**
 * MyConsoContainer. Parent component.
 *
 * @returns MyConsoContainer.
 */
export const MyConsumptionContainer = () => {
    const { setPeriod, setTargets, setRange, setFilters, isMetricsLoading, data, getMetrics } = useConsumptionMetrics()

    /* Load the metrics data when when component loads */
    useEffect(() => {
        getMetrics()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div>
                <Button onClick={() => setPeriod('1d')}>setPeriod btn</Button>
                <Button
                    onClick={() =>
                        setRange({
                            from: dayjs().subtract(7, 'day').startOf('day').toDate().toISOString(),
                            to: dayjs().startOf('day').toDate().toISOString(),
                        })
                    }
                >
                    setRange btn
                </Button>
                <Button onClick={() => setTargets([{ target: 'nrlink_consumption_metrics', type: 'timeseries' }])}>
                    setTargets btn
                </Button>
                <Button
                    onClick={() =>
                        setFilters([
                            {
                                key: 'meter_guid',
                                operator: '=',
                                value: '123456789',
                            },
                        ])
                    }
                >
                    setFilters btn
                </Button>
            </div>

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
            <MyConsumptionChart isMetricsLoading={isMetricsLoading} data={data} />

            {/* TODO: MYEM-2425 */}
            <MyConsumptionPeriod />
        </>
    )
}
