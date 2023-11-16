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
const myEquipmentStr = 'Mon équipement'
const tableContainerTestId = 'table-container'
const equipmentSelectTestId = 'equipment-select'

describe('EquipmentDetailsContent component', () => {
    test('renders without crashing', () => {
        reduxedRender(<EquipmentDetailsContent equipmentDetails={mockedEquipmentDetails} />)

        expect(screen.getByLabelText(myEquipmentStr)).toBeInTheDocument()
        expect(screen.getByTestId(tableContainerTestId)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: "Supprimer l'appareil" })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: "Mesurer l'appareil" })).toBeInTheDocument()
    })

    test('renders the correct number of menu items in the select', () => {
        reduxedRender(<EquipmentDetailsContent equipmentDetails={mockedEquipmentDetails} />)

        const select = screen.getByTestId(equipmentSelectTestId)
        expect(select.children).toHaveLength(4)
    })
})
