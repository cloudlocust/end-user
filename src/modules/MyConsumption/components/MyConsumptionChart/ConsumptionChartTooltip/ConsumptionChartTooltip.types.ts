import {
    axisValueFormatterType,
    TotalMeasurement,
} from 'src/modules/MyConsumption/components/MyConsumptionChart/MyConsumptionChartTypes.d'

/**
 * Represents the value of a label in EChart tooltip.
 */
export type EChartTooltipLabelValue = number | undefined

/**
 * Param item of formatter function  of echart tooltip.
 */
export type EChartTooltipFormatterParamsItem =
    /**
     * EChartTooltipFormatterParamItem.
     */
    {
        /**
         *  Value of the data item.
         */
        value: EChartTooltipLabelValue
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
    }

/**
 * Represents the parameters for the EChart tooltip formatter.
 */
export type EChartTooltipFormatterParams = EChartTooltipFormatterParamsItem[]

/**
 * Function that determines whether to display the tooltip label.
 *
 * @param item - The item of the EChartTooltipFormatterParams.
 * @returns A boolean indicating whether to display the tooltip label.
 */
export type onDisplayTooltipLabelType = (item: EChartTooltipFormatterParamsItem) => boolean
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
        valueFormatter?: (index: number) => axisValueFormatterType
        /**
         * Total cost measurement.
         */
        totalEuroCost?: TotalMeasurement
        /**
         * Total consumption measurement.
         */
        totalConsumption?: TotalMeasurement
        /**
         * Callback to determines whether to display the tooltip label.
         */
        onDisplayTooltipLabel?: onDisplayTooltipLabelType
    }
