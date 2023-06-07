import { INovuAlertPreferences } from 'src/modules/Alerts'

/**
 * Response object when gitting price per kwh.
 */
export interface IPricePerKwhDataType {
    /**
     * Price per kwh.
     */
    pricePerKwh: number
}

/**
 * The types of intervals that exists for the consumption alerts.
 */
export type ConsumptionAlertIntervalsType = 'day' | 'week' | 'month'

/**
 * Consumption alert data.
 */
export interface ConsumptionAlertData {
    /**
     * Price.
     */
    price: number | null
    /**
     * Consumption.
     */
    consumption: number | null
}

/**
 * Consumption Alert.
 */
export interface IConsumptionAlert extends ConsumptionAlertData {
    /**
     * Interval of consumption.
     */
    interval: ConsumptionAlertIntervalsType
}

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
    key: keyof ConsumptionNovuAlertPreferencesType
}

/**
 * For Novu channels with the name of the key for the template.
 */
export type NovuChannelsWithValueAndKey = {
    [keys in NovuChannels]: NovuChannelValueAndKeyName
}

/**
 * Consumption Alert component prop Type.
 */
export interface ConsumptionAlertPropsType {
    /**
     * Interval for the consumption alert.
     */
    interval: ConsumptionAlertIntervalsType
    /**
     * Initial value for the text fields.
     */
    initialConsumptionDataValues: ConsumptionAlertData | undefined
    /**
     * Price per Kwh.
     */
    pricePerKwh?: number | null
    /**
     * Save consumption alert.
     */
    saveConsumptionAlert: (data: ConsumptionAlertData, interval: ConsumptionAlertIntervalsType) => void
    /**
     * Is consumption alerts values loading.
     */
    isConsumptionAlertsLoading: boolean
    /**
     * Is saving alert loading.
     */
    isSavingAlertLoading: boolean
    /**
     * Is Novu Alert Preferences loading.
     */
    isNovuAlertPreferencesLoading: boolean
    /**
     * Novu alert preferences state.
     */
    initialAlertPreferencesValues: NovuChannelsWithValueAndKey | undefined
    /**
     * Update Novu alert preferences.
     */
    updateNovuAlertPreferences: (alerts: INovuAlertPreferences, resetValues?: () => void) => void
}

/**
 * Consumption Alert inputs fields component props Type.
 */
export interface ConsumptionAlertInputFieldsComponentPropsType {
    /**
     * Is form Edit.
     */
    isEdit: boolean
    /**
     * Price per Kwh.
     */
    pricePerKwh: number | null | undefined
    /**
     * Set to delete Before send.
     */
    setToDeleteBeforeSend: (value: 'price' | 'consumption' | null) => void
    /**
     * Form values that keeps variables updated.
     */
    formValues: ConsumptionAlertData | undefined
}

/**
 * Consumption Alert buttons group props type.
 */
export interface ConsumptionAlertButtonGroupPropsType {
    /**
     * Is button loading.
     */
    isConsumptionAlertsLoading: boolean
    /**
     * Is button loading.
     */
    isSavingAlertLoading: boolean
}

/**
 * Model for Consumption alerts Novu preferences.
 */
export interface ConsumptionNovuAlertPreferencesType {
    /**
     * State of push notification for daily consumption.
     */
    isPushDailyConsumption?: boolean
    /**
     * State of email notification for daily consumption.
     */
    isEmailDailyConsumption?: boolean
    /**
     * State of push notification for weekly consumption.
     */
    isPushWeeklyConsumption?: boolean
    /**
     * State of email notification for weekly consumption.
     */
    isEmailWeeklyConsumption?: boolean
    /**
     * State of push notification for monthly consumption.
     */
    isPushMonthlyConsumption?: boolean
    /**
     * State of email notification for monthly consumption.
     */
    isEmailMonthlyConsumption?: boolean
}
