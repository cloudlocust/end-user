import { render } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import SolarSizingForm from 'src/modules/SolarSizing/solarSizingForm'
import { store } from 'src/redux'

const mockEnqueueSnackbar = jest.fn()

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

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        goBack: jest.fn(),
        listen: jest.fn(), // Mocked for FuseScrollbar throwing error
    }),
}))

jest.mock('react-intl', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useIntl: () => ({
        formatMessage: jest.fn(),
    }),
}))

let mockAsyncMutateAdd = jest.fn(() =>
    Promise.resolve({
        // data: {
        status: 201,
        // },
    }),
)
let mockAsyncMutateUpdate = jest.fn(() =>
    Promise.resolve({
        status: 200,
    }),
)

jest.mock('src/modules/SolarSizing/solarSizingHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useSolarSizing: () => ({
        addSolarSizing: {
            mutateAsync: mockAsyncMutateAdd,
        },
        updateHousingSolarSizingBySolarSizingId: {
            mutateAsync: mockAsyncMutateUpdate,
        },
        allHousingSolarSizing: {
            refetch: jest.fn(),
        },
    }),
}))

describe('SolarSizingForm', () => {
    let wrapper: ({ children }: any) => JSX.Element

    beforeEach(() => {
        const queryClient = new QueryClient()
        // eslint-disable-next-line jsdoc/require-jsdoc
        wrapper = ({ children }: any) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    })

    it('renders the form and its elements', () => {
        const { getAllByText, getAllByPlaceholderText } = render(
            <Provider store={store}>
                <SolarSizingForm />
            </Provider>,
            { wrapper },
        )

        // Check if the form elements are rendered
        expect(getAllByText('Dimensions de ma toiture')[0]).toBeInTheDocument()
        expect(getAllByPlaceholderText('m2')[0]).toBeInTheDocument()
        expect(getAllByText('Orientation :')[0]).toBeInTheDocument()
        expect(getAllByText('Inclinaison :')[0]).toBeInTheDocument()
        expect(getAllByText('Simuler mon installation solaire')[0]).toBeInTheDocument()
    }, 10000)
    // it('handles form submission', async () => {
    //     const { getByText, getByPlaceholderText } = render(
    //         <Provider store={store}>
    //             <SolarSizingForm />
    //         </Provider>,
    //         { wrapper },
    //     )

    //     const surface = getByPlaceholderText('m2')
    //     userEvent.type(surface, '100')

    //     expect(surface).toHaveValue(100)
    //     userEvent.click(getByText('Nord'))
    //     userEvent.click(getByText('15%'))
    //     userEvent.click(getByText('Simuler mon installation solaire'))

    //     // Wait for the form to be submitted and the result to be displayed
    //     await waitFor(
    //         () => {
    //             expect(mockAsyncMutateAdd).toHaveBeenCalled()
    //         },
    //         { timeout: 6000 },
    //     )
    // })
})
