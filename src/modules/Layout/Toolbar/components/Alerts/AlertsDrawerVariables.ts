import { getDateWithoutTimezoneOffset } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

/**
 * Set new range for this mounth to see if user has contract.
 */
export const rangeOfCurrentMonth = {
    from: getDateWithoutTimezoneOffset(startOfMonth(subMonths(new Date(), 1))),
    to: getDateWithoutTimezoneOffset(endOfMonth(subMonths(new Date(), 1))),
}
