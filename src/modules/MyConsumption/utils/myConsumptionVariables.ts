import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'
import { Theme } from '@mui/material/styles/createTheme'

/**
 * Data Consumption Period.
 */
export const dataConsumptionPeriod = [
    {
        name: 'Jour',
        interval: '2min',
        period: 'daily' as periodType,
    },
    {
        name: 'Semaine',
        interval: '1d',
        period: 'weekly' as periodType,
    },
    {
        name: 'Mois',
        interval: '1d',
        period: 'monthly' as periodType,
    },

    {
        name: 'Année',
        interval: '1 month',
        period: 'yearly' as periodType,
    },
]
/**
 * Mobile Date Picker Period Props.
 */
export const mobileDatePickerPeriodProps = [
    {
        period: 'daily',
        views: ['day'],
        width: '80px',
        inputFormat: 'dd/MM/yyyy',
    },
    {
        period: 'weekly',
        views: ['day'],
        width: '80px',
        inputFormat: 'dd/MM/yyyy',
    },
    {
        period: 'monthly',
        views: ['month', 'year'],
        width: '55px',
        inputFormat: 'MM/yyyy',
    },
    {
        period: 'yearly',
        views: ['year'],
        width: '40px',
        inputFormat: 'yyyy',
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
    [key in metricTargetsEnum]: ApexYAxis & { label?: string; unit?: string }
} = {
    [metricTargetsEnum.consumption]: {
        label: 'Consommation',
        unit: 'KWh',
    },
    [metricTargetsEnum.internalTemperature]: {
        label: 'Température Intérieure',
        unit: '°C',
        // We put seriesName the same as internal temperature so that internal and external temperature charts will show their values in the same YAxis, instead of having 2 YAxis for each chart.
        seriesName: 'Température Extérieure',
    },
    [metricTargetsEnum.externalTemperature]: {
        label: 'Température Extérieure',
        unit: '°C',
        // We put seriesName the same as internal temperature so that internal and external temperature charts will show their values in the same YAxis, instead of having 2 YAxis for each chart.
        seriesName: 'Température Intérieure',
        // Show is false here so that we don't show external temperature YAxis because its values will be shown on internal Temperature YAxis
        show: false,
    },
    [metricTargetsEnum.pMax]: {
        label: 'Pmax',
        unit: 'kVA',
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
