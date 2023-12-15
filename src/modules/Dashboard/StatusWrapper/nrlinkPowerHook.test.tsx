import { waitFor } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import { applyCamelCase } from 'src/common/react-platform-components'
import { nrlinkPowerData } from 'src/mocks/handlers/dashboard'
import { INrlinkMetrics } from 'src/modules/Dashboard/StatusWrapper/nrlinkPower'
import { useNrlinkMetrics } from 'src/modules/Dashboard/StatusWrapper/nrlinkPowerHook'

const mockEnqueueSnackbar = jest.fn()

const TEST_NRLINK_SUCCESS = applyCamelCase(nrlinkPowerData) as INrlinkMetrics

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

jest.mock('react-intl', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useIntl: () => ({
        formatMessage: jest.fn(),
    }),
}))

describe('useNrlinkPower', () => {
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

    test('should return data on success', async () => {
        const { result, waitFor } = renderHook(() => useNrlinkMetrics(1), { wrapper: createWrapper() })

        await waitFor(() => expect(result.current.isFetching).toBe(false), { timeout: 3000 })

        expect(result.current.data).toStrictEqual(TEST_NRLINK_SUCCESS)
    })

    test('should handle errors correctly', async () => {
        const { result } = renderHook(() => useNrlinkMetrics(-1), {
            wrapper: createWrapper(),
        })

        expect(result.current.isFetching).toBe(true)

        await waitFor(() => expect(result.current.isFetching).toBe(false), { timeout: 3000 })

        expect(result.current.error).toBeDefined()
        expect(result.current.isError).toBeDefined()
    })
})
