import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EXAMPLE_ICON, TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'
import { IEcogestCategory, IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import EcogestesList from 'src/modules/Ecogestes/components/ecogestesList/EcogestesList'
import EcogestesListPageHeader from 'src/modules/Ecogestes/components/ecogestesList/EcogestesListPageHeader'
import { SnakeCasedPropertiesDeep } from 'type-fest'

let mockCategoryId: string = '0'
let mockEcogestes: SnakeCasedPropertiesDeep<IEcogeste>[] = []
let mockEcogesteCategory: IEcogestCategory = {
    id: 42,
    name: 'ECO_NAME',
    icon: 'ECO_ICON',
    nbEcogeste: 7,
}

let mockCurrentCategory: IEcogestCategory = {
    id: 1,
    name: 'CATEGORY_NAME',
    icon: EXAMPLE_ICON,
    nbEcogeste: 7,
}

const mockFilterFn = jest.fn()
const mockHistoryBackFn = jest.fn()

const MenuItemRoleSelector = '[role="menuitem"]'

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

describe('EcogestesList tests', () => {
    describe('should render correctly component', () => {
        test('When loaded, should render correctly Ecogeste Header', async () => {
            const { queryByText } = reduxedRender(
                <BrowserRouter>
                    <EcogestesListPageHeader isLoading={false} currentCategory={mockEcogesteCategory} />
                </BrowserRouter>,
            )

            expect(queryByText(mockEcogesteCategory.name)).toBeTruthy()
        })
        test('When loaded, should render correctly Ecogeste Header with Loading State', async () => {
            const { queryByRole } = reduxedRender(
                <BrowserRouter>
                    <EcogestesListPageHeader isLoading={true} currentCategory={mockEcogesteCategory} />
                </BrowserRouter>,
            )

            expect(queryByRole('progressbar')).toBeTruthy()
        })
    })
    describe('Test proper rendering for categories', () => {
        test('When rendering, should render correctly ecogestes', async () => {
            mockCategoryId = '2'
            mockEcogestes = TEST_ECOGESTES
            const { queryByLabelText, queryAllByLabelText } = reduxedRender(
                <BrowserRouter>
                    <EcogestesList />
                </BrowserRouter>,
            )

            expect(queryByLabelText('list, ecogests, cards')).toBeTruthy()
            expect(queryAllByLabelText('ecogeste-card')).toHaveLength(TEST_ECOGESTES.length)
        })

        test('When loading fails, do not render list and give message', async () => {
            mockCategoryId = '-1'
            mockEcogestes = []
            const { queryByLabelText, queryAllByLabelText, queryByText } = reduxedRender(
                <BrowserRouter>
                    <EcogestesList />
                </BrowserRouter>,
            )

            expect(queryByLabelText('list, ecogests, cards')).toBeTruthy()
            expect(queryAllByLabelText('ecogeste-card')).toHaveLength(0)
            expect(queryByText("Aucun écogeste n'est disponible pour le moment.")).toBeTruthy()
        })
    })

    describe('Test interactions with the filter button', () => {
        test('When clicking dropdown, it displays, and clicking out, it hides', async () => {
            mockCategoryId = '0'
            mockEcogestes = [TEST_ECOGESTES[0]]
            const { queryByLabelText, container } = reduxedRender(
                <BrowserRouter>
                    <EcogestesList />
                </BrowserRouter>,
            )

            const FilterButton = queryByLabelText('button, filter')
            expect(FilterButton).toBeTruthy()

            fireEvent(FilterButton!, new MouseEvent('click', { bubbles: true }))
            expect(document.querySelectorAll(MenuItemRoleSelector)).toHaveLength(3)
            fireEvent(FilterButton!, new MouseEvent('click'))
            expect(container.querySelectorAll(MenuItemRoleSelector)).toHaveLength(0)
        })

        test('When clicking dropdown, it displays, and clicking on read calls filterEcogests', async () => {
            mockCategoryId = '0'
            mockEcogestes = [TEST_ECOGESTES[0]]
            const { queryByLabelText, container } = reduxedRender(
                <BrowserRouter>
                    <EcogestesList />
                </BrowserRouter>,
            )

            const FilterButton = queryByLabelText('button, filter')
            expect(FilterButton).toBeTruthy()

            userEvent.click(FilterButton!, { bubbles: true })
            const menuItems = document.querySelectorAll(MenuItemRoleSelector)
            expect(menuItems).toHaveLength(3)

            userEvent.click(menuItems[0]!, { bubbles: true })
            expect(mockFilterFn).toHaveBeenCalled()

            userEvent.click(FilterButton!, { bubbles: true })
            expect(container.querySelectorAll(MenuItemRoleSelector)).toHaveLength(0)
        })
    })

    describe('Test proper rendering for EcogestesListPage', () => {
        test('When rendering, should render correctly PageHeader', async () => {
            mockCategoryId = '2'
            mockEcogestes = TEST_ECOGESTES
            const { getByText, getByAltText, getByRole } = reduxedRender(
                <BrowserRouter>
                    <EcogestesListPageHeader isLoading={false} currentCategory={mockCurrentCategory} />
                </BrowserRouter>,
            )

            expect(getByText(mockCurrentCategory.name)).toBeTruthy()
            expect(getByAltText(mockCurrentCategory.name)).toHaveAttribute('src', mockCurrentCategory.icon)
            userEvent.click(getByRole('button'))
            expect(mockHistoryBackFn).toHaveBeenCalled()
        })
    })
})
