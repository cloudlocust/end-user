import { reduxedRender } from 'src/common/react-platform-components/test'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { ChartFAQ } from 'src/modules/MyConsumption/components/ChartFAQ'
import {
    faqForDailyPeriodTempo,
    faqForPeriodicIntervals,
    faqTitleForDailyPeriodTempo,
    faqTitleForPeriodicIntervals,
} from 'src/modules/MyConsumption/components/ChartFAQ/ChartFAQVariables'
import { TEST_DATETIME } from 'src/mocks/handlers/contracts'
import { TEST_OFFERS } from 'src/mocks/handlers/commercialOffer'
import { TEST_PROVIDERS } from 'src/mocks/handlers/commercialOffer'
import { TEST_CONTRACT_TYPES } from 'src/mocks/handlers/commercialOffer'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { Matcher } from '@testing-library/react'

let mockContracts = [
    {
        id: 1,
        commercialOffer: { ...TEST_OFFERS[0], provider: TEST_PROVIDERS[0] },
        tariffType: { name: 'Base', id: 1 },
        contractType: TEST_CONTRACT_TYPES[0],
        power: 6,
        startSubscription: TEST_DATETIME,
    },
]

/**
 * Mocking the useContractList.
 */
jest.mock('src/modules/Contracts/contractsHook', () => ({
    ...jest.requireActual('src/modules/Contracts/contractsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useContractList: () => ({
        elementList: mockContracts,
    }),
}))

let mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.Consumption
jest.mock('src/modules/MyConsumption/store/myConsumptionStore', () => ({
    /**
     * Mock useMyConsumptionStore hook for we can change between tabs.
     *
     * @returns Current tab.
     */
    useMyConsumptionStore: () => ({ consumptionToggleButton: mockMyConsumptionTab }),
}))

describe('ChartFAQ', () => {
    test.each([PeriodEnum.WEEKLY, PeriodEnum.MONTHLY, PeriodEnum.YEARLY])(
        'should not shown on $period period.',
        (period) => {
            const { queryByTestId } = reduxedRender(<ChartFAQ period={period as PeriodEnum} housingId={2} />)
            expect(queryByTestId('faq')).not.toBeInTheDocument()
        },
    )
    test('should FAQ component not be not shown on production view', () => {
        mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
        const { queryByTestId } = reduxedRender(<ChartFAQ period={PeriodEnum.DAILY} housingId={2} />)
        expect(queryByTestId('faq')).not.toBeInTheDocument()
    })
    test('should FAQ component not be shown on tempo contract', () => {
        mockContracts[0].tariffType.name = 'Jour Tempo'
        mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.Consumption
        const { queryByTestId } = reduxedRender(<ChartFAQ period={PeriodEnum.DAILY} housingId={2} />)
        expect(queryByTestId('faq')).toBeInTheDocument()
    })
    // todo: To activate the following tests later when faq content available.
    test('when user has tempo contract, renders the correct FAQ items for daily period', () => {
        const { getByText } = reduxedRender(<ChartFAQ period={PeriodEnum.DAILY} housingId={2} />)

        expect(getByText(faqTitleForDailyPeriodTempo)).toBeInTheDocument()
        for (const faqItem of faqForDailyPeriodTempo) {
            expect(getByText(faqItem.title as Matcher)).toBeInTheDocument()
            expect(getByText(faqItem.content as Matcher)).toBeInTheDocument()
        }
    })

    test("should not render FAQ unless it's daily", () => {
        for (const period of [PeriodEnum.MONTHLY, PeriodEnum.WEEKLY]) {
            const { getByText } = reduxedRender(<ChartFAQ period={period} housingId={2} />)
            expect(() => getByText(faqTitleForPeriodicIntervals)).toThrow()

            for (const faqItem of faqForPeriodicIntervals) {
                expect(() => getByText(faqItem.title as Matcher)).toThrow()
                expect(() => getByText(faqItem.content as Matcher)).toThrow()
            }
        }
    })
})
