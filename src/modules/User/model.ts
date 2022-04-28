import { axios, handleErrors } from 'src/common/react-platform-components'
import { AUTH_BASE_URL } from './configs'
import { createModel } from '@rematch/core'
import { RootModel } from 'src/models'

/**
 * User common elements between register and normal interface.
 */
export interface UserAddressType {
    /**
     * Label of the address.
     */
    name: string
    /**
     * Additionnal informations.
     */
    addressAddition?: string
    /**
     * Zip code.
     */
    zipCode: string
    /**
     * Country.
     */
    country: string
    /**
     * City.
     */
    city: string
    /**
     * Latitude.
     */
    lat: number
    /**
     * Longitude.
     */
    lng: number
    /**
     * Extra data (save place id for example).
     */
    extraData?: /**
     *
     */
    { [key: string]: any }
}
/**
 * User common elements between register and normal interface.
 */
interface IBaseUser {
    /**
     * Email of the user.
     */
    email: string
    /**
     * First name of the user.
     */
    firstName: string
    /**
     * Last name of the user.
     */
    lastName: string
    /**
     * Phone number of the user.
     */
    phone: string
    /**
     * Role name.
     */
    role: string
    /**
     * Address.
     */
    address: UserAddressType
    /**
     * Date and time of creation.
     */
    createdAt: string
    /**
     * Date and time of update.
     */
    updatedAt: string
}

/**
 * User interface.
 */
export interface IUser extends IBaseUser {
    /**
     * Identifier of the user.
     */
    id: string
    /**
     * Active state of the user.
     */
    isActive: boolean
    /**
     * Verified state of the user.
     */
    isVerified: boolean
    /**
     * SuperUser State.
     */
    isSuperUser: boolean
}

/**
 * User register interface.
 */
export interface IUserRegister extends IBaseUser {
    /**
     * Password of the user.
     */
    password: string
}
/**
 * User state.
 */
export interface IUserState {
    /**
     * User infos.
     */
    user: IUser | null
    /**
     * Authentication token used to authentifiy the user.
     */
    authenticationToken: string | null
}

/**
 *
 */
export const defaultState = {
    authenticationToken: null,
    user: null,
}

/**
 * Rematch user Model, it contains states, reducers and effects (treatment with side effects).
 */
