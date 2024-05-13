import { renderHook, act } from '@testing-library/react-hooks'
import { QueryClient, QueryClientProvider } from 'react-query'
import { TEST_SOLAR_SIZING } from 'src/mocks/handlers/solarSizing'
import { useSolarSizing } from 'src/modules/SolarSizing/solarSizingHook'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

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

describe('test solar sizing hooks', () => {
    test('solar sizing returning', async () => {
        const { result } = renderHook(() => useSolarSizing(1), {
            /**
             * Wrapper for the QueryClientProvider.
             *
             * @param root0 QueryClientProvider.
             * @param root0.children ReactNode.
             * @returns ReactNode.
             */
            wrapper: ({ children }) => {
                return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            },
        })

        await act(async () => {
            await result.current.allHousingSolarSizing.refetch()
        })

        // await waitForNextUpdate()

        expect(result.current.allHousingSolarSizing.data).toEqual({
            solarSizing: TEST_SOLAR_SIZING,
            annualProduction: 1000,
            autoConsumptionPercentage: 50,
            autoProductionPercentage: 50,
            consumptionStartAt: '2022-01-01T00:00:00.000Z',
            consumptionEndAt: '2022-12-31T23:59:59.999Z',
            nominalPower: 3.6,
        })
    })
    test('solar sizing adding', async () => {
        const { result } = renderHook(() => useSolarSizing(1), {
            /**
             * Wrapper for the QueryClientProvider.
             *
             * @param root0 QueryClientProvider.
             * @param root0.children ReactNode.
             * @returns ReactNode.
             */
            wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
        })

        const newSolarSizing = {
            surface: 500,
            orientation: 0,
            inclination: 45,
            panelArea: 50,
            panelEfficiency: 60,
            panelPower: 500,
            panelPrice: 5000,
            panelWdth: 50,
        }

        await act(async () => {
            await result.current.addSolarSizing.mutateAsync(newSolarSizing)
        })

        expect(result.current.addSolarSizing.data?.data).toContainEqual({
            id: 5,
            ...newSolarSizing,
        })
    })
})
