import { act } from 'react-dom/test-utils'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { useRegister } from './hooks'
import { TEST_SUCCESS_MAIL } from 'src/mocks/handlers/user'
import { RenderResult } from '@testing-library/react-hooks'

const mockHistoryReplace = jest.fn()
const mockEnqueueSnackbar = jest.fn()
let mockUserRegistrationAutoValidate = false
let mockIsLoginAfterRegister = false
const REGISTRATION_AUTO_VALIDATE_SUCCESS_MESSAGE =
    'Votre inscription a bien été prise en compte. Vous allez reçevoir un lien de confirmation sur votre adresse email.'
const REGISTRATION_SUCCESS_MESSAGE =
    "Votre inscription a bien été prise en compte, vous pourrez vous connecter une fois celle-ci validée par l'administrateur."

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

jest.mock('src/modules/User/configs', () => ({
    ...jest.requireActual('src/modules/User/configs'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get USER_REGISTRATION_AUTO_VALIDATE() {
        return mockUserRegistrationAutoValidate
    },
}))

jest.mock('src/modules/User/Register/RegisterConfig', () => ({
    ...jest.requireActual('src/modules/User/Register/RegisterConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isLoginAfterRegister() {
        return mockIsLoginAfterRegister
    },
}))

// eslint-disable-next-line jsdoc/require-jsdoc
const onSubmitBuilder = (result: RenderResult<any>, email: string) => async () => {
    try {
        await result.current.onSubmit({ email: email, password: '123456' })
    } catch (error) {}
}

describe('Testing useRegister hooks', () => {
    test('When register success, isRegisterInProgress should change and snack bar success should be displayed', async () => {
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
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(REGISTRATION_SUCCESS_MESSAGE, {
            autoHideDuration: 8000,
            variant: 'success',
        })
    })
    test('When register, succeed with auto validate', async () => {
        mockUserRegistrationAutoValidate = true
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useRegister(), { initialState: {} })
        expect(result.current.isRegisterInProgress).toBe(false)
        act(() => {
            result.current.onSubmit({ email: TEST_SUCCESS_MAIL, password: '123456', address: { zipCode: '7200' } })
        })
        expect(result.current.isRegisterInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isRegisterInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(REGISTRATION_AUTO_VALIDATE_SUCCESS_MESSAGE, {
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
    test('When activate allowedZipCodes and the zipCode does not fit, show error', async () => {
        const {
            renderedHook: { result },
        } = reduxedRenderHook(() => useRegister(), { initialState: {} })
        act(() => {
            result.current.onSubmit({ email: TEST_SUCCESS_MAIL, password: '123456', address: { zipCode: '72000' } }, [
                '69007',
            ])
        })
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
            "Votre commune de résidence n'est pas éligible à l'offre BôWatts",
            {
                variant: 'error',
            },
        )
    })
    test('When activate login after register, dispatch login and no snackbar', async () => {
        mockIsLoginAfterRegister = true
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useRegister(), { initialState: {} })
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
        expect(mockEnqueueSnackbar).not.toHaveBeenCalled()
        mockIsLoginAfterRegister = false
    })
    test('When activate allowedZipCodes and the zipCode fit, register successfully', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useRegister(), { initialState: {} })
        act(() => {
            result.current.onSubmit({ email: TEST_SUCCESS_MAIL, password: '123456', address: { zipCode: '69007' } }, [
                '69007',
            ])
        })
        expect(result.current.isRegisterInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isRegisterInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(REGISTRATION_AUTO_VALIDATE_SUCCESS_MESSAGE, {
            autoHideDuration: 8000,
            variant: 'success',
        })
    })
    test('When activate allowedZipCodes and the zipCode does not exist, continue the process and ignore the zipCode block', async () => {
        const {
            renderedHook: { result, waitForValueToChange },
        } = reduxedRenderHook(() => useRegister(), { initialState: {} })
        act(() => {
            result.current.onSubmit({ email: TEST_SUCCESS_MAIL, password: '123456' }, ['69007'])
        })
        expect(result.current.isRegisterInProgress).toBe(true)
        await waitForValueToChange(
            () => {
                return result.current.isRegisterInProgress
            },
            { timeout: 10000 },
        )
        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(REGISTRATION_AUTO_VALIDATE_SUCCESS_MESSAGE, {
            autoHideDuration: 8000,
            variant: 'success',
        })
    })
})
