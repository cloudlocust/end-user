import { userModel } from 'src/modules/User/model'
import { init } from '@rematch/core'
import { models } from 'src/models'
import { TEST_SUCCESS_MAIL, TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { handleRegisterErrors } from '.'
import { applyCamelCase } from 'src/common/react-platform-components'

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
        // test('changePassword ok test', async () => {
        //     const store = init({
        //         models,
        //     })
        //     const result = await store.dispatch.userModel.changePassword({
        //         data: { password: '123456', token: 'token' },
        //     })
        //     expect(result).toBeUndefined()
        // }, 6000)
        // test('changePassword unexistant email test', async () => {
        //     // TODO.
        // })
        // test('updateCurrentUser test ok', async () => {
        //     const store = init({
        //         models,
        //     })
        //     store.dispatch.userModel.setUser(userData)

        //     const result = await store.dispatch.userModel.updateCurrentUser({
        //         data: { ...userData, firstName: 'updated first name' },
        //     })
        //     expect(result).toBeUndefined()
        //     // Lets get the state and check if it has been modified
        //     const { userModel } = store.getState()
        //     expect(userModel.user).not.toBeNull()
        //     // @ts-ignore nullable tested above
        //     expect(userModel.user.firstName).toBe('updated first name')
        // })
        // test('updateCurrentUser test error', async () => {
        //     const store = init({
        //         models,
        //     })
        //     store.dispatch.userModel.setUser(userData)
        //     let result
        //     try {
        //         result = await store.dispatch.userModel.updateCurrentUser({
        //             data: { ...userData, email: 'error@gmail.com' },
        //         })
        //     } catch (error) {}
        //     expect(result).toBeUndefined()
        //     // Lets get the state and check if it has been modified
        //     const { userModel } = store.getState()
        //     expect(userModel.user).not.toBeNull()
        //     // @ts-ignore nullable tested above
        //     expect(userModel.user.firstName).toBe(userData.firstName)
        // })
        // test('fetchCurrentUser test', async () => {
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
            // TODO.
        })
        // test('resetPassword test', async () => {
        //     const store = init({
        //         models,
        //     })
        //     const result = await store.dispatch.userModel.resetPassword({
        //         data: { email: TEST_SUCCESS_MAIL },
        //     })
        //     expect(result).toBeUndefined()
        // })
        // test('resetPassword test error', async () => {
        //     // TODO.
        // })
        test('handleRegisterError test', () => {
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
            // Address field error
            error = handleRegisterErrors({
                response: { status: 422, data: { errors: [{ address: ['zip_code none is not an allowed value'] }] } },
            })
            expect(error).toStrictEqual('Veuillez entrer une adresse e-mail valide')
            // Default
            error = handleRegisterErrors({
                response: { status: 500 },
            })
            expect(error).toStrictEqual('Service inaccessible pour le moment.')
            error = handleRegisterErrors({ message: 'test message' })
            expect(error).toStrictEqual('test message')
        })
    })
})
