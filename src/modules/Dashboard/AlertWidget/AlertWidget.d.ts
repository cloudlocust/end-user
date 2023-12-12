/**
 * Enum representing different alert types.
 */
export enum AlertTypeEnum {
    /**
     * Price alert type.
     */
    PRICE = 'price',
    /**
     * Consumption alert type.
     */
    CONSUMPTION = 'consumption',
}

/**
 * Enum representing different alert periods.
 */
export enum AlertPeriodEnum {
    /**
     * Day alert period.
     */
    DAY = 'day',
    /**
     * Week alert period.
     */
    WEEK = 'week',
    /**
     * Month alert period.
     */
    MONTH = 'month',
}

/**
 * Props for the AlertWidget component.
 */
export interface AlertWidgetProps {
    /**
     * The alert type.
     */
    alertType: AlertTypeEnum
    /**
     * The alert period.
     */
    alertPeriod: AlertPeriodEnum
    /**
     * The alert threshold (seuil) value for consumption or price.
     */
    alertThreshold?: number
    /**
     * The current value of the consumption or price.
     */
    currentValue: number
    /**
     * The content of the alert widget is loading.
     */
    isLoading?: boolean
}
