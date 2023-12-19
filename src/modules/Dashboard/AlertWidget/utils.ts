import { AlertPeriodEnum, AlertTypeEnum } from 'src/modules/Dashboard/AlertWidget/AlertWidget.d'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'

/**
 * AlertPeriod texts to use in the title an error message of the widget.
 */
export const alertPeriodText = {
    title: {
        [AlertPeriodEnum.DAY]: 'journalier',
        [AlertPeriodEnum.WEEK]: 'hebdomadaire',
        [AlertPeriodEnum.MONTH]: 'mensuel',
    },
    error: {
        [AlertPeriodEnum.DAY]: 'quotidienne',
        [AlertPeriodEnum.WEEK]: 'hebdomadaire',
        [AlertPeriodEnum.MONTH]: 'mensuelle',
    },
}

/**
 * Calculate the percent prop for the GaugeChart component.
 *
 * @param alertThreshold The alert threshold (seuil) value for consumption or price.
 * @param currentValue The current value of the consumption or price.
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
 * @param alertThreshold The alert threshold (seuil) value for consumption or price.
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
