import { rest } from 'msw'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { METERS_API } from 'src/modules/Meters/metersHook'
import { addMeterInputType, IMeter } from 'src/modules/Meters/Meters'

/**
 * Mock for meter data to be added.
 */
export const TEST_ADD_METER = {
    guid: '12345123451234',
}

/**
 * Fake meter ID.
 */
export const TEST_ERROR_METER_GUID = 'fakeId'

// eslint-disable-next-line jsdoc/require-jsdoc
export const CREATED_AT_DATA = '2021-12-15T14:07:38.138000'

/**
 * Mock of customers/clients list data.
 */
export var TEST_METERS: SnakeCasedPropertiesDeep<IMeter>[] = [
    {
        id: 1,
        guid: '17707368031234',
    },
    {
        id: 2,
        guid: '11069265931234',
    },
    {
        id: 3,
        guid: '14631234471234',
    },
    {
        id: 4,
        guid: '49317096231234',
    },
    {
        id: 5,
        guid: '25495412891234',
    },
    {
        id: 6,
        guid: '14779354781234',
    },
    {
        id: 7,
        guid: '21006761321234',
    },
    {
        id: 8,
        guid: '58649369431234',
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export const metersEndpoints = [
    // Get All Meters
    rest.get(METERS_API, (req, res, ctx) => {
        const TEST_METERS_RESPONSE = getPaginationFromElementList<SnakeCasedPropertiesDeep<IMeter>>(
            req,
            TEST_METERS as [],
        )
        if (TEST_METERS_RESPONSE !== null) return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_METERS_RESPONSE))
        return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
    }),

    // Add Metr Post request
    rest.post<SnakeCasedPropertiesDeep<addMeterInputType>>(METERS_API, (req, res, ctx) => {
        // Duplicated guid
        if (req.body.guid === TEST_ERROR_METER_GUID)
            return res(ctx.status(400), ctx.delay(1000), ctx.json({ detail: 'Le numéro de compteur existe déjà' }))
        // Success
        const lengthBefore = TEST_METERS.length
        const newMeter = {
            ...req.body,
            id: lengthBefore + 1,
        }
        TEST_METERS.unshift(newMeter)
        return res(ctx.status(200), ctx.delay(1000), ctx.json(newMeter))
    }),
]
