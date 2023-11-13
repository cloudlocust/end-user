import { HousingEquipmentListType } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'
import { getAvailableEquipments } from 'src/modules/MyHouse/components/Equipments/utils'
import { equipmentType } from 'src/modules/MyHouse/components/Installation/InstallationType'

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