export const userModel = createModel<RootModel>()({
    /**
     * Effects of the user model.
     *
     * @param dispatch Dispatch to call dispatch of other models.
     * @returns List of effects.
     */
    effects: (dispatch) => ({
        /**
         * Change password function.
         *
         * @param payload N/A.
         * @param payload.data Necessary data to reset password.
         * @param payload.data.password New provided password.
         * @param payload.data.token Token retrieved from URL params.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        async changePassword({ data }: { data: { password: string; token: string } }) {
            try {
                await axios.post(`${AUTH_BASE_URL}/auth/reset-password`, data)
            } catch (error) {
                // use onError callback to handle the error request in the component
                throw handleErrors(error)
            }
        },
        /**
         * Update user data. Be careful, we send multipart form-data because we have file to update (avatar).
         *
         * @param payload Data to update.
         * @param payload.data Users data to update.
         * @param rootState Redux state.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        async updateCurrentUser({ data }: { data: IUser }, rootState) {
            if (!rootState.userModel.user) return
            const response = await axios.patch<IUser>(`${AUTH_BASE_URL}/users/me`, data)
            const user = response.data
            // Set user in localstorage
            dispatch.userModel.setUser(user)
        },
        /**
         * Get current user data.
         *
         * @param payload N/A.
         * @param payload.params Url params to use like embbed or other params.
         * @param rootState Redux state.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        async fetchCurrentUser({ params } = { params: {} }, rootState?) {
            try {
                // Todo what should we do if update current user is called whereas use in null ?
                if (rootState.userModel.user !== null) {
                    const response = await axios.get<IUser>(`${AUTH_BASE_URL}/users/me`, {
                        params,
                    })
                    const user = response.data
                    // Set user in localstorage
                    dispatch.userModel.setUser(user)
                }
            } catch (error) {
                // use onError callback to handle the error request in the component
                throw handleErrors(error)
            }
        },
        /**
         * Login function.
         *
         * @param payload N/A.
         * @param payload.data N/A.
         * @param payload.data.email Email of the user.
         * @param payload.data.password Password of the user.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        async login({ data }: { data: { email: string; password: string } }) {
            try {
                const formData = new FormData()
                formData.append('username', data.email)
                formData.append('password', data.password)
                // eslint-disable-next-line jsdoc/require-jsdoc
                const { data: responseData } = await axios.post<IUser & { accessToken: string; tokenType: string }>(
                    `${AUTH_BASE_URL}/auth/jwt/login`,
                    formData,
                )
                const { accessToken, tokenType, ...usersData } = responseData
                dispatch.userModel.setAuthenticationToken(`${tokenType} ${accessToken}`)
                dispatch.userModel.setUser(usersData)
                // use onSuccess callback to handle the success request in the component
            } catch (error) {
                throw handleLoginErrors(error)
            }
        },
        /**
         * Register function.
         *
         * @param payload User information to send for the register.
         * @param payload.data User information to send for the register.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        async register({ data }: { data: IUserRegister }) {
            try {
                const {
                    data: { authenticationToken, id },
                    // eslint-disable-next-line jsdoc/require-jsdoc
                } = await axios.post<{ authenticationToken?: string; id: number }>(
                    `${AUTH_BASE_URL}/auth/register`,
                    data,
                )
                if (authenticationToken) {
                    dispatch.userModel.setAuthenticationToken(authenticationToken)
                    const userResponse = await axios.get<IUser>(`${AUTH_BASE_URL}/users/${id}`)
                    const user = userResponse.data
                    dispatch.userModel.setUser(user)
                }
            } catch (error) {
                throw handleRegisterErrors(error)
            }
        },
        /**
         * Reset Password function.
         *
         * @param payload Email of the user who wants to reset password.
         * @param payload.data Email of the user who wants to reset password.
         * @param payload.data.email Email of the user who wants to reset password.
         */
        // eslint-disable-next-line jsdoc/require-jsdoc
        async resetPassword({ data }: { data: { email: string } }) {
            try {
                await axios.post(`${AUTH_BASE_URL}/auth/forgot-password`, data)
            } catch (error) {
                // use onError callback to handle the error request in the component
                throw handleErrors(error)
            }
        },
    }),
    reducers: {
        /**
         * Reducers pure functions.
         *
         * @returns New state with empty data user.
         */
        logout(): IUserState {
            return defaultState
        },
        /**
         * Set authentication token after login.
         *
         * @param state Current state.
         * @param authenticationToken Token.
         * @returns New state.
         */
        setAuthenticationToken(state: IUserState, authenticationToken: string): IUserState {
            return {
                ...state,
                authenticationToken,
            }
        },
        /**
         * Set User state.
         *
         * @param state Current state.
         * @param user User data.
         * @returns New state with user data.
         */
        setUser(state: IUserState, user: IUser): IUserState {
            return {
                ...state,
                user: {
                    ...user,
                },
            }
        },
    },
    state: defaultState as IUserState,
})

/**
 * TODO Document.Handle errors in response.
 *
 * @param error TODO Document.
 * @returns TODO Document.
 */
export const handleRegisterErrors = (error: any) => {
    if (error.response && error.response.status) {
        switch (error.response.status) {
            case 400:
                if (error.response.data.detail === 'REGISTER_USER_ALREADY_EXISTS') {
                    return "L'email inséré existe déjà"
                }
                break
            case 401:
                // Handle unauthorized error
                return "Vous n'avez pas le droit d'effectuer cette opération."

            default:
                return 'Service inaccessible pour le moment.'
        }
    } else {
        // If error has no response return the message of error
        return error.message
    }
}

/**
 * TODO Document.Handle errors in response.
 *
 * @param error TODO Document.
 * @returns TODO Document.
 */
export const handleLoginErrors = (error: any) => {
    if (error.response && error.response.status) {
        switch (error.response.status) {
            case 400:
                if (error.response.data.detail === 'LOGIN_BAD_CREDENTIALS') {
                    return "Vérifiez l'email et/ou le mot de passe"
                }
                if (error.response.data.detail === 'LOGIN_USER_NOT_VERIFIED') {
                    return "Votre email n'a pas encore été validé par l'administrateur."
                }
                break
            case 401:
                // Handle unauthorized error
                return "Vous n'avez pas le droit d'effectuer cette opération."

            default:
                return 'Service inaccessible pour le moment.'
        }
    } else {
        // If error has no response return the message of error
        return error.message
    }
}
