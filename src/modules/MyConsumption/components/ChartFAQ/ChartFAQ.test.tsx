import { render, cleanup } from '@testing-library/react'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { ChartFAQ, faqForDailyPeriod, faqForTempo, faqTitleForDailyPeriod, faqTitleForTempo } from './index'

describe('ChartFAQ', () => {
    test('renders FAQ component with correct props for daily period', () => {
        const { getByText } = render(<ChartFAQ period={PeriodEnum.DAILY} />)

        expect(getByText(faqTitleForDailyPeriod)).toBeInTheDocument()
        for (const faqItem of faqForDailyPeriod) {
            expect(getByText(faqItem.title)).toBeInTheDocument()
            expect(getByText(faqItem.content)).toBeInTheDocument()
        }
        // Add more assertions for the rendered FAQ items specific to the daily period
    })

    test('renders FAQ component with correct props for tempo period', () => {
        // PeriodEnum.WEEKLY, PeriodEnum.YEARLY

        for (const period of [PeriodEnum.MONTHLY, PeriodEnum.WEEKLY]) {
            const { getByText } = render(<ChartFAQ period={period} />)
            expect(getByText(faqTitleForTempo)).toBeInTheDocument()

            for (const faqItem of faqForTempo) {
                expect(getByText(faqItem.title)).toBeInTheDocument()
                expect(getByText(faqItem.content)).toBeInTheDocument()
            }
            cleanup()
        }
    })
})
