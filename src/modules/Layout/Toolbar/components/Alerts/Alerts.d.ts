import { EcowattAlertsNovuPreferencesType } from 'src/modules/Ecowatt/ecowatt'
import { IConsumptionNovuAlertPreferences } from 'src/modules/Layout/Toolbar/components/Alerts/ConsumptionAlert/consumptionAlert'

/**
 * Model for all novu alerts alerts.
 */
export type INovuAlertPreferences = EcowattAlertsNovuPreferencesType & IConsumptionNovuAlertPreferences
