import { rest } from 'msw'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import {
    IConnectedPlug,
    IConnectedPlugConsent,
    IConnectedPlugType,
    connectedPlugAssociateBodyType,
    connectedPlugConsentStateEnum,
    connectedPlugLinkTypeEnum,
} from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import {
    ASSOCIATE_CONNECTED_PLUG_API,
    CONNECTED_PLUG_CONSENT_API,
    SHELLY_CONNECTED_PLUG_LINK_API,
} from 'src/modules/MyHouse/components/ConnectedPlugs/connectedPlugsHook'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'

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
 * Mock of connected plug list data.
 */
export var TEST_CONNECTED_PLUGS_CONSENT: SnakeCasedPropertiesDeep<IConnectedPlugConsent>[] = [
    {
        device_id: '1234123',
        device_name: 'Plug 1234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '2234123',
        device_name: 'Plug 2234123',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '3234123',
        device_name: 'Plug 3234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '4234123',
        device_name: 'Plug 4234123',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '5234123',
        device_name: 'Plug 5234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '6234123',
        device_name: 'Plug 6234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '7234123',
        device_name: 'Plug 7234123',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
    },
    {
        device_id: '8234123',
        device_name: 'Plug 8234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
    },
]

/**
 * Mock of connected plug list with their state.
 */
export var TEST_CONNECTED_PLUGS_TYPE: SnakeCasedPropertiesDeep<IConnectedPlugType>[] = [
    {
        device_id: '1234123',
        link_type: connectedPlugLinkTypeEnum.production,
    },
    {
        device_id: '2234123',
        link_type: null,
    },
    {
        device_id: '3234123',
        link_type: null,
    },
    {
        device_id: '4234123',
        link_type: null,
    },
    {
        device_id: '5234123',
        link_type: null,
    },
    {
        device_id: '6234123',
        link_type: null,
    },
    {
        device_id: '7234123',
        link_type: null,
    },
    {
        device_id: '8234123',
        link_type: null,
    },
]

/**
 * Mock of connected plug list mock data.
 */
export var TEST_CONNECTED_PLUGS: SnakeCasedPropertiesDeep<IConnectedPlug>[] = [
    {
        device_id: '1234123',
        device_name: 'Plug 1234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
        link_type: connectedPlugLinkTypeEnum.production,
    },
    {
        device_id: '2234123',
        device_name: 'Plug 2234123',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
        link_type: null,
    },
    {
        device_id: '3234123',
        device_name: 'Plug 3234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
        link_type: null,
    },
    {
        device_id: '4234123',
        device_name: 'Plug 4234123',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
        link_type: null,
    },
    {
        device_id: '5234123',
        device_name: 'Plug 5234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
        link_type: null,
    },
    {
        device_id: '6234123',
        device_name: 'Plug 6234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
        link_type: null,
    },
    {
        device_id: '7234123',
        device_name: 'Plug 7234123',
        consent_state: connectedPlugConsentStateEnum.DENIED,
        created_at: CREATED_AT_DATA,
        link_type: null,
    },
    {
        device_id: '8234123',
        device_name: 'Plug 8234123',
        consent_state: connectedPlugConsentStateEnum.APPROVED,
        created_at: CREATED_AT_DATA,
        link_type: null,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export const connectedPlugsEndpoints = [
    // Get Meter Connected Plug List.
    rest.get(`${CONNECTED_PLUG_CONSENT_API}/:housingId`, (req, res, ctx) => {
        const { housingId } = req.params
        if (parseInt(housingId) === TEST_ERROR_HOUSING_ID) return res(ctx.status(400), ctx.delay(1000))

        return res(
            ctx.status(200),
            ctx.delay(1000),
            ctx.json({
                meter_guid: '12341234123',
                devices: TEST_CONNECTED_PLUGS,
            }),
        )
    }),

    // Get Shelly Connected Plug Link.
    rest.get(`${SHELLY_CONNECTED_PLUG_LINK_API}/:housingId`, (req, res, ctx) => {
        const { housingId } = req.params

        if (parseInt(housingId) && parseInt(housingId) !== TEST_ERROR_HOUSING_ID)
            return res(ctx.status(200), ctx.delay(1000), ctx.json({ url: TEST_SHELLY_CONNECTED_PLUG_URL }))
        return res(ctx.status(400), ctx.delay(1000))
    }),

    // Associate / Disassociate a connected plug a production.
    rest.post<SnakeCasedPropertiesDeep<connectedPlugAssociateBodyType>>(
        `${ASSOCIATE_CONNECTED_PLUG_API}`,
        (req, res, ctx) => {
            const { housing_id: housingId } = req.body

            if (Number(housingId) && Number(housingId) !== TEST_ERROR_HOUSING_ID)
                return res(ctx.status(200), ctx.delay(1000))
            return res(ctx.status(400), ctx.delay(1000))
        },
    ),

    // Get Connected Plug List with their state.
    rest.get(`${HOUSING_API}/:housing_id/plugs-associations`, (req, res, ctx) => {
        const { housing_id: housingId } = req.params

        if (Number(housingId) && Number(housingId) !== TEST_ERROR_HOUSING_ID)
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_CONNECTED_PLUGS_TYPE))
        return res(ctx.status(400), ctx.delay(1000))
    }),
]
