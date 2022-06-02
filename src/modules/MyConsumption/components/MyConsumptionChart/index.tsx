import React from 'react'

/**
 * Chart that displays customer's meter's consumption.
 *
 * @param props Props.
 * @returns MyConsumptionChart.
 */
export const MyConsumptionChart = (props: any) => {
    return (
        <div className="container relative h-200 sm:h-256 pb-16">
            {props.isMetricsLoading ? 'loading' : JSON.stringify(props.data)}
        </div>
    )
}
