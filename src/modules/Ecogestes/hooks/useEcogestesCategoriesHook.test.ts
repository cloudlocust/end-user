import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { IEcogesteCategoryTypes } from 'src/modules/Ecogestes/EcogestesConfig'
import useEcogestesCategories from 'src/modules/Ecogestes/hooks/useEcogestesCategories'

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

describe('useEcogestesCategories test', () => {
    test('using CONSUMPTIONS as CategoryType', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEcogestesCategories(IEcogesteCategoryTypes.CONSUMPTION), {
            initialState: {},
        })

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

    test('using ROOMS as CategoryType', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEcogestesCategories(IEcogesteCategoryTypes.ROOMS), {
            initialState: {},
        })

        expect(result.current.loadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 4000 },
        )
        expect(result.current.loadingInProgress).toBe(false)
        expect(result.current.elementList).toBeTruthy()
        expect(result.current.elementList.length).toBe(3)
    })
})
