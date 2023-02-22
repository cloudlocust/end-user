import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'
import {
    ConsumptionAlertIntervalsType,
    ConsumptionNovuAlertPreferencesType,
    NovuChannelsWithValueAndKey,
} from './ConsumptionAlert/consumptionAlert'

/**
 * Set new range for this mounth to see if user has contract.
 */
export const rangeOfCurrentMonth = {
    from: getDateWithoutTimezoneOffset(startOfMonth(subMonths(new Date(), 1))),
    to: getDateWithoutTimezoneOffset(endOfMonth(subMonths(new Date(), 1))),
}

/**
 * Function that get passed the interval, and the novu preferences (to get the initial values) and return formated object of initial values.
 *
 * @param interval Interval of the consumption.
 * @param novuAlertPreferences Novu preferences for the consumption alerts.
 * @returns Formated object of initial values for channel.
 */
export const getChannelPreferencesByInterval = (
    interval: ConsumptionAlertIntervalsType,
    novuAlertPreferences: ConsumptionNovuAlertPreferencesType,
) => {
    // if no novu alert preferences was provided we leave the function.
    if (!novuAlertPreferences) return

    // variable to be used as template for the response.
    let response: NovuChannelsWithValueAndKey = {
        push: {
            key: 'isPushDailyConsumption',
            value: false,
        },
        email: {
            key: 'isEmailDailyConsumption',
            value: false,
        },
    }

    // following the interval we pass key and the value of the channel state to be used.
    switch (interval) {
        case 'day':
            response.push.key = 'isPushDailyConsumption'
            response.push.value = novuAlertPreferences.isPushDailyConsumption ?? false

            response.email.key = 'isPushDailyConsumption'
            response.email.value = novuAlertPreferences.isEmailDailyConsumption ?? false

            return response
        case 'week':
            response.push.key = 'isPushWeeklyConsumption'
            response.push.value = novuAlertPreferences.isPushWeeklyConsumption ?? false

            response.email.key = 'isEmailWeeklyConsumption'
            response.email.value = novuAlertPreferences.isEmailWeeklyConsumption ?? false

            return response
        case 'month':
            response.push.key = 'isPushMonthlyConsumption'
            response.push.value = novuAlertPreferences.isPushMonthlyConsumption ?? false

            response.email.key = 'isEmailMonthlyConsumption'
            response.email.value = novuAlertPreferences.isEmailMonthlyConsumption ?? false

            return response
        default:
            return
    }
}
