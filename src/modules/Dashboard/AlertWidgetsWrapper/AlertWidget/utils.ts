import { AlertPeriodEnum, AlertTypeEnum } from 'src/modules/Dashboard/AlertWidgetsWrapper/AlertWidget/AlertWidget.d'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'

/**
 * Calculate the percent prop for the GaugeChart component.
 *
 * @param alertThreshold The alert threshold (seuil) value for consumption (in Wh) or price (in €).
 * @param currentValue The current value of the consumption (in Wh) or price (in €).
 * @returns The percent prop value.
 */
export const calculateGaugeChartPercent = (alertThreshold: number, currentValue: number): number => {
    if (alertThreshold <= 0) {
        return 1
    } else {
        return Math.min(1, Number((currentValue / alertThreshold).toFixed(2)))
    }
}

/**
 * Get the alertPeriod correcponding text to use in the widget title.
 *
 * @param alertPeriod The alert period.
 * @returns The alertPeriod title text.
 */
export const getAlertPeriodTitleText = (alertPeriod: AlertPeriodEnum): string => {
    switch (alertPeriod) {
        case AlertPeriodEnum.DAILY:
            return 'journalier'
        case AlertPeriodEnum.WEEKLY:
            return 'hebdomadaire'
        case AlertPeriodEnum.MONTHLY:
            return 'mensuel'
        default:
            return ''
    }
}

/**
 * Get the alertPeriod correcponding text to use in the widget error message.
 *
 * @param alertPeriod The alert period.
 * @returns The alertPeriod error message text.
 */
export const getAlertPeriodErrorText = (alertPeriod: AlertPeriodEnum): string => {
    switch (alertPeriod) {
        case AlertPeriodEnum.DAILY:
            return 'quotidienne'
        case AlertPeriodEnum.WEEKLY:
            return 'hebdomadaire'
        case AlertPeriodEnum.MONTHLY:
            return 'mensuelle'
        default:
            return ''
    }
}

/**
 * Get the formated alertThreshold value depending on the alertType.
 *
 * @param alertThreshold The alert threshold (seuil) value for consumption (in Wh) or price (in €).
 * @param alertType The alert type.
 * @returns The formated alertThreshold value.
 */
export const getFormatedAlertThreshold = (alertThreshold: number, alertType: AlertTypeEnum): string => {
    switch (alertType) {
        case AlertTypeEnum.PRICE:
            return `${Number(alertThreshold.toFixed(2))} €`
        case AlertTypeEnum.CONSUMPTION:
            const { value, unit } = consumptionWattUnitConversion(alertThreshold)
            return `${Number(value.toFixed(2))} ${unit}`
        default:
            return ''
    }
}
