import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { EcogestesWrapper } from 'src/modules/Ecogestes/EcogestesWrapper'

const mockFilterFn = jest.fn()
let mockEcogestesCategories: IEcogestCategory[] = []
let mockIsLoadingInProgress: boolean = false

const TEST_ECOGESTES_CATEGORIES: IEcogestCategory[] = [
    {
        id: 0,
        name: 'first',
        icon: 'firstIcon',
        nbEcogeste: 42,
    },
    {
        id: 1,
        name: 'second',
        icon: 'secondIcon',
        nbEcogeste: 7,
    },
]

jest.mock('src/modules/Ecogestes/hooks/polesHooks', () => {
    const og = jest.requireActual('src/modules/Ecogestes/hooks/polesHooks')
    /**
     * Mock the useEcogest hook with some
     * predictible values that we can manipulate
     * to check rendering of things.
     *
     * @returns EcogestesHook-like props.
     */
    const mockUseEcogestFn = () => ({
        elementList: mockEcogestesCategories,
        loadingInProgress: mockIsLoadingInProgress,
        filterEcogestes: mockFilterFn,
    })

    return {
        __esModule: true,
        ...og,
        default: mockUseEcogestFn,
        useEcogestePoles: mockUseEcogestFn,
    }
})

describe('Test EcogestesWrapper', () => {
    describe('should render component properly', () => {
        test('When loading, should show render correctly', async () => {
            mockIsLoadingInProgress = true
            const { queryAllByLabelText, getByRole } = reduxedRender(
                <BrowserRouter>
                    <EcogestesWrapper />
                </BrowserRouter>,
            )
            expect(getByRole('progressbar')).toBeTruthy()
            expect(queryAllByLabelText('ecogest-category-card')).toHaveLength(0)
        })

        test('When loaded, should show categories', async () => {
            mockIsLoadingInProgress = false
            mockEcogestesCategories = TEST_ECOGESTES_CATEGORIES
            const { queryByRole, getAllByLabelText } = reduxedRender(
                <BrowserRouter>
                    <EcogestesWrapper />
                </BrowserRouter>,
            )
            expect(queryByRole('progressbar')).not.toBeInTheDocument()
            expect(getAllByLabelText('ecogestCategoryCard')).toHaveLength(2)
        })
    })
})
