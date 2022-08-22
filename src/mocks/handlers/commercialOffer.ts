import { rest } from 'msw'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { COMMERCIAL_OFFERS_API } from 'src/hooks/CommercialOffer/CommercialOfferHooks'
import { ICommercialOffer, IProvider, ITariffType } from 'src/hooks/CommercialOffer/CommercialOffers'

// eslint-disable-next-line jsdoc/require-jsdoc
/**
 * Variable used in test for load error.
 */
export const TEST_AUTHORIZATION_LOAD_ERROR_COMMERCIAL_OFFER = 'errorLoad'

/**
 * MOCK Provider Offers.
 */
const TEST_OFFERS = [
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
        offers: TEST_OFFERS,
    },
    {
        id: 2,
        name: 'ENGIE',
        offers: TEST_OFFERS,
    },
    {
        id: 3,
        name: 'TotalEnergies',
        offers: TEST_OFFERS,
    },
    {
        id: 4,
        name: 'Eni',
        offers: TEST_OFFERS,
    },
    {
        id: 5,
        name: 'Vattenfall',
        offers: TEST_OFFERS,
    },
    {
        id: 6,
        name: 'Méga Energie',
        offers: TEST_OFFERS,
    },
    {
        id: 7,
        name: 'Planète Oui',
        offers: TEST_OFFERS,
    },
    {
        id: 8,
        name: 'ekWateur',
        offers: TEST_OFFERS,
    },
    {
        id: 9,
        name: 'OHM Energie',
        offers: TEST_OFFERS,
    },
    {
        id: 10,
        name: 'Alpiq',
        offers: TEST_OFFERS,
    },
    {
        id: 11,
        name: 'Wekiwi',
        offers: TEST_OFFERS,
    },
    {
        id: 12,
        name: 'Ilek',
        offers: TEST_OFFERS,
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
]

/**
 * Mock of Commercial Offer.
 */
export var TEST_COMMERCIAL_OFFER: SnakeCasedPropertiesDeep<ICommercialOffer> = {
    providers: TEST_PROVIDERS,
    tariff_type: TEST_TARIFF_TYPES,
}

/**
 * Mock Endpoints of Commercial Offer.
 */
export const commercialOfferEndpoints = [
    // Get Commercial Offer
    rest.get(COMMERCIAL_OFFERS_API, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === TEST_AUTHORIZATION_LOAD_ERROR_COMMERCIAL_OFFER)
            return res(ctx.status(404), ctx.delay(1000), ctx.json('error'))
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_COMMERCIAL_OFFER))
    }),
]
