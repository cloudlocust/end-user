import { reduxedRender } from 'src/common/react-platform-components/test'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { ChartFAQ } from 'src/modules/MyConsumption/components/ChartFAQ'
import {
    faqForDailyPeriod,
    // faqForDailyPeriodTempo,
    // faqForPeriodicIntervals,
    // faqForPeriodicIntervalsTempo,
    faqTitleForDailyPeriod,
    // faqTitleForDailyPeriodTempo,
    // faqTitleForPeriodicIntervals,
    // faqTitleForPeriodicIntervalsTempo,
} from 'src/modules/MyConsumption/components/ChartFAQ/ChartFAQVariables'
import { TEST_DATETIME } from 'src/mocks/handlers/contracts'
import { TEST_OFFERS } from 'src/mocks/handlers/commercialOffer'
import { TEST_PROVIDERS } from 'src/mocks/handlers/commercialOffer'
import { TEST_CONTRACT_TYPES } from 'src/mocks/handlers/commercialOffer'
import { SwitchConsumptionButtonTypeEnum } from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'

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
    test('renders FAQ component with correct props for daily period', () => {
        const { getByText } = reduxedRender(<ChartFAQ period={PeriodEnum.DAILY} housingId={1} />)
        expect(getByText(faqTitleForDailyPeriod.props.id)).toBeInTheDocument()
        for (const faqItem of faqForDailyPeriod) {
            expect(getByText((faqItem.title as JSX.Element).props.id)).toBeInTheDocument()
        }
    })
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
    test('should FAQ component not be not shown on tempo contract', () => {
        mockContracts[0].tariffType.name = 'Jour Tempo'
        mockMyConsumptionTab = SwitchConsumptionButtonTypeEnum.Consumption
        const { queryByTestId } = reduxedRender(<ChartFAQ period={PeriodEnum.DAILY} housingId={2} />)
        expect(queryByTestId('faq')).not.toBeInTheDocument()
    })
    // todo: To activate the following tests later when faq content available.
    // test('when user has tempo contract, renders the correct FAQ items for daily period', () => {
    //     const { getByText } = render(<ChartFAQ period={PeriodEnum.DAILY} hasTempoContract={true} />)

    //     expect(getByText(faqTitleForDailyPeriodTempo)).toBeInTheDocument()
    //     for (const faqItem of faqForDailyPeriodTempo) {
    //         expect(getByText(faqItem.title)).toBeInTheDocument()
    //         expect(getByText(faqItem.content)).toBeInTheDocument()
    //     }
    // })

    // test('renders FAQ component with correct props for periodic intervals', () => {
    //     for (const period of [PeriodEnum.MONTHLY, PeriodEnum.WEEKLY]) {
    //         const { getByText, unmount } = render(<ChartFAQ period={period} hasTempoContract={false} />)
    //         expect(getByText(faqTitleForPeriodicIntervals)).toBeInTheDocument()

    //         for (const faqItem of faqForPeriodicIntervals) {
    //             expect(getByText(faqItem.title)).toBeInTheDocument()
    //             expect(getByText(faqItem.content)).toBeInTheDocument()
    //         }
    //         unmount()
    //     }
    // })

    // test('when user has tempo contract, renders the correct FAQ items for periodic intervals', () => {
    //     for (const period of [PeriodEnum.MONTHLY, PeriodEnum.WEEKLY]) {
    //         const { getByText, unmount } = render(<ChartFAQ period={period} hasTempoContract={true} />)
    //         expect(getByText(faqTitleForPeriodicIntervalsTempo)).toBeInTheDocument()
    //         for (const faqItem of faqForPeriodicIntervalsTempo) {
    //             expect(getByText(faqItem.title)).toBeInTheDocument()
    //             expect(getByText(faqItem.content)).toBeInTheDocument()
    //         }
    //         unmount()
    //     }
    // })
})
