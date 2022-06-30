import { rest } from 'msw'
import { IEnedisConsent, INrlinkConsent } from 'src/modules/Consents/Consents'
import { ENEDIS_CONSENT_API, NRLINK_CONSENT_API } from 'src/modules/Consents/consentsHook'
import { SnakeCasedPropertiesDeep } from 'type-fest'

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
]
