import { rest } from 'msw'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import {
    CONTRACT_TYPE_LIST_API,
    OFFERS_API,
    POWERS_API,
    PROVIDERS_API,
    TARIFF_TYPES_API,
} from 'src/hooks/CommercialOffer/CommercialOfferHooks'
import { IContractType, IOffer, IPower, IProvider, ITariffType } from 'src/hooks/CommercialOffer/CommercialOffers'

/**
 * ID That generates error when loading (providers, offers, tariffTypes, powers).
 */
export const TEST_LOAD_ERROR_ID = -1
/**
 * Success ID.
 */
export const TEST_LOAD_SUCCESS_ID = 1
// eslint-disable-next-line jsdoc/require-jsdoc
/**
 * Variable used in test for load error.
 */
export const TEST_AUTHORIZATION_LOAD_ERROR_CONTRACT_TYPES = 'errorLoad'

/**
 * MOCK Offers.
 */
export var TEST_OFFERS: SnakeCasedPropertiesDeep<IOffer>[] = [
    {
        id: 1,
        name: 'Bleu',
    },
    {
        id: 2,
        name: 'Tarif réglementé',
    },
    {
        id: 3,
        name: 'Classique',
    },
    {
        id: 4,
        name: 'Digiwatt*',
    },
]

/**
 * Mock of Providers.
 */
export var TEST_PROVIDERS: SnakeCasedPropertiesDeep<IProvider>[] = [
    {
        id: 1,
        name: 'EDF',
    },
    {
        id: 2,
        name: 'ENGIE',
    },
    {
        id: 3,
        name: 'TotalEnergies',
    },
    {
        id: 4,
        name: 'Eni',
    },
    {
        id: 5,
        name: 'Vattenfall',
    },
    {
        id: 6,
        name: 'Méga Energie',
    },
    {
        id: 7,
        name: 'Planète Oui',
    },
    {
        id: 8,
        name: 'ekWateur',
    },
    {
        id: 9,
        name: 'OHM Energie',
    },
    {
        id: 10,
        name: 'Alpiq',
    },
    {
        id: 11,
        name: 'Wekiwi',
    },
    {
        id: 12,
        name: 'Ilek',
    },
]

/**
 * Mock of Tariff Types.
 */
export var TEST_TARIFF_TYPES: SnakeCasedPropertiesDeep<ITariffType>[] = [
    {
        id: 1,
        name: 'BASE',
    },
    {
        id: 2,
        name: 'Heures Pleines / Heures Creuses',
    },
    {
        id: 3,
        name: 'super heures creuses',
    },
    {
        id: 4,
        name: 'Heures Creuses et Week-End',
    },
]

/**
 * Mock of Contract Types.
 */
export var TEST_CONTRACT_TYPES: SnakeCasedPropertiesDeep<IContractType>[] = [
    {
        id: 1,
        name: 'Particulier',
    },
    {
        id: 2,
        name: 'professionnel',
    },
]

/**
 * Mock of Tariff Types.
 */
export var TEST_POWERS: IPower[] = [1, 2, 3, 4, 5]

/**
 * Mock Endpoints of Commercial Offer.
 */
export const commercialOfferEndpoints = [
    // Get CONTRACT TYPES /contract_types
    rest.get(CONTRACT_TYPE_LIST_API, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === TEST_AUTHORIZATION_LOAD_ERROR_CONTRACT_TYPES)
            return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_CONTRACT_TYPES))
    }),
    // GET PROVIDERS /providers?contract_type_id=X
    rest.get(PROVIDERS_API, (req, res, ctx) => {
        const contractTypeId = req.url.searchParams.get('contract_type_id')!

        if (parseInt(contractTypeId) !== TEST_LOAD_ERROR_ID) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_PROVIDERS))
        }
        return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
    }),
    // GET OFFERS /offers?provider_id=X&contract_type_id=X
    rest.get(OFFERS_API, (req, res, ctx) => {
        const contractTypeId = req.url.searchParams.get('contract_type_id')!
        const providerId = req.url.searchParams.get('provider_id')!

        if (parseInt(contractTypeId) !== TEST_LOAD_ERROR_ID && parseInt(providerId) !== TEST_LOAD_ERROR_ID) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_OFFERS))
        }
        return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
    }),
    // GET TARIFF TYPES /tariff_types?offer_id=X
    rest.get(TARIFF_TYPES_API, (req, res, ctx) => {
        const offerId = req.url.searchParams.get('offer_id')!

        if (parseInt(offerId) !== TEST_LOAD_ERROR_ID) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_TARIFF_TYPES))
        }
        return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
    }),
    // GET POWERS /powers?offer_id=X&tariff_type_id=X
    rest.get(POWERS_API, (req, res, ctx) => {
        const tariffType = req.url.searchParams.get('tariff_type_id')!
        const offerId = req.url.searchParams.get('offer_id')!

        if (parseInt(tariffType) !== TEST_LOAD_ERROR_ID && parseInt(offerId) !== TEST_LOAD_ERROR_ID) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_POWERS))
        }
        return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
    }),
]
