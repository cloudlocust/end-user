import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'
import EcogestesList from 'src/modules/Ecogestes/components/ecogestesList/EcogestesList'
import EcogestesListPageHeader from './EcogestesListPageHeader'
import { IEcogestCategory } from '../ecogeste'
import { EXAMPLE_ICON } from 'src/mocks/handlers/ecogestes'

let mockCategoryId: string = '0'
let mockCurrentCategory: IEcogestCategory = {
    id: 1,
    name: 'CATEGORY_NAME',
    icon: EXAMPLE_ICON,
    nbEcogeste: 7,
}
let mockEcogestes: any[] = []

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

jest.mock('src/modules/Ecogestes/ecogestesHook', () => {
    const og = jest.requireActual('src/modules/Ecogestes/ecogestesHook')
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
