import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { getRange } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { Theme } from '@mui/material/styles/createTheme'

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
 * Properties for the different metricTarget apexCharts of MyConsumptionChart.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const chartSpecifities: {
    /**
     * For each metric target, we can store color, label and additional apexCharts ApexYAxis options such as seriesNames, show, ..etc.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    [key in metricTargetsEnum]: ApexYAxis & { label?: string; unit?: string }
} = {
    [metricTargetsEnum.consumption]: {
        label: 'Consommation',
        unit: 'KWh',
    },
    [metricTargetsEnum.internalTemperatur]: {
        label: 'Température Intérieure',
        unit: '°C',
    },
    [metricTargetsEnum.externalTemperatur]: {
        label: 'Température Extérieure',
        unit: '°C',
        // We put seriesName the same as internal temperature so that internal and external temperature charts will show their values in the same YAxis, instead of having 2 YAxis for each chart.
        seriesName: 'Température Intérieure',
        // Show is false here so that we don't show external temperature YAxis because its values will be shown on internal Temperature YAxis
        show: false,
    },
    [metricTargetsEnum.pMax]: {},
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
        case metricTargetsEnum.externalTemperatur:
            return theme.palette.secondary.main
        case metricTargetsEnum.internalTemperatur:
            return '#BA1B1B'
        default:
            return theme.palette.primary.light
    }
}
