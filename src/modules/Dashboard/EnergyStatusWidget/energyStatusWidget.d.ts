import { nrlinkConsentStatus } from 'src/modules/Consents/Consents'
import { IMetric } from 'src/modules/Metrics/Metrics'

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
    type: 'consumption' | 'production'
    /**
     * Loading state.
     */
    isLoading: boolean
}
