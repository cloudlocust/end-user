import { rest } from 'msw'
import { API_RESOURCES_URL } from 'src/configs'
import { IEnedisSgeConsent, IEnphaseConsent, INrlinkConsent } from 'src/modules/Consents/Consents'
import {
    ENEDIS_SGE_CONSENT_API,
    ENPHASE_CONSENT_API,
    ENPHASE_URL,
    NRLINK_CONSENT_API,
} from 'src/modules/Consents/consentsHook'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import dayjs from 'dayjs'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_CREATED_AT_DATE = '2022-09-15T08:23:55+0000'
// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_METER_GUID = '17707368031234'

// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_ERROR_AUTHORIZATION = 'error'

// eslint-disable-next-line jsdoc/require-jsdoc
export const TEST_ERROR_ENPHASE_AUTHORIZATION = 'error_enphase'

/**
 * Success test Nrlink consent.
 */
export const TEST_SUCCESS_NRLINK_CONSENT: SnakeCasedPropertiesDeep<INrlinkConsent> = {
    meter_guid: TEST_METER_GUID,
    nrlink_consent_state: 'CONNECTED',
    nrlink_guid: '0x42',
}

/**
 * Success test for Enedis Sge consent.
 */
export const TEST_SUCCESS_ENEDIS_SGE_CONSENT: SnakeCasedPropertiesDeep<IEnedisSgeConsent> = {
    enedis_sge_consent_state: 'CONNECTED',
    meter_guid: TEST_METER_GUID,
    created_at: TEST_CREATED_AT_DATE,
    expired_at: dayjs(TEST_CREATED_AT_DATE).add(3, 'year').toISOString(),
}

/**
 * Success test for enphase consent.
 */
export const TEST_SUCCESS_ENPHASE_CONSENT: SnakeCasedPropertiesDeep<IEnphaseConsent> = {
    enphase_consent_state: 'ACTIVE',
    meter_guid: TEST_METER_GUID,
    created_at: TEST_CREATED_AT_DATE,
}
/**
 * Consents endpoints.
 */
export const consentsEndpoints = [
    rest.get<IEnedisSgeConsent>(`${ENEDIS_SGE_CONSENT_API}/:houseId`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization === TEST_ERROR_AUTHORIZATION) {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SUCCESS_ENEDIS_SGE_CONSENT))
        }
    }),

    rest.get<INrlinkConsent>(`${NRLINK_CONSENT_API}/:meter_guid`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization === TEST_ERROR_AUTHORIZATION) {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SUCCESS_NRLINK_CONSENT))
        }
    }),
    rest.get<IEnphaseConsent>(`${ENPHASE_CONSENT_API}/:meter_guid`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization === TEST_ERROR_AUTHORIZATION) {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_SUCCESS_ENPHASE_CONSENT))
        }
    }),

    rest.get(`${API_RESOURCES_URL}/enedis-sge/consent/:houseid/check`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === 'snackbar_error') {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000))
        }
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    rest.post(`${API_RESOURCES_URL}/enedis-sge/consent/:housingId`, (req, res, ctx) => {
        const { housingId } = req.params
        if (!housingId) return res(ctx.status(400), ctx.delay(1000))
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === 'snackbar_error') {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(201), ctx.delay(1000), ctx.json(TEST_SUCCESS_ENEDIS_SGE_CONSENT))
        }
    }),
    rest.get(`${ENPHASE_URL}/:housingId`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === TEST_ERROR_AUTHORIZATION) {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(
                ctx.status(200),
                ctx.delay(1000),
                ctx.json({
                    url: 'https://enlighten.enphaseenergy.com/',
                }),
            )
        }
    }),

    rest.patch(`${ENPHASE_CONSENT_API}/:meter_guid/revoke`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization === TEST_ERROR_ENPHASE_AUTHORIZATION) {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000))
        }
    }),
]
