import { act } from 'react-dom/test-utils'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useRegister } from './hooks'
import { TEST_SUCCESS_MAIL } from 'src/mocks/handlers/user'
import { RenderResult } from '@testing-library/react-hooks'

const mockHistoryReplace = jest.fn()
const mockEnqueueSnackbar = jest.fn()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        replace: mockHistoryReplace,
    }),
}))

jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))

// eslint-disable-next-line jsdoc/require-jsdoc
const onSubmitBuilder = (result: RenderResult<any>, email: string) => async () => {
    try {
        await result.current.onSubmit({ email: email, password: '123456' })
    } catch (error) {}
}

describe('Testing useRegister hooks', () => {
    test('When register succeded, isRegisterInProgress should change and snack bar success should be displayed', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useRegister(), { initialState: {} })
        expect(result.current.isRegisterInProgress).toBe(false)
        act(() => {
            result.current.onSubmit({ email: TEST_SUCCESS_MAIL, password: '123456' })
        })
        expect(result.current.isRegisterInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isRegisterInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.anything(), {
            autoHideDuration: 8000,
            variant: 'success',
        })
    })
    test('When register failed, isRegisterInProgress should change and snack bar error should be displayed', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useRegister(), { initialState: {} })
        act(onSubmitBuilder(result, 'user@fail.com'))
        expect(result.current.isRegisterInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isRegisterInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.anything(), {
            variant: 'error',
        })
    })
})
