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
    describe('Testing updateAccomodation Request', () => {
        test('Request (updateAccomodation) success and isLoadingInProgress should change following request state', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useAccomodation(1), {
                initialState: {},
            })
            act(async () => {
                try {
                    await result.current.updateAccomodation({
                        houseType: 'Appartement',
                    })
                } catch (error) {}
            })
            expect(result.current.isLoadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 10000 },
            )
            expect(result.current.isLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Vos modifications ont été sauvegardées', {
                variant: 'success',
            })
        })
        test('Request (updateAccomodation) error and isLoadingInProgress should change following request state', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useAccomodation(1), {
                initialState: {},
            })
            act(async () => {
                try {
                    await result.current.updateAccomodation(1, { houseType: 'Maison' })
                } catch (error) {}
            })
            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 10000 },
            )
            expect(result.current.isLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith("Une erreur s'est produite.", {
                variant: 'error',
            })
        })
    })
    describe('Testing loadAccomodation Request', () => {
        test('Request (loadAccomodation) success', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useAccomodation(1), { initialState: {} })
            act(() => {
                result.current.loadAccomodation(TEST_METERS[0].id)
            })
            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 10000 },
            )
            expect(result.current.isLoadingInProgress).toBe(false)
        })
        test('Request (loadAccomodation) failed', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken('failed')
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useAccomodation(1), { initialState: {} })

            act(() => {
                result.current.loadAccomodation(TEST_METERS[0].id)
            })

            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 10000 },
            )
            expect(result.current.isLoadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
                'Une erreur est survenue lors de la récupération des informations domicile.',
                {
                    variant: 'error',
                },
            )
        })
    })
})
