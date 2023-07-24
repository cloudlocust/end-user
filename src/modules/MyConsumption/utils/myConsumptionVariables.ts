import { metricTargetsEnum, metricTargetsType, metricTargetType } from 'src/modules/Metrics/Metrics.d'
import { globalProductionFeatureState } from 'src/modules/MyHouse/MyHouseConfig'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes'
import { Theme } from '@mui/material/styles/createTheme'
import { isNil } from 'lodash'
import convert, { Unit } from 'convert-units'

/**
 * Data Consumption Period.
 */
export const dataConsumptionPeriod = [
    {
        name: 'Jour',
        interval: '1m',
        period: 'daily' as PeriodEnum,
    },
    {
        name: 'Semaine',
        interval: '1d',
        period: 'weekly' as PeriodEnum,
    },
    {
        name: 'Mois',
        interval: '1d',
        period: 'monthly' as PeriodEnum,
    },

    {
        name: 'Année',
        interval: '1M',
        period: 'yearly' as PeriodEnum,
    },
]
/**
 * Mobile Date Picker Period Props.
 */
export const mobileDatePickerPeriodProps = [
    {
        period: 'daily',
        views: ['day'],
        width: '95px',
        inputFormat: 'dd/MM/yyyy',
    },
    {
        period: 'weekly',
        views: ['day'],
        width: '95px',
        inputFormat: 'dd/MM/yyyy',
    },
    {
        period: 'monthly',
        views: ['month', 'year'],
        width: '65px',
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
 * Target options.
 */
export const targetOptions: metricTargetsEnum[] = [
    metricTargetsEnum.externalTemperature,
    metricTargetsEnum.internalTemperature,
    metricTargetsEnum.pMax,
]

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
            return '#FFC200'
        case metricTargetsEnum.internalTemperature:
            return '#BA1B1B'
        case metricTargetsEnum.pMax:
            return '#FF7A00'
        case metricTargetsEnum.eurosConsumption:
            return theme.palette.primary.light
        case metricTargetsEnum.autoconsumption:
            return '#BEECDB'
        case metricTargetsEnum.totalProduction:
            return '#C8D210'
        case metricTargetsEnum.injectedProduction:
            return '#6E9A8B'
        case metricTargetsEnum.subscriptionPrices:
            return '#CCDCDD'
        default:
            return theme.palette.secondary.main
    }
}

/**
 * Function that returns the text shown (in yAxisLabels and tooltip) in chart for each y value point.
 *
 * For Example: Consumption chart for a given y datapoint will show.
 *  - "{value} W" when period is day.
 *  - And "{value} {unit}" depends on the unit of the maximum value, whether (W, kWh, MWh) so that we have one synchronized unit depending on the maxValue.
 *
 * @param yValue Given Y value datapoint in the chart (we'll go through all the y values).
 * @param chartName MetricTarget Chart.
 * @param unit The unit for consumption, it's given outside as its related with the unit of maximum value to have one unit for all values in consumption chart.
 * @param isYValueRounded Indicate if Math.round should be applied to the value.
 * @returns Text shown for each y value datapoint.
 */
export const getYPointValueLabel = (
    yValue: number | null | undefined,
    chartName: metricTargetsEnum,
    unit?: Unit,
    isYValueRounded?: boolean,
) => {
    // IsNill check that value is undefined or null.
    const value = isNil(yValue) ? '' : yValue
    switch (chartName) {
        case metricTargetsEnum.eurosConsumption:
        case metricTargetsEnum.subscriptionPrices:
            return `${value === '' ? value : value.toFixed(2)} €`
        case metricTargetsEnum.externalTemperature:
        case metricTargetsEnum.internalTemperature:
            return `${value} °C`
        case metricTargetsEnum.pMax:
            // Value given by backend is in Va and thus convert it to kVA.
            return `${value === '' ? value : convert(value).from('VA').to('kVA'!).toFixed(2)} kVA`
        case metricTargetsEnum.consumption:
        case metricTargetsEnum.autoconsumption:
        case metricTargetsEnum.totalProduction:
        case metricTargetsEnum.injectedProduction:
            return `${
                value === ''
                    ? value
                    : isYValueRounded
                    ? Math.round(convert(value).from('Wh').to(unit!))
                    : convert(value).from('Wh').to(unit!).toFixed(2)
            } ${unit}`
        default:
            return ` ${unit}`
    }
}
/**
 * Nrlink & Enedis Off message.
 */
export const NRLINK_ENEDIS_OFF_MESSAGE =
    'Pour voir vos données de consommation, veuillez connecter votre nrLINK ou Enedis'

/**
 * Enphase off message.
 */
export const ENPHASE_OFF_MESSAGE = 'Pour voir vos données de production veuillez connecter votre onduleur'

/**
 * Targets for initialMetricHook for MyConsumption page.
 */
export const metricTargetsHook: metricTargetsType = [
    {
        target: metricTargetsEnum.autoconsumption,
        type: 'timeserie',
    },
    {
        target: metricTargetsEnum.consumption,
        type: 'timeserie',
    },
    {
        target: metricTargetsEnum.eurosConsumption,
        type: 'timeserie',
    },
    {
        target: metricTargetsEnum.pMax,
        type: 'timeserie',
    },
    {
        target: metricTargetsEnum.externalTemperature,
        type: 'timeserie',
    },
    {
        target: metricTargetsEnum.internalTemperature,
        type: 'timeserie',
    },
    {
        target: metricTargetsEnum.totalProduction,
        type: 'timeserie',
    },
    {
        target: metricTargetsEnum.injectedProduction,
        type: 'timeserie',
    },
]

/**
 * Targets shown in ConsumptionChart.
 */
export const ConsumptionChartTargets: metricTargetType[] = [
    metricTargetsEnum.autoconsumption,
    metricTargetsEnum.consumption,
    metricTargetsEnum.eurosConsumption,
    metricTargetsEnum.pMax,
    metricTargetsEnum.externalTemperature,
    metricTargetsEnum.internalTemperature,
]

/**
 * When EnphaseOff Targets shown in ConsumptionChart.
 */
export const EnphaseOffConsumptionChartTargets: metricTargetType[] = [
    metricTargetsEnum.consumption,
    metricTargetsEnum.eurosConsumption,
    metricTargetsEnum.pMax,
    metricTargetsEnum.externalTemperature,
    metricTargetsEnum.internalTemperature,
]

/**
 * Widget Targets.
 *
 * If enphaseConsentFeature is enabled, then we show totalProduction, injectedProduction and autoconsumption widgets.
 */
export const WidgetTargets: metricTargetType[] = globalProductionFeatureState
    ? [
          metricTargetsEnum.consumption,
          metricTargetsEnum.totalProduction,
          metricTargetsEnum.eurosConsumption,
          metricTargetsEnum.autoconsumption,
          metricTargetsEnum.pMax,
          metricTargetsEnum.externalTemperature,
          metricTargetsEnum.internalTemperature,
      ]
    : [
          metricTargetsEnum.consumption,
          metricTargetsEnum.eurosConsumption,
          metricTargetsEnum.pMax,
          metricTargetsEnum.externalTemperature,
          metricTargetsEnum.internalTemperature,
      ]
