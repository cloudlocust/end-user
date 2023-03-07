import { act } from '@testing-library/react-hooks'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_ECOGESTES } from 'src/mocks/handlers/ecogestes'
import { IEcogeste } from 'src/modules/Ecogestes/components/ecogeste'
import useEcogestes from 'src/modules/Ecogestes/ecogestesHook'

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

const fullEcogestList: IEcogeste[] = applyCamelCase(TEST_ECOGESTES)

describe('EcogesteHook test', () => {
    test('useEcogestes should return ecogestes array', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useEcogestes(), { initialState: {} })

        expect(result.current.loadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 4000 },
        )

        expect(result.current.loadingInProgress).toBe(false)

        expect(result.current.elementList).toBeTruthy()
        expect(result.current.elementList.length).toBe(fullEcogestList.length)
    })

    describe('Patch Ecogeste', () => {
        test('patchEcogeste with correct ID and payload returns 200', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useEcogestes(), {
                initialState: {},
            })

            act(async () => {
                await result.current.updateEcogeste(1, { seen_by_customer: true })
            })

            expect(result.current.loadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 4000 },
            )

            expect(result.current.loadingInProgress).toBe(false)
            expect(mockEnqueueSnackbar).not.toHaveBeenCalledWith(expect.any(String), {
                variant: 'error',
            })
        })
        test('patchEcogeste with unavailable endpoint create error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
                // ecogest 5 is specifically made to throw an error.
            } = reduxedRenderHook(() => useEcogestes(), { initialState: {} })

            act(async () => {
                try {
                    await result.current.updateEcogeste(5, { seen_by_customer: true })
                } catch (err) {}
            })

            await waitForValueToChange(
                () => {
                    return result.current.elementList
                },
                { timeout: 4000 },
            )

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
                variant: 'error',
            })
        })
    })
})
