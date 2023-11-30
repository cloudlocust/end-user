import { nrlinkConsentStatus } from 'src/modules/Consents/Consents'
import { IMetric } from 'src/modules/Metrics/Metrics'

/**
 * Enum for Energy Status Widget type.
 */
export enum EnergyStatusWidgetTypeEnum {
    /**
     * Consumption.
     */
    CONSUMPTION = 'consumption',
    /**
     * Production.
     */
    PRODUCTION = 'production',
}

/**
 * EnergyStatusWidget props.
 */
export interface EnergyStatusWidgetProps {
    /**
     * Metrics data.
     */
    data: [] | IMetric[]
    /**
     * Nrlink consent status.
     */
    nrlinkConsent?: nrlinkConsentStatus
    /**
     * Widget type.
     */
    type: EnergyStatusWidgetTypeEnum
    /**
     * Loading state.
     */
    isLoading: boolean
    /**
     * Price per kWh.
     */
    pricePerKwh: number | null
}
