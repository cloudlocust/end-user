import { AlertPeriodEnum } from 'src/modules/Dashboard/AlertWidgetsContainer/AlertWidget/AlertWidget.d'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * Default value for consumption value and unit.
 */
export const emptyConsumptionValueUnit = { value: 0, unit: 'Wh' }

/**
 * Object of corresponding AlertPeriodEnum values for the alerts interval attribute.
 */
export const alertPeriods = {
    day: AlertPeriodEnum.DAILY,
    week: AlertPeriodEnum.WEEKLY,
    month: AlertPeriodEnum.MONTHLY,
}

/**
 * Array of AlertPeriodEnum values.
 */
export const alertPeriodsArray = [AlertPeriodEnum.DAILY, AlertPeriodEnum.WEEKLY, AlertPeriodEnum.MONTHLY]

/**
 * Function to converte AlertPeriodEnum value to PeriodEnum value.
 *
 * @param alertPeriod AlertPeriodEnum value.
 * @returns PeriodEnum value.
 */
export const convertAlertPeriodEnumToPeriodEnum = (alertPeriod: AlertPeriodEnum): PeriodEnum => {
    switch (alertPeriod) {
        case AlertPeriodEnum.DAILY:
            return PeriodEnum.DAILY
        case AlertPeriodEnum.WEEKLY:
            return PeriodEnum.WEEKLY
        case AlertPeriodEnum.MONTHLY:
            return PeriodEnum.MONTHLY
    }
}
