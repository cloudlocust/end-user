import { act } from '@testing-library/react-hooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import useEcogestes from 'src/modules/Ecogestes/hooks/ecogestesHook'

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

describe('EcogesteHook test', () => {
    test('useEcogestes should return ecogestes array filtered using categoryId', async () => {
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
        expect(result.current.elementList.length).toBe(2)
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
