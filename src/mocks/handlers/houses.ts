import { rest } from 'msw'
import { IHousing } from 'src/modules/MyHouse/components/HousingCard/housing.d'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { AUTH_BASE_URL } from 'src/modules/User/configs'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Array of houses (logements) for test.
 */
export const TEST_HOUSES: SnakeCasedPropertiesDeep<IHousing>[] = [
    {
        id: 123456789,
        name: 'logement super cool',
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
        name: null,
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
    rest.get(`${AUTH_BASE_URL}/housings`, (req, res, ctx) => {
        const TEST_CUSTOMERS_RESPONSE = getPaginationFromElementList<SnakeCasedPropertiesDeep<IHousing>>(
            req,
            TEST_HOUSES,
        )

        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_CUSTOMERS_RESPONSE))
    }),
]
