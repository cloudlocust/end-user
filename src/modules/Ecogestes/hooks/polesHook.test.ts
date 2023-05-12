import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import useEcogestePoles from './polesHooks'

const mockEnqueueSnackbar = jest.fn()
let mockTagId: string = '1'

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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock the useParams.
     *
     * @returns UseParams.
     */
    useParams: () => ({
        categoryId: mockTagId,
    }),
}))

describe('PolesHook test', () => {
    test('useEcogestePoles should returns Poles of Consumption', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEcogestePoles(), { initialState: {} })

        expect(result.current.loadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 4000 },
        )

        expect(result.current.loadingInProgress).toBe(false)
        expect(result.current.elementList).toBeTruthy()
        expect(result.current.elementList.length).toBe(2)
    })
})
