import { act } from '@testing-library/react-hooks'
import { axios } from 'src/common/react-platform-components'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useReplaceNRLinkHook } from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/replaceNrLinkHook'

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

describe('ReplaceNrLink Hook tests', () => {
    test('When using bad house id, should throw error', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useReplaceNRLinkHook(-1), { initialState: {} })

        expect(result.current.loadingInProgress).toBe(false)

        act(async () => {
            try {
                await result.current.replaceNRLink({
                    old: 'aaaaa1aaaaa1aaaa',
                    new: 'aaaaadaaaaadaaaa',
                })
            } catch (err) {}
        })

        await waitForValueToChange(
            () => {
                return result.current.loadingInProgress
            },
            { timeout: 6000 },
        )

        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
            variant: 'error',
        })
    })

    test('When there is no house id, the api should not be called', async () => {
        // mock axios.patch
        const originalAxiosPatch = axios.patch
        const mockAxiosPatch = jest.fn()
        axios.patch = mockAxiosPatch

        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useReplaceNRLinkHook(undefined), { initialState: {} })

        expect(result.current.loadingInProgress).toBe(false)

        act(async () => {
            try {
                await result.current.replaceNRLink({
                    old: 'aaaaa1aaaaa1aaab',
                    new: 'aaaaa1aaaaa1aaab',
                })
            } catch (err) {}
        })

        expect(result.current.loadingInProgress).toBe(false)

        expect(mockAxiosPatch).not.toHaveBeenCalled()
        expect(mockEnqueueSnackbar).not.toHaveBeenCalled()

        // reset the original value
        axios.patch = originalAxiosPatch
    })

    describe('when using good houseId', () => {
        test('When using bad nrLinkGuid, should throw error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useReplaceNRLinkHook(42), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(false)

            act(async () => {
                try {
                    await result.current.replaceNRLink({
                        oldNrlinkGuid: 'aaaaa1aaaaa1aaaa',
                        newNrlinkGuid: 'bbbbb2bbbbb2bbbb',
                    })
                } catch (err) {}
            })

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
                variant: 'error',
            })
        })

        test('When user good nrLinkGuid, should throw success', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useReplaceNRLinkHook(42), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(false)

            act(async () => {
                try {
                    await result.current.replaceNRLink({
                        oldNrlinkGuid: 'aaaaa1aaaaa1aaaa',
                        newNrlinkGuid: 'bbbbb2bbbbb2bbbb',
                        clearData: true,
                    })
                } catch (err) {}
            })

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
                variant: 'success',
            })
        })

        test('When user want to clear data, should send clear_data action', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useReplaceNRLinkHook(42), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(false)

            act(async () => {
                try {
                    await result.current.replaceNRLink({
                        oldNrlinkGuid: 'aaaaa1aaaaa1aaaa',
                        newNrlinkGuid: 'llllllllllllllll',
                        clearData: true,
                    })
                } catch (err) {}
            })

            await waitForValueToChange(
                () => {
                    return result.current.loadingInProgress
                },
                { timeout: 6000 },
            )

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.any(String), {
                variant: 'success',
            })
        })
    })
})
