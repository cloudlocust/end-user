import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EcogestesWrapper } from './EcogestesWrapper'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import { IEcogestCategory } from 'src/modules/Ecogestes/components/ecogeste'
import { TEST_ECOGESTES_POLES_CATEGORY } from 'src/mocks/handlers/ecogestes'
import userEvent from '@testing-library/user-event'

let TEST_POLES_BTN_TEXT = 'Postes de conso'
let TEST_ROOMS_BTN_TEXT = 'Pièces'

let TEST_ARIA_LABEL_ATTR = 'aria-label'
let LABEL_CLICKABLE_CELL = 'clickable-cell'
let LABEL_ACTIVE_CELL = 'active-cell'

let mockEcogestesCategories: IEcogestCategory[] = []
let mockIsLoadingInProgress = false

jest.mock('src/modules/Ecogestes/hooks/useEcogestesCategories', () => {
    const og = jest.requireActual('src/modules/Ecogestes/hooks/useEcogestesCategories')

    // eslint-disable-next-line jsdoc/require-jsdoc
    const mockUseEcogestCategoriesFn = (_categoryType: IEcogesteCategoryTypes) => ({
        elementList: mockEcogestesCategories,
        loadingInProgress: mockIsLoadingInProgress,
    })

    return {
        __esModule: true,
        ...og,
        default: mockUseEcogestCategoriesFn,
        useEcogestesCategories: mockUseEcogestCategoriesFn,
    }
})

describe('EcogestesWrapper tests', () => {
    test('When loading, should render Spinner', async () => {
        mockIsLoadingInProgress = true
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <EcogestesWrapper />
            </BrowserRouter>,
        )
        expect(getByText(TEST_POLES_BTN_TEXT)).toBeTruthy()
        expect(getByText(TEST_ROOMS_BTN_TEXT)).toBeTruthy()
        expect(getByRole('progressbar')).toBeTruthy()
    })

    test('When loaded, should render Consumption Poles by default', async () => {
        mockIsLoadingInProgress = false
        mockEcogestesCategories = TEST_ECOGESTES_POLES_CATEGORY
        const { getByText, queryAllByLabelText, queryByLabelText, getByLabelText } = reduxedRender(
            <BrowserRouter>
                <EcogestesWrapper />
            </BrowserRouter>,
        )

        expect(getByText(TEST_POLES_BTN_TEXT).closest('button')).toHaveAttribute(
            TEST_ARIA_LABEL_ATTR,
            LABEL_ACTIVE_CELL,
        )
        expect(getByText(TEST_ROOMS_BTN_TEXT).closest('button')).toHaveAttribute(
            TEST_ARIA_LABEL_ATTR,
            LABEL_CLICKABLE_CELL,
        )
        expect(getByLabelText('consumptionsEcogests')).toBeTruthy()
        expect(queryByLabelText('list, categories, cards')).toBeTruthy()
        expect(queryAllByLabelText('ecogestCategoryCard')).toHaveLength(2)
    })

    test('When interacting with Menu, should render Rooms', async () => {
        mockIsLoadingInProgress = false
        mockEcogestesCategories = TEST_ECOGESTES_POLES_CATEGORY
        const { getByText, queryAllByLabelText, queryByLabelText } = reduxedRender(
            <BrowserRouter>
                <EcogestesWrapper />
            </BrowserRouter>,
        )

        expect(getByText(TEST_POLES_BTN_TEXT).closest('button')).toHaveAttribute(
            TEST_ARIA_LABEL_ATTR,
            LABEL_ACTIVE_CELL,
        )
        userEvent.click(getByText(TEST_ROOMS_BTN_TEXT))
        expect(getByText(TEST_POLES_BTN_TEXT).closest('button')).toHaveAttribute(
            TEST_ARIA_LABEL_ATTR,
            LABEL_CLICKABLE_CELL,
        )
        expect(getByText(TEST_ROOMS_BTN_TEXT).closest('button')).toHaveAttribute(
            TEST_ARIA_LABEL_ATTR,
            LABEL_ACTIVE_CELL,
        )

        expect(queryByLabelText('roomsEcogests')).toBeTruthy()
        expect(queryByLabelText('list, categories, cards')).toBeTruthy()
        expect(queryAllByLabelText('ecogestCategoryCard')).toHaveLength(2)
    })
})
