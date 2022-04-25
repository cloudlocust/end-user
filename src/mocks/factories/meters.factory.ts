import * as Factory from 'factory.ts'
import Chance from 'chance'

const chance = new Chance()

const enedisStateTypes = ['connected', 'nonexistence', 'expired']
const nrlinkStateTypes = ['connected', 'nonexistence', 'disconnected']

// We specify the Builders (Factory) of the Enedis and Nrlink consents individually.

// Creation of the Enedis Builder.

/**
 *  Mock the enedis consent using Make factory and chance.
 *  Factory is the builder, chance is to have a random value.
 */
export const EnedisConsentFactory = Factory.Sync.makeFactory({
    state: Factory.each(() => enedisStateTypes[chance.integer({ min: 0, max: 2 })]),
})

// Creation of the Nrlink Builder witch goes in two steps.

/**
 * Mock the NrlinkFactory (The builder of the nrlink consent).
 * We initialise nrlink_guid to '' because it's value depends on the State field.
 * So we have to create a derivation of this Factory to specify the nrlink_guid.
 */
const NrlinkFactory = Factory.Sync.makeFactory({
    state: Factory.each(() => nrlinkStateTypes[chance.integer({ min: 0, max: 2 })]),
    nrlink_guid: '' as string | null,
})

/**
 * The derivation of NrlinkFactory. In this function we will create the dependencie between the state we created and it's nrlink_guid.
 * If the state is nonexistence then the nrlink_guid should be null, otherwise we give it any other random value.
 */
export const NrlinkConsentFactory = NrlinkFactory.withDerivation('nrlink_guid', (consent) => {
    if (consent.state === 'nonexistence') {
        return null
    } else {
        return chance.string({ length: 11, alpha: true, numeric: true })
    }
})

// Then we create a builder for Consents that calls the two builders and regroup them.
// Create consents Builder, using the two builders nrlink and enedis.

const ConsentsFactory = Factory.Sync.makeFactory({
    enedis: Factory.each(() => EnedisConsentFactory.build()),
    nrlink: Factory.each(() => NrlinkConsentFactory.build()),
})

// We create our final mock Builder that will be used in ocks/meters.ts to build a list of items.

/**
 * Mock meter Factory.
 */
export const MeterFactory = Factory.Sync.makeFactory({
    meter_guid: Factory.each(() => chance.string({ length: 12, alpha: false, numeric: true })),
    name: Factory.each(() => chance.sentence({ words: 3 })),
    consents: Factory.each(() => ConsentsFactory.build()),
})
