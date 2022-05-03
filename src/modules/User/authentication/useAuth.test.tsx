import { authTypes } from 'src/common/react-platform-components'
import { useAuth } from 'src/modules/User/authentication/useAuth'
import { AFTER_LOGIN_URL, URL_LOGIN } from 'src/modules/User/Login/LoginConfig'
import { reduxedRenderHook } from 'src/common/react-platform-components/test'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { applyCamelCase } from 'src/common/react-platform-components'

const userData = applyCamelCase(TEST_SUCCESS_USER)
const TEST_ROLE_ERROR = 'fake'
describe('useAuth test', () => {
    describe('hasAcces function', () => {
        test('shouldnt has access', () => {
            const { hasAccess } = reduxedRenderHook(() => useAuth(), {
                initialState: { userModel: { user: userData } },
            }).renderedHook.result.current
            // Auth Test
            expect(hasAccess({ authType: authTypes.anonymousRequired })).toBe(true)
            expect(hasAccess({ authType: authTypes.freeAccess })).toBe(true)
            expect(hasAccess({ authType: authTypes.loginRequired })).toBe(false)
            // Role test
            expect(hasAccess({ authType: authTypes.freeAccess, roles: [TEST_ROLE_ERROR] })).toBe(false)
            expect(hasAccess({ authType: authTypes.anonymousRequired, roles: [TEST_ROLE_ERROR] })).toBe(false)
        })
        test('should have acccess', () => {
            const { hasAccess: hasAccesslogged } = reduxedRenderHook(() => useAuth(), {
                initialState: { userModel: { authenticationToken: '123456', user: userData } },
            }).renderedHook.result.current
            expect(hasAccesslogged({ authType: authTypes.loginRequired })).toBe(true)
            expect(hasAccesslogged({ authType: authTypes.loginRequired, roles: [userData.role] })).toBe(true)
        })
    })
    describe('hasRole function', () => {
        test('When false', () => {
            const { hasRole } = reduxedRenderHook(() => useAuth(), {
                initialState: { userModel: { user: userData } },
            }).renderedHook.result.current
            // When User doesn't have the role.
            expect(hasRole([TEST_ROLE_ERROR])).toBe(false)
        })
        test('When true', () => {
            const { hasRole } = reduxedRenderHook(() => useAuth(), {
                initialState: { userModel: { user: userData } },
            }).renderedHook.result.current
            expect(hasRole([userData.role])).toBe(true)
        })
    })
    describe('getUrlRedirection test', () => {
        test('should redirect to home', () => {
            const { getUrlRedirection } = reduxedRenderHook(() => useAuth()).renderedHook.result.current
            expect(getUrlRedirection({ authType: authTypes.anonymousRequired })).toBe(AFTER_LOGIN_URL)
        })
        test('should redirect to login', () => {
            const { getUrlRedirection } = reduxedRenderHook(() => useAuth()).renderedHook.result.current
            expect(getUrlRedirection({ authType: authTypes.loginRequired })).toBe(URL_LOGIN)
        })
    })
})
