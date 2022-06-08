import React from 'react'
import { MyConsumptionChart } from 'src/modules/MyConsumption'
import { fakeData } from 'src/modules/MyConsumption/utils/fakeData'
/**
 * Form used for modify user profile.
 *
 * @returns Modify form component.
 */
export const MyConsumption = () => {
    return (
        <div className="p-24 h-full">
            <h1>My conso</h1>
            <MyConsumptionChart data={fakeData} chartType="bar" isMetricsLoading={false} />
        </div>
    )
}
