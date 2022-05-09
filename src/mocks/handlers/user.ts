import { rest } from 'msw'
import { AUTH_BASE_URL } from 'src/modules/User/configs'
import { IUserRegister } from 'src/modules/User/model'

/**
 * Success mail to send for login.
 */
export const TEST_SUCCESS_MAIL = 'user@success.com'
/**
 *
 */
export const TEST_AUTOVALIDATION_PASSWORD = 'authToken'

/**
 *
 */
export const TEST_FAIL_ID = 23

/**
 * Success user to send in response.
 */
export const TEST_SUCCESS_USER = {
    id: '1',
    first_name: 'Orlando',
    last_name: 'Jackson',
    email: TEST_SUCCESS_MAIL,
    phone: '+33 1 23 45 67 89',
    address: {
        name: 'Apt. 556, Gwenborough. 92998-3874',
        city: 'Gwenborough',
        zip_code: '92998-3874',
        address_addition: 'testFDF',
        country: 'France',
        lat: 45.706877,
        lng: 5.011265,
        extra_data: {},
    },
    role: 'enduser',
    is_active: true,
    is_verified: true,
    is_super_user: false,
    first_login: false,
}

/**
 * Mock enduser List, which represents users that doesn't have installers.
 */
export var TEST_SUCCESS_USERS = [TEST_SUCCESS_USER]
// eslint-disable-next-line jsdoc/require-jsdoc
// export const userEndpoints = []
// eslint-disable-next-line jsdoc/require-jsdoc
export const userEndpoints = [
    // eslint-disable-next-line jsdoc/require-jsdoc
    rest.post<FormData>(`${AUTH_BASE_URL}/auth/jwt/login`, (req, res, ctx) => {
        const username = req.body.get('username')
        if (username === TEST_SUCCESS_MAIL) {
            return res(
                ctx.status(200),
                ctx.json({ ...TEST_SUCCESS_USER, authentication_token: '123456', token_type: 'bearer' }),
            )
        } else {
            return res(ctx.status(400))
        }
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    rest.post<IUserRegister>(`${AUTH_BASE_URL}/auth/register`, (req, res, ctx) => {
        const { email, password } = req.body
        if (email === TEST_SUCCESS_MAIL) {
            if (password === TEST_AUTOVALIDATION_PASSWORD)
                return res(ctx.status(200), ctx.json({ ...TEST_SUCCESS_USER, authentication_token: '123456' }))
            else return res(ctx.status(200), ctx.json(TEST_SUCCESS_USER))
        } else {
            return res(ctx.status(400))
        }
    }),
    //     // eslint-disable-next-line jsdoc/require-jsdoc
    //     rest.post<string>(`${AUTH_BASE_URL}/change`, (req, res, ctx) => {
    //         const email = req.body
    //         if (email === TEST_SUCCESS_MAIL) {
    //             return res(ctx.status(200))
    //         } else {
    //             return res(ctx.status(401))
    //         }
    //     }),

    //     rest.get<string>(`${AUTH_BASE_URL}/users/me`, (req, res, ctx) => {
    //         return res(ctx.status(200), ctx.json(TEST_SUCCESS_USER))
    //     }),

    // Get selected user by id.
    rest.get(`${AUTH_BASE_URL}/users/:id`, (req, res, ctx) => {
        const { id } = req.params
        if (parseInt(id)) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SUCCESS_USERS[0]))
        } else {
            return res(ctx.status(404), ctx.delay(1000), ctx.json({ message: 'Customer not to be found!' }))
        }
    }),

    // Forgot password endpoint
    // eslint-disable-next-line jsdoc/require-jsdoc
    rest.post<{ email: string }>(`${AUTH_BASE_URL}/auth/forgot-password`, (req, res, ctx) => {
        const { email } = req.body
        if (email === TEST_SUCCESS_MAIL) {
            return res(ctx.status(200), ctx.delay(1000))
        } else {
            return res(ctx.status(404), ctx.delay(1000))
        }
    }),

    // Reset password endpoint
    // eslint-disable-next-line jsdoc/require-jsdoc
    rest.post<{ password: string; token: string }>(`${AUTH_BASE_URL}/auth/reset-password`, (req, res, ctx) => {
        const { password, token } = req.body
        if (password !== 'errrorrr' && token) {
            return res(ctx.status(200), ctx.delay(1000))
        } else {
            return res(ctx.status(404), ctx.delay(1000))
        }
    }),
]
