import * as Factory from 'factory.ts'
import Chance from 'chance'

const chance = new Chance()
const typeList = ['DEMOTIC', 'INVERTER', 'SOLAR', 'OTHER']
const date = new Date()
/**
 *
 */
export const EquipmentsFactory = Factory.Sync.makeFactory({
    id: Factory.each((i) => i),
    type: Factory.each(() => typeList[chance.integer({ min: 0, max: 3 })]),
    brand: Factory.each(() => `${chance.sentence({ words: 2 })}`),
    reference: Factory.each(() => `${chance.string({ alpha: true, numeric: true, length: 7, casing: 'upper' })}`),
    installed_at: Factory.each(() => date.toISOString()),
})
