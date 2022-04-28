import { useSelector } from 'react-redux'
import { authT, authTypes } from 'src/common/react-platform-components'
import { AFTER_LOGIN_URL, URL_LOGIN } from 'src/modules/User/Login/LoginConfig'
import { RootState } from 'src/redux'

// loginRequired, anonymousRequired, rolesAccepted

/**
 * Hooks for user authentication, it handles authentication, and role access.
 *
 * @returns Authentication state of the user, and hasRole function to check role access.
 */
export const useAuth = () => {
    const { authenticationToken, user } = useSelector(({ userModel }: RootState) => userModel)
    /**
     * Get authentication state of the user.
     *
     * @returns True if the user is authentified, false otherwise.
     */
    const isAuthenticated = () => Boolean(authenticationToken)

    /**
     * Function which check if the user have access follwoing authentication type.
     *
     * @param auth Authentication type.
     * @returns True if the user has access, false otherwise.
     */
    const hasAccess = (auth: authT = { authType: authTypes.freeAccess }) => {
        // Condition for authentication access.
        const hasAuthenticationAcces =
            auth.authType === authTypes.freeAccess ||
            (auth.authType === authTypes.loginRequired && isAuthenticated()) ||
            (auth.authType === authTypes.anonymousRequired && !isAuthenticated())

        if (hasAuthenticationAcces) {
            // Condition for Role access.
            return auth.roles ? hasRole(auth.roles) : true
        }

        return false
    }

    /**
     * Test that the authenticated user, has the role for a given route with roles.
     *
     * @param roles Roles permitted for a route.
     * @returns Boolean indicating if a user has the role in the given roles of a route.
     */
    const hasRole = (roles: string[]) => {
        return user && user?.role && roles.includes(user?.role)
    }

    /**
     * If the user has not access to the resource, this function returns redirection url.
     *
     * @param auth Authentication type to which user want to access.
     * @returns Redirection endpoint.
     */
    const getUrlRedirection = (auth: authT = { authType: authTypes.freeAccess }) => {
        if (auth.authType === authTypes.loginRequired) {
            return URL_LOGIN
        } else if (auth.authType === authTypes.anonymousRequired) {
            return AFTER_LOGIN_URL
        } else {
            // Should never happen
            throw new Error('Unhandled auth type')
        }
    }

    return { hasAccess, getUrlRedirection, hasRole }
}
