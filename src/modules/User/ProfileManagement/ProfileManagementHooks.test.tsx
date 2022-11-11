import { useProfileManagement } from 'src/modules/User/ProfileManagement/ProfileManagementHooks'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { act } from 'react-dom/test-utils'
import {
    TEST_AUTHORIZATION_DELETE_PROFILE_ERROR,
    TEST_MESSAGE_DELETE_PROFILE_ERROR,
    TEST_SUCCESS_USER,
} from 'src/mocks/handlers/user'

//https://www.toptal.com/react/testing-react-hooks-tutorial
//https://mswjs.io/docs/comparison
const DELETE_PROFILE_SUCCESS_MESSAGE = 'Votre profil a été supprimé avec succès'
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
    test('Request success and isLoadingInProgress should change following request state', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useProfileManagement(), {
            initialState: { userModel: { user: TEST_SUCCESS_USER } },
        })
        expect(result.current.isLoadingInProgress).toBe(false)
        act(() => {
            result.current.updateProfile({ firstName: 'Alex', email: TEST_SUCCESS_USER.email })
        })
        expect(result.current.isLoadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Profil modifié avec succès', {
            variant: 'success',
            autoHideDuration: 8000,
        })
    })
    test('Request error and isLoadingInProgress should change following request state', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useProfileManagement(), {
            initialState: { userModel: { user: TEST_SUCCESS_USER } },
        })
        expect(result.current.isLoadingInProgress).toBe(false)
        act(async () => {
            try {
                await result.current.updateProfile({ email: 'error@gmail.com' })
            } catch (error) {}
        })

        expect(result.current.isLoadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 10000 },
        )

        expect(mockEnqueueSnackbar).toHaveBeenCalledWith("L'email inséré existe déjà", {
            variant: 'error',
        })
    })
    test('Request success in change password, and isLoadingInProgress should change following request state', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useProfileManagement(), {
            initialState: { userModel: { user: TEST_SUCCESS_USER } },
        })
        expect(result.current.isLoadingInProgress).toBe(false)
        act(() => {
            result.current.updatePassword({ password: '12345678', repeatPwd: '12345678' })
        })
        expect(result.current.isLoadingInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isLoadingInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith('Mot de passe modifié avec succès', {
            variant: 'success',
            autoHideDuration: 8000,
        })
    })
    describe('deleteProfile test', () => {
        test('delete success', async () => {
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useProfileManagement(), {
                initialState: { userModel: { user: TEST_SUCCESS_USER, authenticationToken: 'test' } },
            })
            expect(result.current.isLoadingInProgress).toBe(false)
            act(() => {
                result.current.deleteProfile()
            })
            expect(result.current.isLoadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 10000 },
            )
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(DELETE_PROFILE_SUCCESS_MESSAGE, {
                variant: 'success',
                autoHideDuration: 8000,
            })
        })
        test('delete error', async () => {
            const { store } = require('src/redux')
            store.dispatch.userModel.setAuthenticationToken(TEST_AUTHORIZATION_DELETE_PROFILE_ERROR)
            const {
                renderedHook: { result, waitForValueToChange },
            } = reduxedRenderHook(() => useProfileManagement(), {
                initialState: {
                    userModel: {
                        user: TEST_SUCCESS_USER,
                    },
                },
            })
            expect(result.current.isLoadingInProgress).toBe(false)
            act(async () => {
                try {
                    await result.current.deleteProfile()
                } catch (error) {}
            })

            expect(result.current.isLoadingInProgress).toBe(true)
            await waitForValueToChange(
                () => {
                    return result.current.isLoadingInProgress
                },
                { timeout: 10000 },
            )

            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(TEST_MESSAGE_DELETE_PROFILE_ERROR, {
                variant: 'error',
            })
        })
    })
})
