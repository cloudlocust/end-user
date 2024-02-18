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
     * Daily period.
     */
    DAILY = 'daily',
    /**
     * Weekly period.
     */
    WEEKLY = 'weekly',
    /**
     * Monthly period.
     */
    MONTHLY = 'monthly',
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
     * The alert threshold (seuil) value for consumption (in Wh) or price (in €).
     */
    alertThreshold?: number
    /**
     * The current value of the consumption (in Wh) or price (in €).
     */
    currentValue: number
}
