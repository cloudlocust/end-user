import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from 'react-dom/test-utils'
import { useResetPassword } from 'src/modules/User/ResetPassword/hooks'
import { waitFor } from '@testing-library/react'

const mockHistoryPush = jest.fn()
const mockEnqueueSnackbar = jest.fn()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))

jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useSnackbar: () => ({
        enqueueSnackbar: mockEnqueueSnackbar,
    }),
}))

const fakePassword = '123456'
const fakeToken = '123456ABCD'

describe('useResetPassword hook test', () => {
    test('isResetPasswordInProgress should change when request is performed', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useResetPassword(), { initialState: {} })

        expect(result.current.isResetPasswordProgress).toBe(false)
        act(() => {
            result.current.onSubmitResetPassword({ password: fakePassword, token: fakeToken })
        })
        expect(result.current.isResetPasswordProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isResetPasswordProgress
            },
            { timeout: 10000 },
        )
    })

    test('when user confirms new passwords by clicking on Confirmer, a success snackbar is shown', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useResetPassword(), { initialState: {} })

        expect(result.current.isResetPasswordProgress).toBe(false)
        act(() => {
            result.current.onSubmitResetPassword({ password: fakePassword, token: fakeToken })
        })
        expect(result.current.isResetPasswordProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isResetPasswordProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Votre mot de passe a bien été changé', {
            autoHideDuration: 8000,
            variant: 'success',
        })
        await waitFor(
            () => {
                expect(mockHistoryPush).toHaveBeenCalledWith('/login')
            },
            { timeout: 5000 },
        )
    }, 8000)

    test('when there is a server problem, user is remained in route page and a snackbar should be displayed', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useResetPassword(), { initialState: {} })

        expect(result.current.isResetPasswordProgress).toBe(false)
        act(() => {
            result.current.onSubmitResetPassword(null)
        })
        expect(result.current.isResetPasswordProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isResetPasswordProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Une erreur est survenue', {
            autoHideDuration: 5000,
            variant: 'error',
        })
    })
})
