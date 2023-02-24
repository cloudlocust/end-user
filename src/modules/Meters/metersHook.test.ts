import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from '@testing-library/react-hooks'
import {
    TEST_HOUSES,
    TEST_OFFPEAK_HOURS_ERROR_MESSAGE,
    TEST_OFFPEAK_HOURS_ERROR_AUTHORIZATION,
} from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { EDIT_ERROR_MESSAGE, EDIT_SUCCESS_MESSAGE, useHousingMeterDetails, useMeterForHousing } from './metersHook'
import {
    TEST_ERROR_METER_GUID,
    TEST_DETAIL_ERROR_METER_GUID,
    TEST_DETAIL_ERROR_MESSAGE,
} from 'src/mocks/handlers/meters'

const TEST_MOCKED_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const TEST_NUMBER_METER = '23215654321'

const SUCCESS_ADD_MESSAGE = 'Compteur ajouté avec succès'
const ERROR_ADD_MESSAGE = "Erreur lors de l'ajout du compteur"
const ERROR_LOAD_MESSAGE = 'Erreur lors du chargement du compteur'

const mockEnqueueSnackbar = jest.fn()

const editMeterOffPeakHourFeatures = {
    features: {
        offpeak: {
            read_only: false,
            offpeak_hours: [
                {
                    start: '08:00',
                    end: '16:00',
                },
            ],
        },
    },
}
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
            result.current.addMeter(TEST_MOCKED_HOUSES[1].id, { guid: TEST_NUMBER_METER })
        })

        expect(result.current.loadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 4000 },
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
            result.current.addMeter(TEST_MOCKED_HOUSES[0].id, { guid: TEST_NUMBER_METER })
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
            result.current.editMeter(TEST_MOCKED_HOUSES[0].id, { guid: TEST_NUMBER_METER })
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

    describe('when editMeter fails with différent cases', () => {
        test('When generic error response', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_ERROR_METER_GUID)
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useMeterForHousing(), { initialState: {} })
            expect(result.current.loadingInProgress).toBe(false)

            act(async () => {
                try {
                    await result.current.editMeter()
                } catch (err) {}
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
        test('When error response with detail message', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_DETAIL_ERROR_METER_GUID)
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useMeterForHousing(), { initialState: {} })
            expect(result.current.loadingInProgress).toBe(false)

            act(async () => {
                try {
                    await result.current.editMeter(TEST_MOCKED_HOUSES[0].id, { features: editMeterOffPeakHourFeatures })
                } catch (err) {}
            })

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )

            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toBeCalledWith(TEST_DETAIL_ERROR_MESSAGE, { variant: 'error' })
        })
        test('When error response with offpeak hours error message', async () => {
            const { store } = require('src/redux')
            await store.dispatch.userModel.setAuthenticationToken(TEST_OFFPEAK_HOURS_ERROR_AUTHORIZATION)
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useMeterForHousing(), { initialState: {} })
            expect(result.current.loadingInProgress).toBe(false)

            act(async () => {
                try {
                    await result.current.editMeter(TEST_MOCKED_HOUSES[0].id, {
                        features: { ...editMeterOffPeakHourFeatures },
                    })
                } catch (err) {}
            })

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 2000 },
            )

            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toBeCalledWith(TEST_OFFPEAK_HOURS_ERROR_MESSAGE, { variant: 'error' })
        })
    })
})

describe('HousingMeter', () => {
    describe('loadElementDetails test', () => {
        test('Error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useHousingMeterDetails(-1), { initialState: {} })
            act(() => {
                try {
                    result.current.loadElementDetails()
                } catch (err) {}
            })
            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )
            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(ERROR_LOAD_MESSAGE, { variant: 'error' })
        }, 8000)
    })
})
