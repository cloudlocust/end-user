import { INrlinkConsent } from 'src/modules/Consents/Consents'
import { NrlinkMetric } from 'src/modules/Dashboard/StatusWrapper/nrlinkPower'

/**
 * Represents the props for the EnergyStatusWidget component.
 */
export interface EnergyStatusWidgetProps {
    /**
     * Indicates whether the loading is in progress.
     */
    isNrlinkPowerLoading: boolean

    /**
     * The last power data.
     */
    lastPowerData?: NrlinkMetric

    /**
     * Price per Kwh.
     */
    pricePerKwh: number | null

    /**
     * Nrlink consent.
     */
    nrlinkConsent?: INrlinkConsent
}
