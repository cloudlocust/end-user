import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import MapElementList from 'src/common/ui-kit/components/MapElementList'
import { fireEvent, act, waitFor } from '@testing-library/react'

// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_ELEMENT_LIST = [
    {
        id: 1,
        email: 'Sincere@april.biz',
        phone: '1770736803',
        firstname: 'Leanne',
        lastname: 'Graham',
        address: {
            street: 'Apt. 556, Gwenborough. 92998-3874',
            city: 'Gwenborough',
            postalCode: '92998-3874',
            additionalData: 'testFDF',
            country: 'France',
            latitude: 45.706877,
            longitude: 5.011265,
        },
        createdAt: '2021-12-15T14:07:38.138000',
    },
]
/**
 * This represent the type of the element in data given to the MapElementList.
 */
export type testElementType = typeof TEST_ELEMENT_LIST[0]
let mockNoMoreDataToLoad = false
// TEXT
const LOAD_MORE_BUTTON_TEXT = 'Afficher plus'
const EMPTY_DATA_TEXT = 'La liste est vide'
const ICON_SCROLL_TOP = 'arrow_upward'

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useLocation: () => ({
        pathname: '/customers',
    }),
}))

// eslint-disable-next-line jsdoc/require-jsdoc
const propsMapElementList = {
    data: TEST_ELEMENT_LIST,
    loadingData: false,
    loadMoreData: jest.fn(),
    noMoreDataToLoad: mockNoMoreDataToLoad,
    // eslint-disable-next-line jsdoc/require-jsdoc
    elementCard: ({ element }: { element: testElementType }) => (
        <div>
            {element.firstname} {element.lastname}
        </div>
    ),
    onConfirmFilter: jest.fn(),
}

describe('MapElementList Component Test', () => {
    describe('Load Data', () => {
        test('On Success loading Data', async () => {
            propsMapElementList.data = TEST_ELEMENT_LIST
            const { getByText } = reduxedRender(
                <Router>
                    {/* Wrap with id="root" because i need to access root Element to handle scroll event and style fixed MAP component. */}
                    <div id="root">
                        <MapElementList<testElementType, any> {...propsMapElementList} />
                    </div>
                </Router>,
            )
            expect(getByText(`${TEST_ELEMENT_LIST[0].firstname} ${TEST_ELEMENT_LIST[0].lastname}`)).toBeTruthy()
        })
        test('noMoreDataToLoad, when false Load More button should show', async () => {
            propsMapElementList.noMoreDataToLoad = true
            const { getByText } = reduxedRender(
                <Router>
                    {/* Wrap with id="root" because i need to access root Element to handle scroll event and style fixed MAP component. */}
                    <div id="root">
                        <MapElementList<testElementType, any> {...propsMapElementList} />
                    </div>
                </Router>,
            )
            expect(() => getByText(LOAD_MORE_BUTTON_TEXT)).toThrow()
        })
        test('noMoreDataToLoad, when true Load More button should not show', async () => {
            propsMapElementList.noMoreDataToLoad = false
            const { getByText } = reduxedRender(
                <Router>
                    {/* Wrap with id="root" because i need to access root Element to handle scroll event and style fixed MAP component. */}
                    <div id="root">
                        <MapElementList<testElementType, any> {...propsMapElementList} />
                    </div>
                </Router>,
            )
            expect(getByText(LOAD_MORE_BUTTON_TEXT)).toBeTruthy()
        })
        test('When Clicking Load More Data, load more data should be called', async () => {
            propsMapElementList.noMoreDataToLoad = false
            const mockLoadMoreData = jest.fn()
            propsMapElementList.loadMoreData = mockLoadMoreData

            const { getByText } = reduxedRender(
                <Router>
                    {/* Wrap with id="root" because i need to access root Element to handle scroll event and style fixed MAP component. */}
                    <div id="root">
                        <MapElementList<testElementType, any> {...propsMapElementList} />
                    </div>
                </Router>,
            )
            act(() => {
                fireEvent.click(getByText(LOAD_MORE_BUTTON_TEXT))
            })
            await waitFor(() => {
                expect(mockLoadMoreData).toHaveBeenCalled()
            })
        })

        test('When clicking on scrollTop, scrollTo should be called', async () => {
            propsMapElementList.noMoreDataToLoad = false

            const { getByText } = reduxedRender(
                <Router>
                    {/* Wrap with id="root" because i need to access root Element to handle scroll event and style fixed MAP component. */}
                    <div id="root">
                        <MapElementList<testElementType, any> {...propsMapElementList} />
                    </div>
                </Router>,
            )
            const mockScrollTo = jest.fn()
            document.getElementById('root')!.scrollTo = mockScrollTo
            act(() => {
                fireEvent.click(getByText(ICON_SCROLL_TOP).parentElement!)
            })
            expect(mockScrollTo).toHaveBeenCalled()
        })
    })
    describe('Show Map', () => {
        test('When loadingData, map shows a spinner', async () => {
            propsMapElementList.data = []
            propsMapElementList.loadingData = true
            const { getByTestId, getByText } = reduxedRender(
                <Router>
                    {/* Wrap with id="root" because i need to access root Element to handle scroll event and style fixed MAP component. */}
                    <div id="root">
                        <MapElementList<testElementType, any> {...propsMapElementList} />
                    </div>
                </Router>,
            )

            // This is the selector of the Map checkbox
            const ShowMapCheckbox =
                getByText('Afficher Carte').parentElement?.parentElement?.querySelector('input[type="checkbox"]')!
            act(() => {
                fireEvent.click(ShowMapCheckbox)
            })
            await waitFor(() => {
                expect(getByTestId('mapDivLoading')).toBeTruthy()
            })
        })

        test('When data empty and not loading, Empty message should be shown', async () => {
            propsMapElementList.loadingData = false
            propsMapElementList.data = []
            const { getByText } = reduxedRender(
                <Router>
                    {/* Wrap with id="root" because i need to access root Element to handle scroll event and style fixed MAP component. */}
                    <div id="root">
                        <MapElementList<testElementType, any> {...propsMapElementList} />
                    </div>
                </Router>,
            )

            expect(getByText(EMPTY_DATA_TEXT)).toBeTruthy()
        })
        test('When elementList, map should be shown', async () => {
            // This means we fetched all Data
            propsMapElementList.data = TEST_ELEMENT_LIST
            const { getByTestId, getByText } = reduxedRender(
                <Router>
                    {/* Wrap with id="root" because i need to access root Element to handle scroll event and style fixed MAP component. */}
                    <div id="root">
                        <MapElementList<testElementType, any> {...propsMapElementList} />
                    </div>
                </Router>,
            )

            // This is the selector of the Map checkbox
            const ShowMapCheckbox =
                getByText('Afficher Carte').parentElement?.parentElement?.querySelector('input[type="checkbox"]')!
            act(() => {
                fireEvent.click(ShowMapCheckbox)
            })
            await waitFor(() => {
                expect(getByTestId('mapDiv')).toBeTruthy()
            })
        })
    })
})
