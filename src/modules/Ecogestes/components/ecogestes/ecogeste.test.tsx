import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EXAMPLE_ICON, TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'
import { IEcogestCategory, IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import Ecogestes from 'src/modules/Ecogestes/components/ecogestes/Ecogestes'
import EcogestesPage from 'src/modules/Ecogestes/components/ecogestes/EcogestesPage'
import EcogestesPageContent from 'src/modules/Ecogestes/components/ecogestes/EcogestesPageContent'
import EcogestesPageHeader from 'src/modules/Ecogestes/components/ecogestes/EcogestesPageHeader'
import { SnakeCasedPropertiesDeep } from 'type-fest'

const TEST_ECOGESTES_ECO_CARD_LABEL = 'ecogeste-card'
let mockCategoryId: string = '0'
let mockEcogestes: SnakeCasedPropertiesDeep<IEcogeste>[] = []
let mockEcogesteCategory: IEcogestCategory = {
    id: 42,
    name: 'ECO_NAME',
    icon: 'ECO_ICON',
    nbEcogeste: 7,
}
let mockEcogestesCategories: IEcogestCategory[] = [mockEcogesteCategory]

let mockCurrentCategory: IEcogestCategory = {
    id: 1,
    name: 'CATEGORY_NAME',
    icon: EXAMPLE_ICON,
    nbEcogeste: 7,
}

const mockFilterFn = jest.fn()
const mockHistoryBackFn = jest.fn()

/**
 * Mocking the react-router-dom used in the list.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the useParams.
     *
     * @returns UseParams.
     */
    useParams: () => ({
        categoryId: mockCategoryId,
    }),

    /**
     * Mock browser History.
     *
     * @returns UseHistory.
     */
    useHistory: () => ({
        goBack: mockHistoryBackFn,
        listen: jest.fn(),
    }),
}))

jest.mock('src/modules/utils/useResizeObserver')

jest.mock('src/modules/Ecogestes/hooks/ecogestesHook', () => {
    const og = jest.requireActual('src/modules/Ecogestes/hooks/ecogestesHook')
    /**
     * Mock the useEcogest hook with some
     * predictible values that we can manipulate
     * to check rendering of things.
     *
     * @returns EcogestesHook-like props.
     */
    const mockUseEcogestFn = () => ({
        elementList: mockEcogestes,
        loadingInProgress: false,
        filterEcogestes: mockFilterFn,
    })

    return {
        __esModule: true,
        ...og,
        default: mockUseEcogestFn,
        useEcogestes: mockUseEcogestFn,
    }
})

jest.mock('src/modules/Ecogestes/hooks/useEcogestesCategories', () => {
    const og = jest.requireActual('src/modules/Ecogestes/hooks/useEcogestesCategories')
    /**
     * Mock the useEcogestesCategories hook.
     *
     * @returns EcogestesCategoriesHook-like props.
     */
    const mockUseEcogestesCategoriesFn = () => ({
        elementList: mockEcogestesCategories,
        loadingInProgress: false,
    })

    return {
        __esModule: true,
        ...og,
        default: mockUseEcogestesCategoriesFn,
        useEcogestesCategories: mockUseEcogestesCategoriesFn,
    }
})

describe('Ecogestes tests', () => {
    describe('should render correctly component', () => {
        test('When loaded, should render correctly Ecogeste Header', async () => {
            const { queryByText } = reduxedRender(
                <BrowserRouter>
                    <EcogestesPageHeader isLoading={false} currentCategory={mockEcogesteCategory} />
                </BrowserRouter>,
            )

            expect(queryByText(mockEcogesteCategory.name)).toBeTruthy()
        })
        test('When loaded, should render correctly Ecogeste Header with Loading State', async () => {
            const { queryByRole } = reduxedRender(
                <BrowserRouter>
                    <EcogestesPageHeader isLoading={true} currentCategory={mockEcogesteCategory} />
                </BrowserRouter>,
            )

            expect(queryByRole('progressbar')).toBeTruthy()
        })
    })

    describe('Test proper rendering for categories', () => {
        test('When rendering, should render correctly ecogestes', async () => {
            mockCategoryId = '2'
            mockEcogestes = TEST_ECOGESTES
            const { getByText, getByLabelText, queryAllByLabelText } = reduxedRender(
                <BrowserRouter>
                    <Ecogestes ecogestCategoryName="category name" ecogestCategoryIconUrl="category icon" />
                </BrowserRouter>,
            )

            expect(getByText('category name')).toBeInTheDocument()
            expect(getByLabelText('ecogestCategoryIcon')).toBeInTheDocument()
            expect(queryAllByLabelText(TEST_ECOGESTES_ECO_CARD_LABEL)).toHaveLength(TEST_ECOGESTES.length)
        })

        test('When loading fails, do not render list and give message', async () => {
            mockCategoryId = '-1'
            mockEcogestes = []
            const { queryAllByLabelText, queryByText } = reduxedRender(
                <BrowserRouter>
                    <Ecogestes />
                </BrowserRouter>,
            )

            expect(queryAllByLabelText(TEST_ECOGESTES_ECO_CARD_LABEL)).toHaveLength(0)
            expect(queryByText("Aucun écogeste n'est disponible")).toBeTruthy()
        })
    })

    describe('Test proper rendering for EcogestesPage', () => {
        test('When rendering, should render correctly EcogestesPage', async () => {
            mockCategoryId = mockEcogesteCategory.id.toString()
            const { getByText, getAllByText, getByLabelText } = reduxedRender(
                <BrowserRouter>
                    <EcogestesPage />
                </BrowserRouter>,
            )

            await waitFor(() => {
                expect(getByText('Ecogestes')).toBeInTheDocument()
                expect(getAllByText(mockEcogesteCategory.name)).toHaveLength(2)
                expect(getByText('arrow_back')).toBeInTheDocument()
                expect(getByText('Retour')).toBeInTheDocument()
                expect(getByText('Nos conseils')).toBeInTheDocument()
                expect(getByText('Réalisés')).toBeInTheDocument()
                expect(getByLabelText('ecogestCategoryIcon')).toBeInTheDocument()
            })
        })

        test('When rendering, should render correctly PageHeader', async () => {
            mockCategoryId = '2'
            mockEcogestes = TEST_ECOGESTES
            const { getByText, getByAltText, getByRole } = reduxedRender(
                <BrowserRouter>
                    <EcogestesPageHeader isLoading={false} currentCategory={mockCurrentCategory} />
                </BrowserRouter>,
            )

            expect(getByText(mockCurrentCategory.name)).toBeTruthy()
            expect(getByAltText(mockCurrentCategory.name)).toHaveAttribute('src', mockCurrentCategory.icon)
            userEvent.click(getByRole('button'))
            expect(mockHistoryBackFn).toHaveBeenCalled()
        })

        describe('should render correctly PageContent', () => {
            test('When category not existing', async () => {
                const { getByRole } = reduxedRender(
                    <BrowserRouter>
                        <EcogestesPageContent currentCategory={null} />
                    </BrowserRouter>,
                )

                expect(getByRole('progressbar')).toBeTruthy()
            })

            test('When category have been found', async () => {
                mockCategoryId = '2'
                mockEcogestes = TEST_ECOGESTES

                const { queryAllByLabelText } = reduxedRender(
                    <BrowserRouter>
                        <EcogestesPageContent currentCategory={mockCurrentCategory} />
                    </BrowserRouter>,
                )

                expect(queryAllByLabelText(TEST_ECOGESTES_ECO_CARD_LABEL)).toHaveLength(TEST_ECOGESTES.length)
            })
        })
    })
})
