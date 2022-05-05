import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from 'react-dom/test-utils'
import { useForgotPassword } from 'src/modules/User/ForgotPassword/hooks'
import { TEST_SUCCESS_MAIL } from 'src/mocks/handlers/user'

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

describe('useForgotPassword hook test', () => {
    test('isForgotPasswordInProgress should change when request is performed', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useForgotPassword(), { initialState: {} })

        expect(result.current.isForgotPasswordProgress).toBe(false)
        act(() => {
            result.current.onSubmitForgotPassword({ email: TEST_SUCCESS_MAIL })
        })
        expect(result.current.isForgotPasswordProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isForgotPasswordProgress
            },
            { timeout: 10000 },
        )
    })

    test('when history is updated when request passes', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useForgotPassword(), { initialState: {} })

        expect(result.current.isForgotPasswordProgress).toBe(false)
        act(() => {
            result.current.onSubmitForgotPassword({ email: TEST_SUCCESS_MAIL })
        })
        expect(result.current.isForgotPasswordProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isForgotPasswordProgress
            },
            { timeout: 10000 },
        )
        expect(mockHistoryReplace).toHaveBeenCalledWith({
            pathname: '/forgot-password-success',
            state: { email: TEST_SUCCESS_MAIL },
        })
    })

    test('when there is a server problem, user is remained in route page and a snackbar should be displayed', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useForgotPassword(), { initialState: {} })

        expect(result.current.isForgotPasswordProgress).toBe(false)
        act(() => {
            result.current.onSubmitForgotPassword(null)
        })
        expect(result.current.isForgotPasswordProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isForgotPasswordProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.anything(), {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
})
