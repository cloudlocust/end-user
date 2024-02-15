import { rest } from 'msw'
import { API_RESOURCES_URL } from 'src/configs'

/**
 * Alpiq Subscription endpoints.
 */
export const AlpiqSubscriptionEndpoints = [
    rest.get(`${API_RESOURCES_URL}/housings/:housingId/alpiq/verify-meter-eligibility`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        const { housingId } = req.params
        if (authorization && authorization === 'snackbar_error') {
            return res(ctx.status(500), ctx.delay(1000))
        } else {
            if (parseInt(housingId) === 1)
                return res(ctx.status(200), ctx.delay(1000), ctx.json({ isMeterEligible: true }))
            return res(ctx.status(200), ctx.delay(1000), ctx.json({ isMeterEligible: false }))
        }
    }),
    rest.get(`${API_RESOURCES_URL}/housings/:housingId/alpiq/monthly-subscription-estimation`, (req, res, ctx) => {
        const authorization = req.headers.get('authorization')
        // const { housingId } = req.params
        // const offerName = req.url.searchParams.get('offer_name')!
        // const power = req.url.searchParams.get('power')!

        if (authorization && authorization === 'snackbar_error') {
            return res(ctx.status(500), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000), ctx.json({ monthlySubscriptionEstimation: 33 }))
        }
    }),
]
