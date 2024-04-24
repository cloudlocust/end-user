import { rest } from 'msw'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'

/**
 * Current day consumption test value.
 */
export const CURRENT_DAY_CONSUMPTION_TEST_VALUE = 1000

/**
 * Current day auto consumption test value.
 */
export const CURRENT_DAY_AUTO_CONSUMPTION_TEST_VALUE = 500

/**
 * Current day euro consumption test value.
 */
export const CURRENT_DAY_EURO_CONSUMPTION_TEST_VALUE = 150

/**
 * Current day consumption api requests.
 */
export const currentDayConsumptionEndpoints = [
    // Get the current day consumption and auto consumption.
    rest.get(`${HOUSING_API}/:id/current-day-consumption`, (_, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.delay(1000),
            ctx.json({
                consumption: CURRENT_DAY_CONSUMPTION_TEST_VALUE,
                auto_consumption: CURRENT_DAY_AUTO_CONSUMPTION_TEST_VALUE,
            }),
        )
    }),

    // Get the current day euro consumption.
    rest.get(`${HOUSING_API}/:id/current-day-euro-consumption`, (_, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.delay(1000),
            ctx.json({
                euro_consumption: CURRENT_DAY_EURO_CONSUMPTION_TEST_VALUE,
            }),
        )
    }),
]
