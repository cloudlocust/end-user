import { useProfileManagement } from 'src/modules/User/ProfileManagement/ProfileManagementHooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from 'react-dom/test-utils'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'

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

describe('Testing useProfileManagement hooks', () => {
    test('Request success and isUpdateInProgress should change following request state', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useProfileManagement(), {
            initialState: { userModel: { user: TEST_SUCCESS_USER } },
        })
        expect(result.current.isUpdateInProgress).toBe(false)
        act(() => {
            result.current.updateProfile({ firstName: 'Alex', email: TEST_SUCCESS_USER.email })
        })
        expect(result.current.isUpdateInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isUpdateInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Profil modifié avec succès', {
            variant: 'success',
            autoHideDuration: 8000,
        })
    })
    test('Request error and isUpdateInProgress should change following request state', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useProfileManagement(), {
            initialState: { userModel: { user: TEST_SUCCESS_USER } },
        })
        expect(result.current.isUpdateInProgress).toBe(false)
        act(async () => {
            try {
                await result.current.updateProfile({ email: 'error@gmail.com' })
            } catch (error) {}
        })

        expect(result.current.isUpdateInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isUpdateInProgress
            },
            { timeout: 10000 },
        )

        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("L'email inséré existe déjà", {
            variant: 'error',
        })
    })
    test('Request success in change password, and isUpdateInProgress should change following request state', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useProfileManagement(), {
            initialState: { userModel: { user: TEST_SUCCESS_USER } },
        })
        expect(result.current.isUpdateInProgress).toBe(false)
        act(() => {
            result.current.updatePassword({ password: '12345678', repeatPwd: '12345678' })
        })
        expect(result.current.isUpdateInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isUpdateInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Mot de passe modifié avec succès', {
            variant: 'success',
            autoHideDuration: 8000,
        })
    })
})
