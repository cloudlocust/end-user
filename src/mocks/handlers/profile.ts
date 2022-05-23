import { rest } from 'msw'
import { PROFILE_API } from 'src/modules/Profile/ProfileHooks'
import { TEST_METERS } from './meters'

export const TEST_PROFILE_RESPONSE = {
    house_type: 'Appartement',
    house_year: 'Entre_1950_1975',
    residence_type: 'Principale',
    energy_performance_index: 'C',
    number_of_inhabitants: '4',
    house_area: '64',
    meter_id: TEST_METERS[0],
}
// eslint-disable-next-line jsdoc/require-jsdoc
export const profilEndpoints = [
    // Get All Meters
    rest.get(PROFILE_API(TEST_METERS[0].guid), (req, res, ctx) => {
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_PROFILE_RESPONSE))
    }),

    rest.post<any>(PROFILE_API(TEST_METERS[0].guid), (req, res, ctx) => {
        const { meter_id } = req.body
        if (meter_id.guid === TEST_METERS[0].guid) {
            return res(ctx.status(200))
        } else {
            return res(ctx.status(400))
        }
    }),
]
