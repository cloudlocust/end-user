import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'
import EcogestesList from 'src/modules/Ecogestes/components/ecogestesList/EcogestesList'

let mockCategoryId: string = '0'
let mockEcogestes: any[] = []

const mockFilterFn = jest.fn()

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
})
