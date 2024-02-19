import { render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider, UseMutationResult } from 'react-query'
import { TEST_HOUSING_SOLAR_SIZING } from 'src/mocks/handlers/solarSizing'
import { SolarSizing } from 'src/modules/SolarSizing'
import { ISolarSizing } from 'src/modules/SolarSizing/solarSizeing.types'

let mockSolarSizingData = TEST_HOUSING_SOLAR_SIZING

jest.mock('src/hooks/CurrentHousing/index.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useCurrentHousing: () => ({
        id: 1,
        meter: null,
        address: 'address',
    }),
}))

let mockAsyncMutate = jest.fn()
let mockRefetch = jest.fn()

jest.mock('src/modules/SolarSizing/solarSizingHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useSolarSizing: () => ({
        addSolarSizing: {
            isSuccess: true,
            mutateAsync: mockAsyncMutate,
        } as unknown as UseMutationResult<ISolarSizing>,
        solarSizingData: {
            data: mockSolarSizingData,
        },
        refetch: mockRefetch,
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

describe('SolarSizing', () => {
    let wrapper: ({ children }: any) => JSX.Element

    beforeEach(() => {
        const queryClient = new QueryClient()
        // eslint-disable-next-line jsdoc/require-jsdoc
        wrapper = ({ children }: any) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    })

    test('when component is rendered', async () => {
        const { getByText } = render(<SolarSizing />, { wrapper })
        expect(getByText('arrow_back')).toBeInTheDocument()
        expect(getByText('Dimensions de ma toiture')).toBeInTheDocument()
        expect(getByText('Orientation :')).toBeInTheDocument()
        expect(getByText('Inclinaison :')).toBeInTheDocument()
        expect(getByText('Simuler mon installation solaire')).toBeInTheDocument()
    })
    test('when form is submitted', async () => {
        const { getByPlaceholderText, getByText } = render(<SolarSizing />, { wrapper })
        const surface = getByPlaceholderText('m2')
        userEvent.type(surface, '100')
        expect(surface).toHaveValue(100)
        userEvent.click(getByText('Nord'))
        userEvent.click(getByText('15%'))
        userEvent.click(getByText('Simuler mon installation solaire'))

        await waitFor(() => {
            expect(mockAsyncMutate).toBeCalled()
            expect(mockRefetch).toBeCalled()
        })

        expect(getByText('400')).toBeInTheDocument()
        expect(getByText('1000')).toBeInTheDocument()
    })
})
