import { AlertPeriodEnum, AlertTypeEnum } from 'src/modules/Dashboard/AlertWidgetsContainer/AlertWidget/AlertWidget.d'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'

/**
 * AlertPeriod texts to use in the title an error message of the widget.
 */
export const alertPeriodText = {
    title: {
        [AlertPeriodEnum.DAILY]: 'journalier',
        [AlertPeriodEnum.WEEKLY]: 'hebdomadaire',
        [AlertPeriodEnum.MONTHLY]: 'mensuel',
    },
    error: {
        [AlertPeriodEnum.DAILY]: 'quotidienne',
        [AlertPeriodEnum.WEEKLY]: 'hebdomadaire',
        [AlertPeriodEnum.MONTHLY]: 'mensuelle',
    },
}

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
