import { LogementType } from 'src/modules/MyHouse/components/HousingCard'
import { SnakeCasedPropertiesDeep } from 'type-fest'

/**
 * Array of houses (logements) for test.
 */
export const TEST_HOUSES: SnakeCasedPropertiesDeep<LogementType>[] = [
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
