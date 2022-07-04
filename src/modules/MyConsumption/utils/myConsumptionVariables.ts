import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { Theme } from '@mui/material/styles/createTheme'
import { isNil } from 'lodash'

/**
 * Data Consumption Period.
 */
export const dataConsumptionPeriod = [
    {
        name: 'Jour',
        interval: '2min',
        range: getRange('day'),
        period: 'daily' as periodType,
    },
    {
        name: 'Semaine',
        interval: '1d',
        range: getRange('week'),
        period: 'weekly' as periodType,
    },
    {
        name: 'Mois',
        interval: '1d',
        range: getRange('month'),
        period: 'monthly' as periodType,
    },

    {
        name: 'Année',
        interval: '1 month',
        range: getRange('year'),
        period: 'yearly' as periodType,
    },
]
/**
 *  Button options.
 */
export const buttonOptions = [
    { value: 'reset', label: '∅', targets: [] },
    {
        value: 'temperature',
        label: 'T°',
        targets: [metricTargetsEnum.externalTemperature, metricTargetsEnum.internalTemperature],
    },
    { value: 'Pmax', label: 'Pmax', targets: [metricTargetsEnum.pMax] },
]
/**
 * Target options.
 */
export const targetOptions: metricTargetsEnum[] = [
    metricTargetsEnum.externalTemperature,
    metricTargetsEnum.internalTemperature,
    metricTargetsEnum.pMax,
]

/**
 * Properties for the different metricTarget apexCharts of MyConsumptionChart.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const chartSpecifities: {
    /**
     * For each metric target, we can store color, label and additional apexCharts ApexYAxis options such as seriesNames, show, ..etc.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    [key in metricTargetsEnum]: ApexYAxis & { label?: string }
} = {
    [metricTargetsEnum.consumption]: {
        label: 'Consommation',
    },
    [metricTargetsEnum.internalTemperature]: {
        label: 'Température Intérieure',
        // We put seriesName the same as internal temperature so that internal and external temperature charts will show their values in the same YAxis, instead of having 2 YAxis for each chart.
        seriesName: 'Température Extérieure',
    },
    [metricTargetsEnum.externalTemperature]: {
        label: 'Température Extérieure',
        // We put seriesName the same as internal temperature so that internal and external temperature charts will show their values in the same YAxis, instead of having 2 YAxis for each chart.
        seriesName: 'Température Intérieure',
        // Show is false here so that we don't show external temperature YAxis because its values will be shown on internal Temperature YAxis
        show: false,
    },
    [metricTargetsEnum.pMax]: {
        label: 'Pmax',
    },
}

/**
 * Function that returns the color for each metricTarget Chart.
 *
 * @param chartName MetricTarget Chart.
 * @param theme Current MUI Theme Applied.
 * @returns Color of the chartName.
 */
export const getChartColor = (chartName: metricTargetsEnum, theme: Theme) => {
    switch (chartName) {
        case metricTargetsEnum.externalTemperature:
            return theme.palette.secondary.main
        case metricTargetsEnum.internalTemperature:
            return '#BA1B1B'
        case metricTargetsEnum.pMax:
            return '#FF7A00'
        default:
            return theme.palette.primary.light
    }
}

/**
 * Function that returns the text shown (in yAxisLabels and tooltip) in chart for each y value point.
 *
 * For Example: Consumption chart for a given y datapoint will show.
 *  - "{value} W" when period is day.
 *  - And "{value/1000} kWh" when period is different than day, we divide by 1000 because data returned is in Watt and thus we divide and show the unit.
 *
 * @param yValue Given Y value datapoint in the chart (we'll go through all the y values).
 * @param chartName MetricTarget Chart.
 * @param period Represents the current period ('daily', 'weekly', 'monthly', 'yearly' ...etc), which will be used to handle xAxis values format (for example when yearly we should show values as 'January', 'February', ...etc).
 * @returns Text shown for each y value datapoint.
 */
export const getYPointValueLabel = (
    yValue: number | null | undefined,
    chartName: metricTargetsEnum,
    period: periodType,
) => {
    // IsNill check that value is undefined or null.
    const value = isNil(yValue) ? '' : yValue
    switch (chartName) {
        case metricTargetsEnum.externalTemperature:
        case metricTargetsEnum.internalTemperature:
            return `${value} °C`
        case metricTargetsEnum.pMax:
            // Value given by backend is in Va and thus convert it to kVA.
            return value === '' ? `${value} kVA` : `${(value / 1000).toFixed(2)} kVA`
        default:
            if (period === 'daily') return `${value} W`
            return value === '' ? `${value} kWh` : `${(value / 1000).toFixed(2)} kWh`
    }
}
