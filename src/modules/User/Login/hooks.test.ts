import { BuilderUseLogin, useLogin } from 'src/modules/User/Login/hooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from 'react-dom/test-utils'
import { TEST_SUCCESS_MAIL, TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { RenderResult } from '@testing-library/react-hooks'
//https://www.toptal.com/react/testing-react-hooks-tutorial
//https://mswjs.io/docs/comparison

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

describe('Testing useLogin hooks', () => {
    test('isLoginInProgress should change following request state wether login succeded or failed', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useLogin(), { initialState: {} })
        expect(result.current.isLoginInProgress).toBe(false)
        act(() => {
            result.current.onSubmit({ email: TEST_SUCCESS_MAIL, password: '123456' })
        })
        // We have to check if this wont get a flaky behaviour (we assume that the value of login progress become true immediately)
        expect(result.current.isLoginInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isLoginInProgress
            },
            { timeout: 10000 },
        )
        act(onSubmitBuilder(result, 'user@fail.com'))
        // We have to check if this wont get a flaky behaviour (we assume that the value of login progress become true immediately)
        expect(result.current.isLoginInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isLoginInProgress
            },
            { timeout: 10000 },
        )
    })
    test('userModel should be filled and history updated when login success', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
            store,
        } = reduxedRenderHook(() => useLogin(), { initialState: {} })
        act(onSubmitBuilder(result, TEST_SUCCESS_MAIL))
        await waitForValueToChange(() => {
            return result.current.isLoginInProgress
        })
        expect(mockHistoryReplace).toHaveBeenCalledWith('/user')
        const { userModel } = store.getState()
        expect(userModel.authenticationToken).not.toBeNull()
        expect(userModel.user).toEqual(expect.objectContaining({ id: TEST_SUCCESS_USER.id }))
    })
    test('userModel shouldnt be filled and history remains the same, and snackbar should be displayed when login fails', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
            store,
        } = reduxedRenderHook(() => useLogin(), { initialState: {} })
        act(onSubmitBuilder(result, 'user@fail.com'))
        await waitForValueToChange(() => {
            return result.current.isLoginInProgress
        })
        const { userModel } = store.getState()
        expect(userModel.authenticationToken).toBeNull()
        expect(userModel.user).toBeNull()
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(expect.anything(), {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
})

describe('test useLoginBuilder', () => {
    test('useLoginBuilder should be filled and history updated when login success', async () => {
        const useCustomLogin = BuilderUseLogin({
            // eslint-disable-next-line jsdoc/require-jsdoc
            redirect: () => '/redirection_test',
        })
        const {
            renderedHook: { result, waitForValueToChange },
            store,
        } = reduxedRenderHook(() => useCustomLogin(), { initialState: {} })
        act(() => {
            result.current.onSubmit({ email: 'user@success.com', password: '123456' })
        })
        await waitForValueToChange(() => {
            return result.current.isLoginInProgress
        })
        expect(mockHistoryReplace).toHaveBeenCalledWith('/redirection_test')
        const { userModel } = store.getState()
        expect(userModel.authenticationToken).not.toBeNull()
        expect(userModel.user).toEqual(expect.objectContaining({ id: TEST_SUCCESS_USER.id }))
    })
})
