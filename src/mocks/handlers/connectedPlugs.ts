import { rest } from 'msw'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import {
    IConnectedPlug,
    connectedPlugConsentStateEnum,
} from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import { CONNECTED_PLUG_CONSENT_API } from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'

/**
 * Fake meter ID.
 */
export const TEST_ERROR_METER_GUID = 'fakeId'

// eslint-disable-next-line jsdoc/require-jsdoc
export const CREATED_AT_DATA = '2021-12-15T14:07:38.138000'

/**
 * Mock of customers/clients list data.
 */
export var TEST_CONNECTED_PLUGS: SnakeCasedPropertiesDeep<IConnectedPlug>[] = [
    {
        device_id: '1',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '2',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '3',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '4',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '5',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '6',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '7',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '8',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export const connectedPlugsEndpoints = [
    // Get Meter Connected Plugs consent.
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
]
