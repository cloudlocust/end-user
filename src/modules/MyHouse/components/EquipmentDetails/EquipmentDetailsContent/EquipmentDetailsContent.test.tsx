import { reduxedRender } from 'src/common/react-platform-components/test'
import { screen } from '@testing-library/react'
import { EquipmentDetailsContent } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetailsContent'
import { HousingEquipmentType } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'

const mockedEquipmentDetails: HousingEquipmentType = {
    allowedType: ['electricity'],
    customerId: null,
    housingEquipmentId: 17,
    id: 6,
    isNumber: true,
    measurementModes: ['Standard', 'Décongélation', 'Grill'],
    name: 'microwave',
    number: 3,
}
const TABLE_CONTAINER_TEST_ID = 'table-container'
const EQUIPMENT_SELECT_TEST_ID = 'equipment-select'

describe('EquipmentDetailsContent component', () => {
    test('renders without crashing', () => {
        reduxedRender(<EquipmentDetailsContent equipmentDetails={mockedEquipmentDetails} />)

        expect(screen.getByLabelText('Mon équipement')).toBeInTheDocument()
        expect(screen.getByTestId(TABLE_CONTAINER_TEST_ID)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: "Supprimer l'appareil" })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: "Mesurer l'appareil" })).toBeInTheDocument()
    })

    test('renders the correct number of menu items in the select', () => {
        reduxedRender(<EquipmentDetailsContent equipmentDetails={mockedEquipmentDetails} />)

        const select = screen.getByTestId(EQUIPMENT_SELECT_TEST_ID)
        expect(select.children).toHaveLength(4)
    })
})
