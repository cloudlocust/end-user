import { EcowattAlertsNovuPreferencesType } from 'src/modules/Ecowatt/ecowatt'
import { ConsumptionNovuAlertPreferencesType } from 'src/modules/Layout/Toolbar/components/Alerts/ConsumptionAlert/consumptionAlert'
import { TempoAlertPreferencesType } from 'src/modules/Layout/Toolbar/components/Alerts/TempoAlerts/TempoAlerts'

/**
 * Model for all novu alerts alerts.
 */
export type INovuAlertPreferences = EcowattAlertsNovuPreferencesType &
    ConsumptionNovuAlertPreferencesType &
    TempoAlertPreferencesType
