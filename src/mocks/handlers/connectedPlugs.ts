import { rest } from 'msw'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import {
    IConnectedPlug,
    connectedPlugConsentStateEnum,
} from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import {
    CONNECTED_PLUG_CONSENT_API,
    SHELLY_CONNECTED_PLUG_LINK_API,
} from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'

/**
 * Fake meter ID.
 */
export const TEST_ERROR_METER_GUID = 'fakeId'

/**
 * Error Housing Id.
 */
export const TEST_ERROR_HOUSING_ID = -1

// eslint-disable-next-line jsdoc/require-jsdoc
export const CREATED_AT_DATA = '2021-12-15T14:07:38.138000'

/**
 * Shelly Connected Plug URL.
 */
export const TEST_SHELLY_CONNECTED_PLUG_URL = 'shelly_url.com'

/**
 * Mock of customers/clients list data.
 */
export var TEST_CONNECTED_PLUGS: SnakeCasedPropertiesDeep<IConnectedPlug>[] = [
    {
        device_id: '1234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '2234123',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '3234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '4234123',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '5234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '6234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '7234123',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '8234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export const connectedPlugsEndpoints = [
    // Get Meter Connected Plug List.
    rest.get(`${CONNECTED_PLUG_CONSENT_API}/:meterGuid`, (req, res, ctx) => {
        const { meterGuid } = req.params
        if (meterGuid === TEST_ERROR_METER_GUID) return res(ctx.status(400), ctx.delay(1000))

        const TEST_CONNECTED_PLUGS_RESPONSE = getPaginationFromElementList<SnakeCasedPropertiesDeep<IConnectedPlug>>(
            req,
            TEST_CONNECTED_PLUGS as [],
        )
        if (TEST_CONNECTED_PLUGS_RESPONSE !== null)
            return res(
                ctx.status(200),
                ctx.delay(1000),
                ctx.json({
                    meter_guid: '12341234123',
                    devices: TEST_CONNECTED_PLUGS_RESPONSE.items,
                }),
            )
    }),

    // Get Shelly Connected Plug Link.
    rest.get(`${SHELLY_CONNECTED_PLUG_LINK_API}/:houseId`, (req, res, ctx) => {
        const { houseId } = req.params

        if (parseInt(houseId) && parseInt(houseId) !== TEST_ERROR_HOUSING_ID)
            return res(ctx.status(200), ctx.delay(1000), ctx.json({ url: TEST_SHELLY_CONNECTED_PLUG_URL }))
        return res(ctx.status(400), ctx.delay(1000))
    }),
]
