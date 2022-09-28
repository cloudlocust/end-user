import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from '@testing-library/react-hooks'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { EDIT_ERROR_MESSAGE, EDIT_SUCCESS_MESSAGE, useMeterForHousing } from './metersHook'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const TEST_NAME_METER = 'HELLO 101'
const TEST_NUMBER_METER = '23215654321'

const SUCCESS_ADD_MESSAGE = 'Compteur ajouté avec succès'
const ERROR_ADD_MESSAGE = "Erreur lors de l'ajout du compteur"

const mockEnqueueSnackbar = jest.fn()
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

describe('addMeter test', () => {
    test('success adding, when adding new it send back correct values.', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useMeterForHousing(), { initialState: {} })

        expect(result.current.loadingInProgress).toBe(false)
        // add new meter
        act(() => {
            result.current.addMeter(TEST_MOCKED_HOUSES[1].id, { name: TEST_NAME_METER, guid: TEST_NUMBER_METER })
        })

        expect(result.current.loadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 2000 },
        )

        expect(result.current.loadingInProgress).toBe(false)

        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(SUCCESS_ADD_MESSAGE, { variant: 'success' })
    })
    test('fail adding, when trying to add to a house that already has a meter should be an error.', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useMeterForHousing(), { initialState: {} })

        expect(result.current.loadingInProgress).toBe(false)
        // first meter of the list already has a meter so it will give us back an error
        act(() => {
            result.current.addMeter(TEST_MOCKED_HOUSES[0].id, { name: TEST_NAME_METER, guid: TEST_NUMBER_METER })
        })

        expect(result.current.loadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 2000 },
        )

        expect(result.current.loadingInProgress).toBe(false)

        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_ADD_MESSAGE, { variant: 'error' })
    })
})

describe('editMeter test', () => {
    test('when editMeter, it sends back the correct response', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useMeterForHousing(), { initialState: {} })
        expect(result.current.loadingInProgress).toBe(false)

        act(() => {
            result.current.editMeter(TEST_MOCKED_HOUSES[0].id, { name: TEST_NAME_METER, guid: TEST_NUMBER_METER })
        })

        expect(result.current.loadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 2000 },
        )

        expect(result.current.loadingInProgress).toBe(false)
        expect(mockEnqueueSnackbar).toBeCalledWith(EDIT_SUCCESS_MESSAGE, { variant: 'success', autoHideDuration: 5000 })
    })
    test('when editMeter fails', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useMeterForHousing(), { initialState: {} })
        expect(result.current.loadingInProgress).toBe(false)

        act(() => {
            result.current.editMeter()
        })

        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 2000 },
        )

        expect(result.current.loadingInProgress).toBe(false)
        expect(mockEnqueueSnackbar).toBeCalledWith(EDIT_ERROR_MESSAGE, { variant: 'error' })
    })
})
