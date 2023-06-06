import { rest } from 'msw'
import { API_RESOURCES_URL } from 'src/configs'
import { INovuAlertPreferences } from 'src/modules/Alerts/Alerts.d'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Test error case of Novu Alerts.
 */
export const TEST_NOVU_EROOR = 'error'

const MOCK_NOVU_ALERTS_ENDPOINT = `${API_RESOURCES_URL}/housings/:houseId/novu-alert-preferences`

/**
 * Novu alerts preferences test data.
 */
export const TEST_NOVU_ALERTS_DATA: SnakeCasedPropertiesDeep<INovuAlertPreferences> = {
    is_email_signal_one_day: true,
    is_email_signal_three_days: true,
    is_push_signal_one_day: true,
    is_push_signal_three_days: true,
    is_push_daily_consumption: true,
    is_email_daily_consumption: true,
    is_push_weekly_consumption: true,
    is_email_weekly_consumption: true,
    is_push_monthly_consumption: true,
    is_email_monthly_consumption: true,
    is_push_tempo: true,
    is_email_tempo: true,
}

/**
 * Ecowatt endpoints.
 */
export const novuALertPreferencesEndpoints = [
    rest.get<INovuAlertPreferences>(MOCK_NOVU_ALERTS_ENDPOINT, (req, res, ctx) => {
        const houseId = req.params.houseId
        if (!houseId) return res(ctx.status(400), ctx.delay(1000))
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_NOVU_ALERTS_DATA))
    }),
    // eslint-disable-next-line sonarjs/no-identical-functions
    rest.post<INovuAlertPreferences>(MOCK_NOVU_ALERTS_ENDPOINT, (req, res, ctx) => {
        const houseId = req.params.houseId
        if (!houseId) return res(ctx.status(400), ctx.delay(1000))
        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_NOVU_ALERTS_DATA))
    }),
]
