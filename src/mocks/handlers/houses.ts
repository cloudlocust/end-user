import { rest } from 'msw'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Array of houses (logements) for test.
 */
export const TEST_HOUSES: SnakeCasedPropertiesDeep<IHousing>[] = [
    {
        id: 123456789,
        guid: '12345Her',
        address: {
            city: 'monaco',
            zip_code: '3333',
            country: 'france',
            lat: 23,
            lng: 23,
            name: 'the name of something',
            place_id: 'xyz',
            address_addition: undefined,
        },
    },
    {
        id: 123456789,
        guid: null,
        address: {
            city: 'monaco',
            zip_code: '3333',
            country: 'france',
            lat: 23,
            lng: 23,
            name: 'the name of something',
            place_id: 'xyzab',
            address_addition: undefined,
        },
    },
]

//eslint-disable-next-line
export const housingEndpoints = [
    // Get All housings
    rest.get(HOUSING_API, (req, res, ctx) => {
        const TEST_CUSTOMERS_RESPONSE = getPaginationFromElementList<SnakeCasedPropertiesDeep<IHousing>>(
            req,
            TEST_HOUSES,
        )

        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_CUSTOMERS_RESPONSE))
    }),
    // Remove Housing
    rest.delete(`${HOUSING_API}/:id`, (req, res, ctx) => {
        const { id } = req.params
        if (parseInt(id)) {
            let indexOfComment = TEST_HOUSES.findIndex((c) => c.id === parseInt(id))
            let oldComment = TEST_HOUSES[indexOfComment]
            TEST_HOUSES.splice(indexOfComment, 1)
            return res(ctx.status(200), ctx.delay(1000), ctx.json(oldComment))
        } else {
            return res(ctx.status(401), ctx.delay(1000))
        }
    }),
]
