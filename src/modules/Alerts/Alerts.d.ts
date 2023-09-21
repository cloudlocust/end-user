import { EcowattAlertsNovuPreferencesType } from 'src/modules/Ecowatt/ecowatt'
import { ConsumptionNovuAlertPreferencesType } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlert'
import { TempoAlertPreferencesType } from 'src/modules/Alerts/components/TempoAlerts/TempoAlerts'
import { PowerMaxNovuPreferencesType } from './components/PowerMaxAlert/powerMaxAlert'

/**
 * Model for all novu alerts alerts.
 */
export type INovuAlertPreferences = EcowattAlertsNovuPreferencesType &
    ConsumptionNovuAlertPreferencesType &
    TempoAlertPreferencesType &
    PowerMaxNovuPreferencesType

/**
 * Novu Available channels.
 */
export type NovuChannels = 'push' | 'email'

/**
 * Novu value and key.
 */
type NovuChannelValueAndKeyName = /**
 */ {
    /**
     * Value of channel.
     */
    value: boolean
    /**
     * Name of the correspondant key.
     */
    key: keyof INovuAlertPreferences
}

/**
 * For Novu channels with the name of the key for the template.
 */
export type NovuChannelsWithValueAndKey = {
    [keys in NovuChannels]: NovuChannelValueAndKeyName
}
