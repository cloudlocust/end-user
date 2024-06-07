import { rest } from 'msw'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import {
    CONTRACT_TYPE_LIST_API,
    CREATE_CUSTOM_PROVIDER_API,
    OFFERS_API,
    POWERS_API,
    PROVIDERS_API,
    TARIFFS_CONTRACT_API,
    TARIFF_TYPES_API,
} from 'src/hooks/CommercialOffer/CommercialOfferHooks'
import { IContractType, IOffer, IPower, IProvider, ITariffType } from 'src/hooks/CommercialOffer/CommercialOffers'
import { frequencyEnum, tariffContract } from 'src/modules/Contracts/contractsTypes.d'

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
        is_deprecated: true,
    },
    {
        id: 2,
        name: 'Tarif réglementé',
        is_deprecated: false,
    },
    {
        id: 3,
        name: 'Classique',
        is_deprecated: false,
    },
    {
        id: 4,
        name: 'Digiwatt*',
        is_deprecated: false,
    },
]

/**
 * Mock of Providers.
 */
export var TEST_PROVIDERS: SnakeCasedPropertiesDeep<IProvider>[] = [
    {
        id: 1,
        name: 'EDF',
        network_identifier: null,
    },
    {
        id: 2,
        name: 'ENGIE',
        network_identifier: null,
    },
    {
        id: 3,
        name: 'TotalEnergies',
        network_identifier: null,
    },
    {
        id: 4,
        name: 'Eni',
        network_identifier: null,
    },
    {
        id: 5,
        name: 'Vattenfall',
        network_identifier: null,
    },
    {
        id: 6,
        name: 'Méga Energie',
        network_identifier: null,
    },
    {
        id: 7,
        name: 'Planète Oui',
        network_identifier: null,
    },
    {
        id: 8,
        name: 'ekWateur',
        network_identifier: null,
    },
    {
        id: 9,
        name: 'OHM Energie',
        network_identifier: null,
    },
    {
        id: 10,
        name: 'Alpiq',
        network_identifier: null,
    },
    {
        id: 11,
        name: 'Wekiwi',
        network_identifier: null,
    },
    {
        id: 12,
        name: 'Ilek',
        network_identifier: null,
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
 * Mock of Tariffs Contract.
 */
export var TEST_TARIFFS_CONTRACT: tariffContract[] = [
    { label: 'abonnement', price: 36.0, freq: frequencyEnum.MONTHLY },
    { label: 'prix kwh', price: 0.125, freq: frequencyEnum.DAILY },
]

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

    // GET TARIFFS_CONTRACT /tariffs_contract?offer_id=X&tariff_type_id=X&contract_type_id=X&power=X&start_subscription=X
    rest.get(TARIFFS_CONTRACT_API, (req, res, ctx) => {
        const tariffType = req.url.searchParams.get('tariff_type_id')!
        const offerId = req.url.searchParams.get('offer_id')!
        const contractTypeId = req.url.searchParams.get('contract_type_id')!
        const power = req.url.searchParams.get('power')!
        const startSubscription = req.url.searchParams.get('start_subscription')!

        if (
            parseInt(tariffType) !== TEST_LOAD_ERROR_ID &&
            parseInt(offerId) !== TEST_LOAD_ERROR_ID &&
            parseInt(contractTypeId) !== TEST_LOAD_ERROR_ID &&
            parseInt(power) !== TEST_LOAD_ERROR_ID &&
            !isNaN(new Date(startSubscription).getTime())
        ) {
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_TARIFFS_CONTRACT))
        }
        return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
    }),

    // Create custom provider
    rest.post(CREATE_CUSTOM_PROVIDER_API, (req, res, ctx) => {
        // Check if the request body is correct
        // eslint-disable-next-line jsdoc/require-jsdoc
        const { name, network_identifier } = req.body as {
            /**
             *
             */
            name: string
            /**
             *
             */
            network_identifier: number
        }
        if (!name) {
            return res(ctx.status(400), ctx.json({ message: 'Name is required' }))
        }

        if (!network_identifier) {
            return res(ctx.status(400), ctx.json({ message: 'Network identifier is required' }))
        }

        // Check if the provider already exists
        if (TEST_PROVIDERS.some((provider) => provider.name === name)) {
            return res(ctx.status(400), ctx.json({ message: 'Provider already exists' }))
        }

        // Create the provider
        TEST_PROVIDERS.push({ id: TEST_PROVIDERS.length + 1, name, network_identifier })

        return res(ctx.status(201), ctx.delay(1000), ctx.json({ id: 1, name: 'Custom Provider', network_identifier }))
    }),
]
