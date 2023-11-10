import { userModel } from 'src/modules/User/model'
import { init } from '@rematch/core'
import { models } from 'src/models'
import {
    TEST_AUTHORIZATION_DELETE_PROFILE_ERROR,
    TEST_MESSAGE_DELETE_PROFILE_ERROR,
    TEST_SUCCESS_MAIL,
    TEST_SUCCESS_USER,
    TEST_WRONG_ROLE_MAIL,
} from 'src/mocks/handlers/user'
import { handleRegisterErrors, defaultRequestErrorMessage, Handle422Errors, handleLoginErrors } from '.'
import { applyCamelCase } from 'src/common/react-platform-components'
import { handleUpdateUserError } from 'src/modules/User/ProfileManagement/ProfileManagementHooks'
const userData = applyCamelCase(TEST_SUCCESS_USER)
describe('test models', () => {
    describe('test pure function', () => {
        test('logout test', () => {
            const result = userModel.reducers.logout()
            expect(result.authenticationToken).toBe(null)
            expect(result.user).toBe(null)
        })
        test('setAuthenticationToken test', () => {
            const result = userModel.reducers.setAuthenticationToken(
                { user: null, authenticationToken: null },
                '123456',
            )
            expect(result.user).toBe(null)
            expect(result.authenticationToken).toBe('123456')
        })
        test('setUser test', () => {
            const result = userModel.reducers.setUser({ user: null, authenticationToken: null }, userData)
            expect(result.user).toStrictEqual(userData)
        })
    })
    describe('test impure functions', () => {
        test('changePassword ok test', async () => {
            const store = init({
                models,
            })
            const result = await store.dispatch.userModel.changePassword({
                data: { password: '123456', token: 'token' },
            })
            expect(result).toBeUndefined()
        }, 6000)
        test('changePassword error', async () => {
            const store = init({
                models,
            })
            await expect(
                async () =>
                    await store.dispatch.userModel.changePassword({
                        data: { password: 'errrorrr', token: 'token' },
                    }),
            ).rejects.toBe(defaultRequestErrorMessage)
        })
        test('updateCurrentUser test ok', async () => {
            const store = init({
                models,
            })
            store.dispatch.userModel.setUser(userData)

            const result = await store.dispatch.userModel.updateCurrentUser({
                data: { ...userData, firstName: 'updated first name' },
            })
            expect(result).toBeUndefined()
            // Lets get the state and check if it has been modified
            const { userModel } = store.getState()
            expect(userModel.user).not.toBeNull()
            // @ts-ignore nullable tested above
            expect(userModel.user.firstName).toBe('updated first name')
        })
        test('updateCurrentUser test error', async () => {
            const store = init({
                models,
            })
            store.dispatch.userModel.setUser(userData)
            let result
            try {
                result = await store.dispatch.userModel.updateCurrentUser({
                    data: { ...userData, email: 'error@gmail.com' },
                })
            } catch (error) {}
            expect(result).toBeUndefined()
            // Lets get the state and check if it has been modified
            const { userModel } = store.getState()
            expect(userModel.user).not.toBeNull()
            // @ts-ignore nullable tested above
            expect(userModel.user.firstName).toBe(userData.firstName)
        })

        describe('deleteCurrentUser test ok', () => {
            test('success', async () => {
                const store = init({
                    models,
                })
                store.dispatch.userModel.setUser(userData)

                const result = await store.dispatch.userModel.deleteCurrentUser()
                expect(result).toStrictEqual(userData)
                // Lets get the state and check if it has been deleted
                const { userModel } = store.getState()
                expect(userModel.user).toBeNull()
                expect(userModel.authenticationToken).toBeNull()
            })
            test('error', async () => {
                const { store } = require('src/redux')
                store.dispatch.userModel.setAuthenticationToken(TEST_AUTHORIZATION_DELETE_PROFILE_ERROR)
                store.dispatch.userModel.setUser(userData)
                let result
                try {
                    result = await store.dispatch.userModel.deleteCurrentUser()
                } catch (error) {
                    result = error
                }
                expect(handleUpdateUserError(result)).toBe(TEST_MESSAGE_DELETE_PROFILE_ERROR)
                // Lets get the state and check if it has been deleted
                const { userModel } = store.getState()
                expect(userModel.user).not.toBeNull()
                expect(userModel.authenticationToken).toBe(TEST_AUTHORIZATION_DELETE_PROFILE_ERROR)
            })
        })
        // test('fhCurrentUser test', async () => {
        //     const store = init({
        //         models,
        //     })
        //     store.dispatch.userModel.setUser(userData)
        //     const result = await store.dispatch.userModel.fetchCurrentUser()
        //     await expect(result).toBeUndefined()
        //     const { userModel } = store.getState()
        //     await expect(userModel.user).not.toBeNull()
        //     await expect(userModel.user).toStrictEqual(userData)
        // })

        // test('fetchCurrentUser test error', () => {
        //     // TODO.
        // })
        test('login test', async () => {
            const store = init({
                models,
            })
            const result = await store.dispatch.userModel.login({
                data: { email: TEST_SUCCESS_MAIL, password: '123456' },
            })
            await expect(result).toBeUndefined()
            const { userModel } = store.getState()
            await expect(userModel.user).not.toBeNull()
            await expect(userModel.authenticationToken).not.toBeNull()
        })
        test('login with wrong role', async () => {
            let error
            const store = init({
                models,
            })
            try {
                await store.dispatch.userModel.login({
                    data: { email: TEST_WRONG_ROLE_MAIL, password: '123456' },
                })
            } catch (err) {
                error = err
            }
            expect(error).toBe("Cet utilisateur n'a pas accès à la plateforme, veuillez vérifier vos informations.")
            const { userModel } = store.getState()
            await expect(userModel.user).toBeNull()
            await expect(userModel.authenticationToken).toBeNull()
        })
        test('login test error', async () => {
            const store = init({
                models,
            })
            try {
                await store.dispatch.userModel.login({
                    data: { email: 'qdsfqdsf', password: '123456' },
                })
            } catch (err) {}
            const { userModel } = store.getState()
            await expect(userModel.user).toBeNull()
            await expect(userModel.authenticationToken).toBeNull()
        })
        test('register test', async () => {
            const store = init({
                models,
            })
            const result = await store.dispatch.userModel.register({
                data: { ...userData, password: '12345678' },
            })
            await expect(result).toBeDefined()
            const { userModel } = store.getState()
            await expect(userModel.user).toBeNull()
        })
        test('resetPassword test', async () => {
            const store = init({
                models,
            })
            const result = await store.dispatch.userModel.resetPassword({
                data: { email: TEST_SUCCESS_MAIL },
            })
            expect(result).toBeUndefined()
        })
        test('resetPassword test error', async () => {
            const store = init({
                models,
            })
            await expect(
                async () =>
                    await store.dispatch.userModel.resetPassword({
                        data: { email: 'err@err' },
                    }),
            ).rejects.toBe(defaultRequestErrorMessage)
        })
        test('handleRegisterError test', async () => {
            // Email exists error
            let error = handleRegisterErrors({
                response: { status: 400, data: { detail: 'REGISTER_USER_ALREADY_EXISTS' } },
            })
            expect(error).toStrictEqual("L'email inséré existe déjà")
            // Unauthorize error
            error = handleRegisterErrors({
                response: { status: 401, data: {} },
            })
            expect(error).toStrictEqual("Vous n'avez pas le droit d'effectuer cette opération.")
            // 422 Field Error
            error = handleRegisterErrors({
                response: { status: 422, data: {} },
            })
            expect(error).toStrictEqual(defaultRequestErrorMessage)
            // Default
            error = handleRegisterErrors({
                response: { status: 500 },
            })
            expect(error).toStrictEqual(defaultRequestErrorMessage)
            // Error.message
            error = handleRegisterErrors({ message: 'test message register' })
            expect(error).toStrictEqual('test message register')
        })
        test('Handle422Errors test', async () => {
            // Address field error
            let error = Handle422Errors({
                response: { status: 422, data: { errors: [{ address: ['zip_code none is not an allowed value'] }] } },
            })
            expect(error).toStrictEqual('Veuillez entrer une adresse postale valide')
            // errors not array
            error = Handle422Errors({
                response: { status: 422, data: { errors: {} } },
            })
            expect(error).toStrictEqual(defaultRequestErrorMessage)
            // No Address field error
            error = Handle422Errors({
                response: { status: 422, data: { errors: [] } },
            })
            expect(error).toStrictEqual(defaultRequestErrorMessage)
            error = Handle422Errors({
                response: {
                    status: 422,
                    data: { errors: [{ birthdate: 'Format de la date invalide, DD/MM/YYYY attendu.' }] },
                },
            })
            expect(error).toStrictEqual('Format de la date invalide, DD/MM/YYYY attendu.')
            error = Handle422Errors({
                response: {
                    status: 422,
                    data: { errors: [{ birthdate: 'La date de naissance ne peut être dans le futur.' }] },
                },
            })
            expect(error).toStrictEqual('La date de naissance ne peut être dans le futur.')
        })
        test('handleLogin test', async () => {
            // Login Bad Credentials
            let error = handleLoginErrors({
                response: { status: 400, data: { detail: 'LOGIN_BAD_CREDENTIALS' } },
            })
            expect(error).toStrictEqual("Vérifiez l'email et/ou le mot de passe") // Email exists error
            // User Not Verified
            error = handleLoginErrors({
                response: { status: 400, data: { detail: 'LOGIN_USER_NOT_VERIFIED' } },
            })
            expect(error).toStrictEqual("Votre email n'a pas encore été validé par l'administrateur.")
            // Unauthorize error
            error = handleLoginErrors({
                response: { status: 401, data: {} },
            })
            expect(error).toStrictEqual("Vous n'avez pas le droit d'effectuer cette opération.")
            // Default
            error = handleLoginErrors({
                response: { status: 500 },
            })
            expect(error).toStrictEqual(defaultRequestErrorMessage)
            // Error.message
            error = handleLoginErrors({ message: 'test message login' })
            expect(error).toStrictEqual('test message login')
        })
    })
})
