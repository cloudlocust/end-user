import { reduxedRender } from 'src/common/react-platform-components/test'
import Map from 'src/common/ui-kit/components/MapElementList/components/Map/Map'
import { TEST_ELEMENT_LIST, testElementType } from 'src/common/ui-kit/components/MapElementList/MapElementList.test'

let mockIsCustomerInProgress = false
let mockCustomersList = TEST_ELEMENT_LIST
let mockIsLoaded = false
let mockLoadError = false
const mockEnqueueSnackbar = jest.fn()

// TEXT
const MAP_ERROR_LOAD_MESSAGE = "La Carte n'arrive pas à se charger"
// TEST_ID
const GOOGLE_MAP_TEST_ID = 'GoogleMap'
// eslint-disable-next-line jsdoc/require-jsdoc
const propsMap = {
    data: mockCustomersList,
    loadingData: mockIsCustomerInProgress,
    // eslint-disable-next-line jsdoc/require-jsdoc
    ElementCard: ({ element }: { element: testElementType }) => (
        <div>
            {element.firstname} {element.lastname}
        </div>
    ),
}

/**
 * Mocking the useSnackbar used in CustomerDetails to load the customerDetails based on url /customers/:id {id} params.
 */
jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    /**
     * Mock the notistack useSnackbar hooks.
     *
     * @returns The notistack useSnackbar hook.
     */
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))

/**
 * Mocking the useComments.
 */
jest.mock('@react-google-maps/api', () => ({
    ...jest.requireActual('@react-google-maps/api'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useLoadScript: () => ({ isLoaded: mockIsLoaded, loadError: mockLoadError }),
    // Mock Google Map Component
    // eslint-disable-next-line jsdoc/require-jsdoc
    GoogleMap: () => <div data-testid={GOOGLE_MAP_TEST_ID}></div>,
}))

describe('Map Test', () => {
    test('When LoadGoogleMapError, snackbar show error map loading message should show, and map not shown', async () => {
        mockLoadError = true
        const { getByTestId } = reduxedRender(<Map {...propsMap} />)
        // Snackbar should have been called
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(MAP_ERROR_LOAD_MESSAGE, { variant: 'error' })
        expect(() => getByTestId(GOOGLE_MAP_TEST_ID)).toThrow()
    })
    test('When not LoadGoogleMapError and LoadGoogleMap success, google map should be loaded with ElementCard', async () => {
        mockLoadError = false
        mockIsLoaded = true
        const { getByTestId } = reduxedRender(<Map {...propsMap} />)
        expect(getByTestId(GOOGLE_MAP_TEST_ID)).toBeTruthy()
    })
})
