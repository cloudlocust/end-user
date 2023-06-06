import { EcowattAlertsNovuPreferencesType } from 'src/modules/Ecowatt/ecowatt'
import { ConsumptionNovuAlertPreferencesType } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlert'
import { TempoAlertPreferencesType } from 'src/modules/Alerts/components/TempoAlerts/TempoAlerts'

/**
 * Model for all novu alerts alerts.
 */
export type INovuAlertPreferences = EcowattAlertsNovuPreferencesType &
    ConsumptionNovuAlertPreferencesType &
    TempoAlertPreferencesType
