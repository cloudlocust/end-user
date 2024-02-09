import { HousingEquipmentListType } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'
import { getAvailableEquipments, getIconComponent } from 'src/modules/MyHouse/components/Equipments/utils'
import { equipmentNameType, equipmentType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import { ReactComponent as DesktopComputerIcon } from 'src/assets/images/content/housing/equipments/desktopcomputer.svg'

describe('test getAvailableEquipments', () => {
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
