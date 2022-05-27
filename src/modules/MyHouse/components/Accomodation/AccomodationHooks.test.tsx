import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from 'react-dom/test-utils'
import { TEST_METERS } from 'src/mocks/handlers/meters'
import { useAccomodation } from 'src/modules/MyHouse/components/Accomodation/AccomodationHooks'

const mockEnqueueSnackbar = jest.fn()

jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))

describe('Testing useAccomodation hooks', () => {
    test('updateAccomodation. Request success and isLoadingInProgress should change following request state', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useAccomodation(), {
            initialState: {},
        })
        expect(result.current.isLoadingInProgress).toBe(false)
        act(() => {
            result.current.updateAccomodation(1, {
                houseType: 'Maison',
                meterId: 1,
            })
        })
        expect(result.current.isLoadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Vos modifications ont été sauvegardées', {
            variant: 'success',
        })
    })
    test('updateAccomodation. Request error and isLoadingInProgress should change following request state', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useAccomodation(), {
            initialState: {},
        })
        expect(result.current.isLoadingInProgress).toBe(false)
        act(async () => {
            try {
                await result.current.updateAccomodation(1, { houseType: 'Maison' })
            } catch (error) {}
        })
        expect(result.current.isLoadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Une erreur s'est produite.", {
            variant: 'error',
        })
    })
    test('loadAccomodation. Request success', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useAccomodation(), { initialState: {} })
        expect(result.current.isLoadingInProgress).toBe(false)
        act(() => {
            result.current.loadAccomodation(TEST_METERS[0].id)
        })
        expect(result.current.isLoadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 10000 },
        )
    })
})
