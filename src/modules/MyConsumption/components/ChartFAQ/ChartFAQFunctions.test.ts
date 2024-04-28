import { getFAQItemsByPeriodAndContractType } from 'src/modules/MyConsumption/components/ChartFAQ/ChartFAQFunctions'
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
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

describe('getFAQItemsByPeriodAndContractType', () => {
    it('should return FAQ items for daily period and non-tempo contract', () => {
        const period = PeriodEnum.DAILY
        const hasTempoContract = false
        const expectedFAQItems = [faqForDailyPeriod, faqTitleForDailyPeriod]

        const result = getFAQItemsByPeriodAndContractType(period, hasTempoContract)

        expect(result).toEqual(expectedFAQItems)
    })

    it('should return FAQ items for daily period and tempo contract', () => {
        const period = PeriodEnum.DAILY
        const hasTempoContract = true
        const expectedFAQItems = [faqForDailyPeriodTempo, faqTitleForDailyPeriodTempo]

        const result = getFAQItemsByPeriodAndContractType(period, hasTempoContract)

        expect(result).toEqual(expectedFAQItems)
    })

    it('should return FAQ items for periodic intervals and non-tempo contract', () => {
        const period = PeriodEnum.MONTHLY
        const hasTempoContract = false
        const expectedFAQItems = [faqForPeriodicIntervals, faqTitleForPeriodicIntervals]

        const result = getFAQItemsByPeriodAndContractType(period, hasTempoContract)

        expect(result).toEqual(expectedFAQItems)
    })

    it('should return FAQ items for periodic intervals and tempo contract', () => {
        const period = PeriodEnum.MONTHLY
        const hasTempoContract = true
        const expectedFAQItems = [faqForPeriodicIntervalsTempo, faqTitleForPeriodicIntervalsTempo]

        const result = getFAQItemsByPeriodAndContractType(period, hasTempoContract)

        expect(result).toEqual(expectedFAQItems)
    })
})
