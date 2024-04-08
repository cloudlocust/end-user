import {
    faqForDailyPeriod,
    faqForDailyPeriodTempo,
    faqForPeriodicIntervals,
    faqForPeriodicIntervalsTempo,
    faqTitleForDailyPeriod,
    faqTitleForDailyPeriodTempo,
    faqTitleForPeriodicIntervals,
    faqTitleForPeriodicIntervalsTempo,
} from 'src/modules/MyConsumption/components/ChartFAQ/ChartFAQVariables'
import { FAQItem } from 'src/modules/shared/FAQ/FAQ.types'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * Retrieves the FAQ items and title based on the given period and contract type.
 *
 * @param period - The period enum value.
 * @param hasTempoContract - Indicates whether the user has a tempo contract.
 * @returns An array containing the FAQ items and the FAQ title.
 */
export const getFAQItemsByPeriodAndContractType = (
    period: PeriodEnum,
    hasTempoContract: boolean,
): [Array<FAQItem>, string | JSX.Element] => {
    switch (period) {
        case PeriodEnum.DAILY:
            return hasTempoContract
                ? [faqForDailyPeriodTempo, faqTitleForDailyPeriodTempo]
                : [faqForDailyPeriod, faqTitleForDailyPeriod]
        case PeriodEnum.WEEKLY:
        case PeriodEnum.MONTHLY:
        case PeriodEnum.YEARLY:
            return hasTempoContract
                ? [faqForPeriodicIntervalsTempo, faqTitleForPeriodicIntervalsTempo]
                : [faqForPeriodicIntervals, faqTitleForPeriodicIntervals]
        default:
            return [faqForDailyPeriod, faqTitleForDailyPeriod]
    }
}
