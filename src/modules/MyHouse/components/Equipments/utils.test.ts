import {
    HousingEquipmentListType,
    HousingEquipmentType,
} from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'
import {
    filterAndFormathousingEquipments,
    formatHousingEquipment,
    getAvailableEquipments,
    getIconComponent,
} from 'src/modules/MyHouse/components/Equipments/utils'
import {
    IEquipmentMeter,
    equipmentNameType,
    equipmentType,
} from 'src/modules/MyHouse/components/Installation/InstallationType'
import { ReactComponent as DesktopComputerIcon } from 'src/assets/images/content/housing/equipments/desktopcomputer.svg'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_HOUSING_EQUIPMENTS } from 'src/mocks/handlers/equipments'

const CAMEL_CASED_TEST_HOUSING_EQUIPMENTS: IEquipmentMeter[] = applyCamelCase(TEST_HOUSING_EQUIPMENTS)

describe('getAvailableEquipments', () => {
    test('it should filter out equipments that are already chosen', () => {
        const equipments = [
            { id: 1, name: 'tv', allowedType: ['electricity'], customerId: null },
            { id: 2, name: 'oven', allowedType: ['electricity'], customerId: null },
            { id: 3, name: 'fridge', allowedType: ['electricity'], customerId: null },
        ] as equipmentType[] // No need to add the rest of the keys.

        const housingEquipments = [
            {
                housingEquipmentId: 2,
                allowedType: ['electricity'],
                id: 2,
                name: 'oven',
                number: 1,
            },
        ] as HousingEquipmentListType

        const availableEquipments = getAvailableEquipments(housingEquipments, equipments)

        // Define what the expected array should be
        const expectedEquipments = [
            { id: 1, name: 'tv', allowedType: ['electricity'], customerId: null },
            { id: 3, name: 'fridge', allowedType: ['electricity'], customerId: null },
        ]
        expect(availableEquipments).toStrictEqual(expectedEquipments)
    })
    test('it should return all equipments if none are chosen', () => {
        const equipments = [
            { id: 1, name: 'tv', allowedType: ['electricity'], customerId: null },
            { id: 2, name: 'oven', allowedType: ['electricity'], customerId: null },
            { id: 3, name: 'fridge', allowedType: ['electricity'], customerId: null },
        ] as equipmentType[]

        const housingEquipments = [] as HousingEquipmentListType

        const availableEquipments = getAvailableEquipments(housingEquipments, equipments)

        expect(availableEquipments).toEqual(equipments)
    })
})

describe('getIconComponent', () => {
    test('should return the correct icon component for each equipment name', () => {
        expect(getIconComponent('desktopcomputer')).toBe(DesktopComputerIcon)
    })

    test('should throw an error for unknown equipment names', () => {
        expect(() => getIconComponent('unknown_equipment' as equipmentNameType)).toThrowError(
            'No icon component found for equipment name: unknown_equipment',
        )
    })
})

describe('formatHousingEquipment', () => {
    test('should format the housing equipment correctly', () => {
        const mockEquipmentMeter: IEquipmentMeter = {
            id: 1,
            equipmentId: 2,
            equipmentNumber: 1,
            equipment: {
                id: 2,
                name: 'tv',
                allowedType: ['electricity'],
                measurementModes: ['mode1'],
                customerId: null,
            },
        }

        const expectedFormattedEquipment: HousingEquipmentType = {
            ...mockEquipmentMeter,
            id: 2,
            housingEquipmentId: 1,
            name: 'tv',
            equipmentTitle: 'Téléviseur',
            // to ensure that iconComponent is a function, without without needing the exact implementation.
            iconComponent: expect.any(Function),
            allowedType: ['electricity'],
            number: 1,
            isNumber: true,
            measurementModes: ['mode1'],
            customerId: null,
        }

        const formattedEquipment = formatHousingEquipment(mockEquipmentMeter)

        expect(formattedEquipment).toEqual(expectedFormattedEquipment)
    })
})

describe('test filterAndFormathousingEquipments', () => {
    test('it should handle null or empty array', () => {
        expect(filterAndFormathousingEquipments(null)).toStrictEqual([])
        expect(filterAndFormathousingEquipments([])).toStrictEqual([])
    })

    test('should filter and format the housing equipments correctly', () => {
        const mockHousingEquipments: IEquipmentMeter[] = CAMEL_CASED_TEST_HOUSING_EQUIPMENTS.slice(0, 4)
        // we change (equipmentNumber, customerId) of this item, just for testing (to asure that it meets all the conditions)
        mockHousingEquipments[1] = {
            ...mockHousingEquipments[1],
            equipmentNumber: 2,
            equipment: {
                ...mockHousingEquipments[1].equipment,
                customerId: 2,
            },
        }
        mockHousingEquipments[2] = {
            ...mockHousingEquipments[2],
            equipmentNumber: 3,
        }

        // the output should the second one and the fourth one, because they meets all the conditions
        const expectedFormattedEquipments: HousingEquipmentType[] = [
            {
                ...mockHousingEquipments[1],
                id: 2,
                housingEquipmentId: 11,
                name: 'sanitary',
                equipmentTitle: undefined,
                iconComponent: undefined,
                allowedType: ['electricity', 'other'],
                number: 2,
                // it's false, because in mappingEquipmentNameToType Var, type of sanitary is not number.
                isNumber: false,
                measurementModes: undefined,
                customerId: 2,
            },
            {
                ...mockHousingEquipments[3],
                id: 3,
                housingEquipmentId: 12,
                name: 'tv',
                equipmentTitle: 'Téléviseur',
                iconComponent: expect.any(Function),
                allowedType: ['electricity'],
                number: 1,
                isNumber: true,
                measurementModes: undefined,
                customerId: undefined,
            },
        ]

        const filteredFormattedEquipments = filterAndFormathousingEquipments(mockHousingEquipments)
        expect(filteredFormattedEquipments).toEqual(expectedFormattedEquipments)
        // check that the list is ordered by alphabetical according to (equipmentTitle / name)
        expect(filteredFormattedEquipments[0].name).toEqual('sanitary')
        expect(filteredFormattedEquipments[1].name).toEqual('tv')
    })
})
