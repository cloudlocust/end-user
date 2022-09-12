import { rest } from 'msw'
import { AUTH_BASE_URL } from 'src/modules/User/configs'

/**
 * Success user to send in response.
 */
export const TEST_FAQ = [
    {
        id: 1,
        title: 'Thème 1',
        content: 'Réponse 1',
    },
    {
        id: 2,
        title: 'Thème 2',
        content: 'Réponse 2',
    },
    {
        id: 3,
        title: 'Thème 3',
        content: 'Réponse 3',
    },
    {
        id: 4,
        title: 'Thème 4',
        content: 'Réponse 4',
    },
    {
        id: 5,
        title: 'Thème 5',
        content: 'Réponse 5',
    },
    {
        id: 6,
        title: 'Thème 6',
        content: 'Réponse 6',
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export const faqEndpoints = [
    // eslint-disable-next-line jsdoc/require-jsdoc
    rest.get<string>(`${AUTH_BASE_URL}/faq`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(TEST_FAQ))
    }),
]
