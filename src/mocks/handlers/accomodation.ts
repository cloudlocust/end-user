import { rest } from 'msw'
import { ACCOMODATION_API } from 'src/modules/MyHouse/components/Accomodation/AccomodationHooks'
import { TEST_METERS } from './meters'
/**
 * TEST_ACCOMODATION_RESPONSE.
 */
export const TEST_ACCOMODATION_RESPONSE = {
    house_type: 'Appartement',
    house_year: 'Entre_1950_1975',
    residence_type: 'Principale',
    energy_performance_index: 'C',
    number_of_inhabitants: '4',
    house_area: '64',
    meter_id: TEST_METERS[0],
}
// eslint-disable-next-line jsdoc/require-jsdoc
export const accomodationEndpoints = [
    // Get All Meters
    rest.get(ACCOMODATION_API(TEST_METERS[0].guid), (req, res, ctx) => {
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_ACCOMODATION_RESPONSE))
    }),

    rest.post<any>(ACCOMODATION_API(TEST_METERS[0].guid), (req, res, ctx) => {
        const { meter_id } = req.body
        if (meter_id.guid === TEST_METERS[0].guid) {
            return res(ctx.status(200))
        } else {
            return res(ctx.status(400))
        }
    }),
]
