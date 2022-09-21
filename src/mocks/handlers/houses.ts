import { applyCamelCase } from 'src/common/react-platform-components'
import { rest } from 'msw'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { defaultValueType } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/utils'
import { addMeterInputType, editMeterInputType } from 'src/modules/Meters/Meters'

/**
 * Array of houses (logements) for test.
 */
export const TEST_HOUSES: SnakeCasedPropertiesDeep<IHousing>[] = [
    {
        id: 1,
        meter: {
            id: 1,
            name: 'my nrlink',
            guid: '12345678911234',
        },
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
        id: 2,
        meter: null,
        address: {
            city: 'monaco',
            zip_code: '3333',
            country: 'france',
            lat: 23,
            lng: 23,
            name: 'the name of something 02',
            place_id: 'xyzab',
            address_addition: undefined,
        },
    },
]

/**
 * Address umpty to generate an error in tests.
 */
export const falseAddress: defaultValueType = {
    city: '',
    zipCode: '',
    country: '',
    lat: 0,
    lng: 0,
    name: '',
    placeId: '',
    addressAddition: undefined,
}

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
    /* Add Housing By address. */
    rest.post</**
     *
     */
    {
        /**
         *
         */
        address: defaultValueType
    }>(HOUSING_API, (req, res, ctx) => {
        const { address } = req.body

        if (address.city !== falseAddress.city) {
            const newId = TEST_HOUSES.length + 1
            let newHouse: SnakeCasedPropertiesDeep<IHousing> = {
                address: applyCamelCase(address),
                meter: null,
                id: newId,
            }

            TEST_HOUSES.push(newHouse)
            return res(ctx.status(200), ctx.delay(1000), ctx.json(newHouse))
        } else {
            return res(ctx.status(401), ctx.delay(1000))
        }
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
    // add meter to housing.
    rest.post<addMeterInputType>(`${HOUSING_API}/:housingId/meter`, (req, res, ctx) => {
        const { name, guid } = req.body
        const { housingId } = req.params
        const houseId = parseInt(housingId)

        const housingToUpdate = TEST_HOUSES.find(
            (housing: SnakeCasedPropertiesDeep<IHousing>) => housing.id === houseId,
        )

        if (housingToUpdate) {
            if (housingToUpdate?.meter) {
                // already exist
                return res(ctx.status(409), ctx.delay(1000))
            } else {
                const newMeter = { name, guid, id: Math.random() }
                housingToUpdate.meter = newMeter

                return res(ctx.status(200), ctx.delay(1000), ctx.json(newMeter))
            }
        } else {
            return res(ctx.status(401), ctx.delay(1000))
        }
    }),

    // Edit meter
    rest.patch<editMeterInputType>(`${HOUSING_API}/:housingId/meter`, (req, res, ctx) => {
        const { name, guid } = req.body
        const { housingId } = req.params
        const houseId = parseInt(housingId)

        const housingToUpdate = TEST_HOUSES.find(
            (housing: SnakeCasedPropertiesDeep<IHousing>) => housing.id === houseId,
        )

        if (!housingToUpdate) {
            return res(ctx.status(400), ctx.delay(1000))
        } else {
            return res(ctx.status(200), ctx.delay(1000), ctx.json({ ...TEST_HOUSES[0].meter, ...{ name, guid } }))
        }
    }),
]
