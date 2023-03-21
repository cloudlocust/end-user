import { waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'
import EcogestListPage from 'src/modules/Ecogestes/components/ecogestesList/ecogestListPage'
import { TEST_ECOGESTES_TAGS } from 'src/mocks/handlers/ecogestes'

let mockTagId: string = '0'
let mockEcogestes = TEST_ECOGESTES

const ecogestListAria = 'list, ecogests, cards'
const ecogestTagsListAria = 'list, tags, cards'
const ecogestTagCardAria = 'ecogest-tag, card'
const ecogestCardAria = 'ecogeste-card'

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
        tagId: mockTagId,
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
        filterEcogestes: jest.fn(),
    })

    return {
        __esModule: true,
        ...og,
        default: mockUseEcogestFn,
        useEcogestes: mockUseEcogestFn,
    }
})

/*
    Test ecogestListPage.
    What do we want to test ?
    - That the page renders
    - That /tags/1 shows ecogests
     - With icon
     - With name
     - With correct number
    - That /tags shows tag cards
*/

describe('EcogestesListPage tests', () => {
    test('When getting /tags, shows all tags', async () => {
        mockTagId = ''
        const { queryByLabelText, queryAllByLabelText } = reduxedRender(
            <BrowserRouter>
                <EcogestListPage />
            </BrowserRouter>,
        )

        await waitFor(
            () => {
                expect(queryByLabelText(ecogestListAria)).toBeNull()
                expect(queryByLabelText(ecogestTagsListAria)).toBeInTheDocument()
                expect(queryAllByLabelText(ecogestTagCardAria).length).toBe(TEST_ECOGESTES_TAGS.length)
            },
            { timeout: 2000 },
        )
    })
    test('When getting /tags/1, shows one tag and ecogests', async () => {
        mockTagId = '1'
        const { queryByLabelText, queryAllByLabelText, debug } = reduxedRender(
            <BrowserRouter>
                <EcogestListPage />
            </BrowserRouter>,
        )

        await waitFor(
            () => {
                debug()
                expect(queryByLabelText(ecogestListAria)).toBeInTheDocument()
                expect(queryByLabelText(ecogestTagsListAria)).toBeNull()
                expect(queryAllByLabelText(ecogestCardAria).length).toBe(TEST_ECOGESTES.length)
            },
            { timeout: 3000 },
        )
    })
    test('When getting a tag that does not exists, show all tags', async () => {
        mockTagId = '99'
        const { queryByLabelText, queryAllByLabelText } = reduxedRender(
            <BrowserRouter>
                <EcogestListPage />
            </BrowserRouter>,
        )

        await waitFor(
            () => {
                expect(queryByLabelText(ecogestTagsListAria)).toBeInTheDocument()
                expect(queryAllByLabelText(ecogestTagCardAria).length).toBe(TEST_ECOGESTES_TAGS.length)
            },
            { timeout: 2000 },
        )
    })
})
