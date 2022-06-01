import React from 'react'
import Typography from '@mui/material/Typography'
import { motion } from 'framer-motion'
import { MyConsumptionChart } from 'src/modules/MyConsumption/components/MyConsumptionChart'
import { MyConsumptionSelectMeters } from 'src/modules/MyConsumption/components/MyConsumptionSelectMeters'
import { MyConsumptionPeriod } from 'src/modules/MyConsumption/components/MyConsumptionPeriod'

/**
 * MyConsoContainer. Parent component.
 *
 * @returns MyConsoContainer.
 */
export const MyConsumptionContainer = () => {
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
            <MyConsumptionChart />

            {/* TODO: MYEM-2425 */}
            <MyConsumptionPeriod />
        </>
    )
}
