import { metricTargetsEnum, metricTargetType } from 'src/modules/Metrics/Metrics.d'
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
 * Transparent color.
 */
export const TRANSPARENT_COLOR = 'rgba(255,255,255, .0)'

/**
 * Function that returns the color for each metricTarget Chart.
 *
 * @param chartName MetricTarget Chart.
 * @param theme Current MUI Theme Applied.
 * @param enphaseOff Enphase consent not ACTIVE.
 * @returns Color of the chartName.
 */
export const getChartColor = (chartName: metricTargetsEnum, theme: Theme, enphaseOff?: boolean) => {
    switch (chartName) {
        case metricTargetsEnum.externalTemperature:
            return '#FFC200'
        case metricTargetsEnum.internalTemperature:
            return '#BA1B1B'
        case metricTargetsEnum.pMax:
            return '#FF7A00'
        case metricTargetsEnum.eurosConsumption:
            return TRANSPARENT_COLOR
        case metricTargetsEnum.baseEuroConsumption:
        case metricTargetsEnum.onlyEuroConsumption:
            return theme.palette.primary.light
        case metricTargetsEnum.autoconsumption:
            return '#BEECDB'
        case metricTargetsEnum.idleConsumption:
            return '#8191B2'
        case metricTargetsEnum.totalProduction:
            return '#C8D210'
        case metricTargetsEnum.injectedProduction:
            return '#6E9A8B'
        case metricTargetsEnum.subscriptionPrices:
            return '#CCDCDD'
        case metricTargetsEnum.peakHourConsumption:
            return '#CC9121'
        case metricTargetsEnum.offPeakHourConsumption:
            return '#CCAB1D'
        case metricTargetsEnum.totalOffIdleConsumption:
            return theme.palette.secondary.main
        case metricTargetsEnum.consumption:
            return enphaseOff ? TRANSPARENT_COLOR : theme.palette.secondary.main
        case metricTargetsEnum.euroPeakHourConsumption:
            return '#4DD9E4'
        case metricTargetsEnum.euroOffPeakConsumption:
            return '#006970'
        case metricTargetsEnum.onlyConsumption:
            return theme.palette.secondary.main
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
        case metricTargetsEnum.baseEuroConsumption:
        case metricTargetsEnum.subscriptionPrices:
        case metricTargetsEnum.euroPeakHourConsumption:
        case metricTargetsEnum.euroOffPeakConsumption:
        case metricTargetsEnum.onlyEuroConsumption:
            return `${value === '' ? value : value.toFixed(2)} €`
        case metricTargetsEnum.externalTemperature:
        case metricTargetsEnum.internalTemperature:
            return `${value} °C`
        case metricTargetsEnum.pMax:
            // Value given by backend is in Va and thus convert it to kVA.
            return `${value === '' ? value : convert(value).from('VA').to('kVA'!).toFixed(2)} kVA`
        case metricTargetsEnum.consumption:
        case metricTargetsEnum.baseConsumption:
        case metricTargetsEnum.autoconsumption:
        case metricTargetsEnum.totalProduction:
        case metricTargetsEnum.idleConsumption:
        case metricTargetsEnum.totalOffIdleConsumption:
        case metricTargetsEnum.injectedProduction:
        case metricTargetsEnum.peakHourConsumption:
        case metricTargetsEnum.offPeakHourConsumption:
        case metricTargetsEnum.onlyConsumption:
            return `${
                value === ''
                    ? value
                    : isYValueRounded
                    ? Math.round(convert(value).from('Wh').to(unit!))
                    : // With .toFixed it rounds up the number, doing slice and toFixed(3) will make sure to truncate and not round up.
                      // So that we have a result of a number with two digits after the decimal point.
                      convert(value).from('Wh').to(unit!).toFixed(3).slice(0, -1)
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
 * Targets when enphase is ON.
 * Enphase off message.
 */
export const PRODUCTION_OFF_MESSAGE =
    'Pour voir vos données de production veuillez connecter votre onduleur Ou Reliez la prise Shelly de vos panneaux plug&play'

/**
 * Targets shown in ConsumptionChart.
 */
export const ConsumptionChartTargets: metricTargetType[] = [
    metricTargetsEnum.autoconsumption,
    metricTargetsEnum.consumption,
    metricTargetsEnum.baseConsumption,
    metricTargetsEnum.eurosConsumption,
    metricTargetsEnum.pMax,
    metricTargetsEnum.externalTemperature,
    metricTargetsEnum.internalTemperature,
    metricTargetsEnum.peakHourConsumption,
    metricTargetsEnum.offPeakHourConsumption,
]

/**
 * When EnphaseOff Targets shown in ConsumptionChart.
 */
export const EnphaseOffConsumptionChartTargets: metricTargetType[] = [
    metricTargetsEnum.baseConsumption,
    metricTargetsEnum.consumption,
    metricTargetsEnum.eurosConsumption,
    metricTargetsEnum.pMax,
    metricTargetsEnum.externalTemperature,
    metricTargetsEnum.internalTemperature,
    metricTargetsEnum.peakHourConsumption,
    metricTargetsEnum.offPeakHourConsumption,
]

/**
 * Targets related to idleConsumption.
 */
export const idleConsumptionTargets: metricTargetType[] = [
    metricTargetsEnum.idleConsumption,
    metricTargetsEnum.consumption,
]

/**
 * Targets related to Euros IdleConsumption.
 */
export const eurosIdleConsumptionTargets: metricTargetType[] = [
    metricTargetsEnum.eurosIdleConsumption,
    metricTargetsEnum.eurosConsumption,
]

/**
 * Targets related to Euros Consumption.
 */
export const eurosConsumptionTargets: metricTargetType[] = [
    metricTargetsEnum.eurosConsumption,
    metricTargetsEnum.baseEuroConsumption,
    metricTargetsEnum.euroPeakHourConsumption,
    metricTargetsEnum.euroOffPeakConsumption,
    metricTargetsEnum.subscriptionPrices,
]

/**
 * Targets related to the TargetMenuGroup button which consists of temperature and pMax.
 */
export const temperatureOrPmaxTargets: metricTargetType[] = [
    metricTargetsEnum.pMax,
    metricTargetsEnum.internalTemperature,
    metricTargetsEnum.externalTemperature,
]
