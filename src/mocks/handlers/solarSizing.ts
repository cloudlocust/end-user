import { rest } from 'msw'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { HousingSolarSizing, ISolarSizing } from 'src/modules/SolarSizing/solarSizeing.types'

// eslint-disable-next-line jsdoc/require-jsdoc
export let TEST_SOLAR_SIZING: ISolarSizing[] = [
    {
        id: 1,
        surface: 100,
        orientation: 180,
        inclination: 45,
        panelArea: 10,
        panelEfficiency: 20,
        panelPower: 100,
        panelPrice: 1000,
        panelWdth: 10,
    },
    {
        id: 2,
        surface: 200,
        orientation: 270,
        inclination: 45,
        panelArea: 20,
        panelEfficiency: 30,
        panelPower: 200,
        panelPrice: 2000,
        panelWdth: 20,
    },
    {
        id: 3,
        surface: 300,
        orientation: 90,
        inclination: 45,
        panelArea: 30,
        panelEfficiency: 40,
        panelPower: 300,
        panelPrice: 3000,
        panelWdth: 30,
    },
    {
        id: 4,
        surface: 400,
        orientation: 45,
        inclination: 45,
        panelArea: 40,
        panelEfficiency: 50,
        panelPower: 400,
        panelPrice: 4000,
        panelWdth: 40,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
export let TEST_HOUSING_SOLAR_SIZING: HousingSolarSizing = {
    solarSizing: TEST_SOLAR_SIZING,
    annualProduction: 1000,
    autoConsumptionPercentage: 50,
    autoProductionPercentage: 50,
    consumptionStartAt: '2022-01-01T00:00:00.000Z',
    consumptionEndAt: '2022-12-31T23:59:59.999Z',
    nominalPower: 3.6,
}

/**
 * Solar sizing requests endpoints.
 */
export const solarSizingEndpoints = [
    rest.post<ISolarSizing>(`${HOUSING_API}/:housingId/solar-sizing`, (req, res, ctx) => {
        if (Object.keys(req.body).length === 0) {
            return res(ctx.status(400))
        } else {
            TEST_SOLAR_SIZING = [...TEST_SOLAR_SIZING, { ...req.body, id: TEST_SOLAR_SIZING.length + 1 }]
            return res(ctx.status(201), ctx.delay(1000), ctx.json(TEST_SOLAR_SIZING))
        }
    }),
    rest.get<HousingSolarSizing>(`${HOUSING_API}/:housingId/solar-sizing`, (req, res, ctx) => {
        // const authorization = req.headers.get('authorization')
        const { housingId } = req.params
        if (parseInt(housingId) === -1) {
            return res(ctx.delay(1000), ctx.status(400), ctx.json({ eroor: 'error' }))
        }

        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_HOUSING_SOLAR_SIZING))
    }),
]
