import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { HousingEquipmentType } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'
import { EquipmentMeasurementsContent } from 'src/modules/MyHouse/components/EquipmentMeasurements/EquipmentMeasurementsContent'

const MESURER_L_APPAREIL = "Mesurer l'appareil"
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
        reduxedRender(<EquipmentMeasurementsContent equipmentDetails={mockedEquipmentDetails} />)

        expect(screen.getByLabelText('Mon équipement')).toBeInTheDocument()
        expect(screen.getByTestId(TABLE_CONTAINER_TEST_ID)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: MESURER_L_APPAREIL })).toBeInTheDocument()
    })

    test('renders the correct number of menu items in the select', () => {
        reduxedRender(<EquipmentMeasurementsContent equipmentDetails={mockedEquipmentDetails} />)

        const select = screen.getByTestId(EQUIPMENT_SELECT_TEST_ID)
        expect(select.children).toHaveLength(4)
    })

    test("show the measurement popup when clicking on the button `Mesurer l'appareil`", async () => {
        reduxedRender(<EquipmentMeasurementsContent equipmentDetails={mockedEquipmentDetails} />)

        userEvent.click(screen.getByText(MESURER_L_APPAREIL))
        await waitFor(() => {
            expect(screen.getByRole('presentation')).toBeInTheDocument()
        })
    })
})
