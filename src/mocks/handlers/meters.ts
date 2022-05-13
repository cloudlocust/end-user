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
    name: 'meter1',
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
        guid: '1770736803',
        name: 'Leanne',
    },
    {
        id: 2,
        name: 'Ervin',
        guid: '1106926593',
    },
    {
        id: 3,
        name: 'Clementine',
        guid: '1463123447',
    },
    {
        id: 4,
        name: 'Patricia',
        guid: '4931709623',
    },
    {
        id: 5,
        name: 'Chelsey',
        guid: '2549541289',
    },
    {
        id: 6,
        name: 'Mrs. Dennis',
        guid: '1477935478',
    },
    {
        id: 7,
        name: 'Kurtis',
        guid: '2100676132',
    },
    {
        id: 8,
        name: 'Nicholas',
        guid: '5864936943',
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
        if (req.body.guid === TEST_ERROR_METER_GUID) return res(ctx.status(400), ctx.delay(1000))
        // Other errors
        if (req.body.name === TEST_ERROR_METER_GUID) return res(ctx.status(401), ctx.delay(1000))
        // Success
        const lengthBefore = TEST_METERS.length
        const newCustomer = {
            ...req.body,
            id: lengthBefore + 1,
        }
        TEST_METERS.unshift(newCustomer)
        return res(ctx.status(200), ctx.delay(1000), ctx.json(newCustomer))
    }),
]
