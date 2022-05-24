import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from 'react-dom/test-utils'
import { useAccomodation } from './AccomodationHooks'
import { TEST_PROFILE_RESPONSE as MOCK_TEST_PROFILE_RESPONSE } from 'src/mocks/handlers/profile'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_METERS } from 'src/mocks/handlers/meters'

//https://www.toptal.com/react/testing-react-hooks-tutorial
//https://mswjs.io/docs/comparison

const mockHistoryReplace = jest.fn()
const mockEnqueueSnackbar = jest.fn()
const TEST_PROFILE_RESPONSE = applyCamelCase(MOCK_TEST_PROFILE_RESPONSE)

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
            result.current.updateAccomodation('17707368031234', { houseType: 'Maison', meterId: '17707368031234' })
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
                await result.current.updateAccomodation('17707368031234', { houseType: 'Maison' })
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
    test('when success isLoadingInProgress should change', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useAccomodation(), { initialState: {} })
        expect(result.current.isLoadingInProgress).toBe(false)
        act(() => {
            result.current.loadAccomodation(TEST_METERS[0].guid)
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
