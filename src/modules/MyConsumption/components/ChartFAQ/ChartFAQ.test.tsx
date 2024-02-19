import { render } from '@testing-library/react'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { ChartFAQ } from 'src/modules/MyConsumption/components/ChartFAQ'
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

describe('ChartFAQ', () => {
    test('renders FAQ component with correct props for daily period', () => {
        const { getByText } = render(<ChartFAQ period={PeriodEnum.DAILY} hasTempoContract={false} />)

        expect(getByText(faqTitleForDailyPeriod)).toBeInTheDocument()
        for (const faqItem of faqForDailyPeriod) {
            expect(getByText(faqItem.title)).toBeInTheDocument()
            expect(getByText(faqItem.content)).toBeInTheDocument()
        }
    })

    test('when user has tempo contract, renders the correct FAQ items for daily period', () => {
        const { getByText } = render(<ChartFAQ period={PeriodEnum.DAILY} hasTempoContract={true} />)

        expect(getByText(faqTitleForDailyPeriodTempo)).toBeInTheDocument()
        for (const faqItem of faqForDailyPeriodTempo) {
            expect(getByText(faqItem.title)).toBeInTheDocument()
            expect(getByText(faqItem.content)).toBeInTheDocument()
        }
    })

    test('renders FAQ component with correct props for periodic intervals', () => {
        for (const period of [PeriodEnum.MONTHLY, PeriodEnum.WEEKLY]) {
            const { getByText, unmount } = render(<ChartFAQ period={period} hasTempoContract={false} />)
            expect(getByText(faqTitleForPeriodicIntervals)).toBeInTheDocument()

            for (const faqItem of faqForPeriodicIntervals) {
                expect(getByText(faqItem.title)).toBeInTheDocument()
                expect(getByText(faqItem.content)).toBeInTheDocument()
            }
            unmount()
        }
    })

    test('when user has tempo contract, renders the correct FAQ items for periodic intervals', () => {
        for (const period of [PeriodEnum.MONTHLY, PeriodEnum.WEEKLY]) {
            const { getByText, unmount } = render(<ChartFAQ period={period} hasTempoContract={true} />)
            expect(getByText(faqTitleForPeriodicIntervalsTempo)).toBeInTheDocument()
            for (const faqItem of faqForPeriodicIntervalsTempo) {
                expect(getByText(faqItem.title)).toBeInTheDocument()
                expect(getByText(faqItem.content)).toBeInTheDocument()
            }
            unmount()
        }
    })
})
