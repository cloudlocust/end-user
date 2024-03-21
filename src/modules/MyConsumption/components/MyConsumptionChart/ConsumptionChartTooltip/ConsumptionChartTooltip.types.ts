import {
    axisValueFormatterType,
    TotalMeasurement,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'

/**
 * Params of formatter function  of echart tooltip.
 */
export type EChartTooltipFormatterParams =
    /**
     * EChartTooltipFormatterParams.
     */
    {
        /**
         *  Value of the data item.
         */
        value: string | number
        /**
         * Name of the series.
         */
        seriesName: string
        /**
         * The index of the series.
         */
        seriesIndex: number
        /**
         * Name of the data item.
         */
        name: string
        /**
         * Html string represent symbol for series, used in labels for color or shape identification.
         */
        marker: string
    }[]

/**
 * Props for the ConsumptionChartTooltip component.
 */
export type ConsumptionChartTooltipProps =
    /**
     * ConsumptionChartTooltipProps.
     */
    {
        /**
         * Parameters for the EChartTooltipFormatter.
         */
        params: EChartTooltipFormatterParams
        /**
         * Function to format the value based on the index of the series.
         *
         * @param index - The index of the chart.
         * @returns The formatted value.
         */
        valueFormatter: (index: number) => axisValueFormatterType
        /**
         * Total cost measurement.
         */
        totalEuroCost?: TotalMeasurement
        /**
         * Total consumption measurement.
         */
        totalConsumption?: TotalMeasurement
    }
