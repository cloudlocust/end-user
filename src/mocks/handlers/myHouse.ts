import { rest } from 'msw'
import { MY_HOUSE_API } from 'src/modules/MyHouse/Accomodation/AccomodationHooks'
import { TEST_METERS } from './meters'
/**
 * TEST_MY_HOUSE_RESPONSE.
 */
export const TEST_MY_HOUSE_RESPONSE = {
    house_type: 'Appartement',
    house_year: 'Entre_1950_1975',
    residence_type: 'Principale',
    energy_performance_index: 'C',
    number_of_inhabitants: '4',
    house_area: '64',
    meter_id: TEST_METERS[0],
}
// eslint-disable-next-line jsdoc/require-jsdoc
export const myHouseEndpoints = [
    // Get All Meters
    rest.get(MY_HOUSE_API(TEST_METERS[0].guid), (req, res, ctx) => {
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_MY_HOUSE_RESPONSE))
    }),

    rest.post<any>(MY_HOUSE_API(TEST_METERS[0].guid), (req, res, ctx) => {
        const { meter_id } = req.body
        if (meter_id.guid === TEST_METERS[0].guid) {
            return res(ctx.status(200))
        } else {
            return res(ctx.status(400))
        }
    }),
]
