import { waitFor } from '@testing-library/react'
import { act, renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ISolarSizing } from 'src/modules/SolarSizing/solarSizeing.types'
import { useSolarSizing } from 'src/modules/SolarSizing/solarSizingHook'

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

jest.mock('react-intl', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useIntl: () => ({
        formatMessage: jest.fn(),
    }),
}))

describe('SolarSizingHook', () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    })

    // eslint-disable-next-line jsdoc/require-jsdoc
    const createWrapper = () => {
        // ✅ creates a new QueryClient for each test
        return ({ children }: any) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    }

    test('when useSolarSizing is called, solarSizingData should be defined', async () => {
        const { result, waitFor } = renderHook(() => useSolarSizing(1), { wrapper: createWrapper() })

        // Mock refetch
        result.current.refetch = jest.fn()

        // Call refetch
        act(() => {
            result.current.refetch()
        })

        // Await for changes from the refetch
        await waitFor(() => result.current.solarSizingData?.status === 200, { timeout: 3000 })

        expect(result.current.addSolarSizing).toBeDefined()
        expect(result.current.solarSizingData?.data).toBeDefined()
    })

    test('when addSolarSizing is successful', async () => {
        const { result } = renderHook(() => useSolarSizing(1), { wrapper: createWrapper() })

        result.current.addSolarSizing.mutateAsync = jest.fn()

        act(() => {
            result.current.addSolarSizing.mutateAsync({} as ISolarSizing)
        })

        await waitFor(() => result.current.addSolarSizing.data?.status === 201, { timeout: 3000 })

        expect(result.current.addSolarSizing.mutateAsync).toBeCalled()

        expect(result.current.addSolarSizing.data).toBeUndefined()
    })
    test.todo('when addSolarSizing is unsuccessful, it should display an error message')
    test.todo('when fetching solar sizing is unsuccessful, it should display an error message')
})
