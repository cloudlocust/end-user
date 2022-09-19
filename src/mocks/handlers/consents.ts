import { rest } from 'msw'
import { API_RESOURCES_URL } from 'src/configs'
import { IEnedisConsent, IEnedisSgeConsent, INrlinkConsent } from 'src/modules/Consents/Consents'
import { ENEDIS_CONSENT_API, NRLINK_CONSENT_API } from 'src/modules/Consents/consentsHook'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import dayjs from 'dayjs'

// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_CREATED_AT_DATE = '2022-09-15T08:23:55+0000'

// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_ERROR_HOUSING_DOESNT_EXIT = 'error1'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_ERROR_HOUSING_BELONGS_TO_ANOTHER_USER = 'error2'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_ERROR_HOUSING_DOESNT_HAVE_METER = 'error3'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_ERROR_METER_DOESNT_EXIST_SGE_DB = 'error4'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_ERROR_METER_BELONGS_ANOTHER_USER_SGE_DB = 'error'

/**
 * Success test Nrlink consent.
 */
export const TEST_SUCCESS_NRLINK_CONSENT: SnakeCasedPropertiesDeep<INrlinkConsent> = {
    meter_guid: '17707368031234',
    nrlink_consent_state: 'NONEXISTENT',
}

/**
 * Success test Enedis consent.
 */
export const TEST_SUCCESS_ENEDIS_CONSENT: SnakeCasedPropertiesDeep<IEnedisConsent> = {
    meter_guid: '17707368031234',
    enedis_consent_state: 'NONEXISTENT',
}

/**
 * Success test for Enedis Sge consent.
 */
export const TEST_SUCCESS_ENEDIS_SGE_CONSENT: SnakeCasedPropertiesDeep<IEnedisSgeConsent> = {
    enedis_sge_consent_state: 'CONNECTED',
    meter_guid: '17707368031234',
    created_at: TEST_CREATED_AT_DATE,
    expired_at: dayjs(TEST_CREATED_AT_DATE).add(3, 'year').toISOString(),
}

/**
 * Consents endpoints.
 */
export const consentsEndpoints = [
    rest.get<IEnedisConsent>(`${ENEDIS_CONSENT_API}/:meter_guid`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization === 'error') {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SUCCESS_ENEDIS_CONSENT))
        }
    }),

    rest.get<INrlinkConsent>(`${NRLINK_CONSENT_API}/:meter_guid`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization === 'error') {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SUCCESS_NRLINK_CONSENT))
        }
    }),

    rest.get(`${API_RESOURCES_URL}/enedis-sge/consent/:houseid/check`, (req, res, ctx) => {
        // Use authorization to test the different cases in error.response.data.detail
        const authorization = req.headers.get('authorization')
        if (authorization === 'error') {
            return res(ctx.status(400), ctx.delay(3000), ctx.json({ retail: 'error' }))
        } else {
            return res(ctx.status(200), ctx.delay(3000))
        }
    }),

    // eslint-disable-next-line jsdoc/require-jsdoc
    rest.post<{ housing_id: number }>(`${API_RESOURCES_URL}/enedis-sge/consent`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization === 'error') {
            return res(ctx.status(400), ctx.delay(3000), ctx.json({ retail: 'error' }))
        } else {
            return res(ctx.status(200), ctx.delay(3000), ctx.json(TEST_SUCCESS_ENEDIS_SGE_CONSENT))
        }
    }),
]
