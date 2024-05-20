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
        /**
         * The value of the axis.
         */
        axisValue: string
        /**
         * The index of the data item.
         */
        dataIndex: number
        /**
         * The index of the axis to display in.
         */
        axisIndex: number
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
 * Function type for rendering a component when there are missing labels in the tooltip.
 *
 * @param params - The parameters for the EChartTooltipFormatter.
 * @returns The rendered JSX element or null.
 */
export type RenderComponentOnMissingLabelsTypes = (params: EChartTooltipFormatterParams) => JSX.Element | null
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
        valueFormatter?: TooltipValueFormatter
        /**
         * Callback to return total cost measurement of hovered element.
         */
        getTotalEuroCost?: (index: number) => TotalMeasurement | undefined
        /**
         * Callback to return total consumption measurement of hovered element.
         */
        getTotalConsumption?: (index: number) => TotalMeasurement | undefined
        /**
         * Callback to determines whether to display the tooltip label.
         */
        onDisplayTooltipLabel?: onDisplayTooltipLabelType

        /**
         * Function for rendering a component when there are missing labels in the tooltip.
         */
        renderComponentOnMissingLabels?: RenderComponentOnMissingLabelsTypes
    }

/**
 * Represents a formatter function for tooltip values.
 *
 * @param index - The index of the value.
 * @returns The formatted value.
 */
export type TooltipValueFormatter = (index: number) => axisValueFormatterType

/**
 * Represents a formatter function for override the tooltip.
 *
 * @param params - The parameters for the EChartTooltipFormatter.
 * @param valueFormatter - The value formatter function.
 * @returns The formatted tooltip string.
 */
export type TooltipFormatter = (params: EChartTooltipFormatterParams, valueFormatter: TooltipValueFormatter) => string
