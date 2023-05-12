import { act } from '@testing-library/react-hooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useReplaceNRLinkHook } from 'src/modules/MyHouse/components/ReplaceNRLinkFormPopup/hooks/replaceNrLinkHook'

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
        } = reduxedRenderHook(() => useReplaceNRLinkHook('INVALID_HOUSE_ID'), { initialState: {} })

        expect(result.current.loadingInProgress).toBe(false)

        act(async () => {
            try {
                await result.current.replaceNRLink({
                    old: 'aaaaa1aaaaa1aaaa',
                    new: 'aaaaa1aaaaa1aaaa',
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

    describe('when using good houseId', () => {
        test('When using bad nrLinkGuid, should throw error', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useReplaceNRLinkHook('42'), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(false)

            act(async () => {
                try {
                    await result.current.replaceNRLink({
                        old: 'aaaaa1aaaaa1aaaa',
                        new: 'bbbbb2bbbbb2bbbb',
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
            } = reduxedRenderHook(() => useReplaceNRLinkHook('42'), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(false)

            act(async () => {
                try {
                    await result.current.replaceNRLink({
                        old: 'aaaaa1aaaaa1aaaa',
                        new: 'bbbbb2bbbbb2bbbb',
                        clear_data: true,
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
            } = reduxedRenderHook(() => useReplaceNRLinkHook('42'), { initialState: {} })

            expect(result.current.loadingInProgress).toBe(false)

            act(async () => {
                try {
                    await result.current.replaceNRLink({
                        old: 'aaaaa1aaaaa1aaaa',
                        new: 'llllllllllllllll',
                        clear_data: true,
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
