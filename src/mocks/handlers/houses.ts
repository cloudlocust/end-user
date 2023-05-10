import { applyCamelCase } from 'src/common/react-platform-components'
import { rest } from 'msw'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing.d'
import { getPaginationFromElementList } from 'src/mocks/utils'
import { HOUSING_API } from 'src/modules/MyHouse/components/HousingList/HousingsHooks'
import { SnakeCasedPropertiesDeep } from 'type-fest'
import { defaultValueType } from 'src/common/ui-kit/form-fields/GoogleMapsAddressAutoComplete/utils'
import { addMeterInputType, editMeterInputType } from 'src/modules/Meters/Meters'
import {
    TEST_DETAIL_ERROR_MESSAGE,
    TEST_DETAIL_ERROR_METER_GUID as TEST_DETAIL_ERROR_AUTHORIZATION,
} from 'src/mocks/handlers/meters'

/**
 * Variable that Handles the case of offpeak error in response.
 *
 */
export const TEST_OFFPEAK_HOURS_ERROR_AUTHORIZATION = 'offpeakHoursError'

/**
 * Variable that Handles the case Load Housings error in response.
 */
export const TEST_AUTHORIZATION_ERROR_LOAD_HOUSINGS = 'ErrorHousings'
/**
 * The offpeak hours message error.
 */
export const TEST_OFFPEAK_HOURS_ERROR_MESSAGE = 'Erreur heures creuses'

/**
 * Array of houses (logements) for test.
 */
export const TEST_HOUSES: SnakeCasedPropertiesDeep<IHousing>[] = [
    {
        id: 1,
        meter: {
            id: 1,
            guid: '12345678911234',
            features: {
                offpeak: {
                    read_only: true,
                    offpeak_hours: [
                        {
                            start: '08:00',
                            end: '16:00',
                        },
                        {
                            start: '20:00',
                            end: '04:00',
                        },
                    ],
                },
            },
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
            name: 'the name of something 03',
            place_id: 'xyzab',
            address_addition: undefined,
        },
    },
    {
        id: 3,
        meter: {
            id: 1,
            guid: '12345678911234',
            features: {
                offpeak: {
                    read_only: false,
                    offpeak_hours: [
                        {
                            start: '08:00',
                            end: '16:00',
                        },
                        {
                            start: '20:00',
                            end: '04:00',
                        },
                    ],
                },
            },
        },
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
    {
        id: 4,
        meter: {
            id: 1,
            guid: '12345678911234',
            features: {
                offpeak: {
                    read_only: false,
                    offpeak_hours: [
                        {
                            start: '08:00',
                            end: '16:00',
                        },
                    ],
                },
            },
        },
        address: {
            city: 'monaco',
            zip_code: '3333',
            country: 'france',
            lat: 23,
            lng: 23,
            name: 'the name of something 04',
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
        const authorization = req.headers.get('authorization')
        if (authorization && authorization === TEST_AUTHORIZATION_ERROR_LOAD_HOUSINGS) return res(ctx.status(500))
        const TEST_CUSTOMERS_RESPONSE = getPaginationFromElementList<SnakeCasedPropertiesDeep<IHousing>>(
            req,
            TEST_HOUSES,
        )

        return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_CUSTOMERS_RESPONSE))
    }),
    /* Update Housing By address. */
    // eslint-disable-next-line jsdoc/require-jsdoc
    rest.put<{ address: SnakeCasedPropertiesDeep<defaultValueType> }>(`${HOUSING_API}/:id`, (req, res, ctx) => {
        const { address } = req.body
        if (address.city !== falseAddress.city) {
            TEST_HOUSES[0].address = address
            return res(ctx.status(200), ctx.delay(1000), ctx.json(TEST_HOUSES[0]))
        } else {
            return res(ctx.status(401), ctx.delay(1000))
        }
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
        const { guid } = req.body
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
                const newMeter = { guid, id: Math.random() }
                housingToUpdate.meter = newMeter

                return res(ctx.status(200), ctx.delay(1000), ctx.json(newMeter))
            }
        } else {
            return res(ctx.status(401), ctx.delay(1000))
        }
    }),

    // Edit meter
    rest.patch<editMeterInputType>(`${HOUSING_API}/:housingId/meter`, (req, res, ctx) => {
        const { guid, features } = req.body
        const { housingId } = req.params
        const houseId = parseInt(housingId)

        const authorization = req.headers.get('authorization')
        if (authorization === TEST_DETAIL_ERROR_AUTHORIZATION)
            return res(ctx.status(400), ctx.delay(1000), ctx.json({ detail: TEST_DETAIL_ERROR_MESSAGE }))
        if (authorization === TEST_OFFPEAK_HOURS_ERROR_AUTHORIZATION)
            return res(
                ctx.status(400),
                ctx.delay(1000),
                ctx.json({ errors: [{ features: { offpeak: { root: TEST_OFFPEAK_HOURS_ERROR_MESSAGE } } }] }),
            )

        const housingToUpdate = TEST_HOUSES.find(
            (housing: SnakeCasedPropertiesDeep<IHousing>) => housing.id === houseId,
        )
        // Generic error
        if (!housingToUpdate) {
            return res(ctx.status(400), ctx.delay(1000))
        }

        const newMeterHousing = {
            ...housingToUpdate.meter,
            guid: guid || housingToUpdate.meter!.guid,
            features: features || housingToUpdate.meter!.features,
        }
        return res(ctx.status(200), ctx.delay(1000), ctx.json(newMeterHousing))
    }),

    // Get one meter
    rest.get<editMeterInputType>(`${HOUSING_API}/:housingId/meter`, (req, res, ctx) => {
        const { housingId } = req.params
        const houseId = parseInt(housingId)

        const foundHousing = TEST_HOUSES.find((housing: SnakeCasedPropertiesDeep<IHousing>) => housing.id === houseId)

        if (!foundHousing) {
            return res(ctx.status(400), ctx.delay(1000))
        }

        return res(ctx.status(200), ctx.delay(1000), ctx.json(foundHousing.meter))
    }),

    // Get Has Missing Housing Contracts Api
    rest.get(`${HOUSING_API}/:housingId/has_missing_housing_contracts`, (req, res, ctx) => {
        const { housingId } = req.params
        if (parseInt(housingId) === TEST_HOUSES[0].id)
            return res(ctx.status(200), ctx.json({ has_missing_housing_contracts: true }), ctx.delay(2000))
        if (parseInt(housingId) === TEST_HOUSES[1].id)
            return res(ctx.status(200), ctx.delay(2000), ctx.json({ has_missing_housing_contracts: false }))
        return res(ctx.status(401), ctx.delay(2000))
    }),
]
