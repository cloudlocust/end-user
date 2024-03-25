import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_EQUIPMENTS } from 'src/mocks/handlers/equipments'
import { AddEquipmentPopup } from 'src/modules/MyHouse/components/Equipments/AddEquipmentPopup'
import { AddEquipmentPopupProps } from 'src/modules/MyHouse/components/Equipments/AddEquipmentPopup/addEquipmentPopup'
import { equipmentType } from 'src/modules/MyHouse/components/Installation/InstallationType'

let mockAddEquipmentPopupProps: AddEquipmentPopupProps

const TITLE_TEXT = 'Nouvel Equipement'
const EQUIPMENT_TYPE_TEXT = "Type d'equipement :"

beforeEach(() => {
    mockAddEquipmentPopupProps = {
        addEquipment: jest.fn(),
        equipmentsList: [],
        isAddEquipmentLoading: false,
        isOpen: false,
        onClosePopup: jest.fn(),
        addHousingEquipment: jest.fn(),
    }
})

describe('AddEquipmentsPopup', () => {
    test('Popup is open and user click on select', async () => {
        mockAddEquipmentPopupProps.isOpen = true
        mockAddEquipmentPopupProps.equipmentsList = applyCamelCase(TEST_EQUIPMENTS) as equipmentType[]

        const { getByText, getByTestId, getAllByTestId } = reduxedRender(
            <AddEquipmentPopup {...mockAddEquipmentPopupProps} />,
        )

        expect(getByText(TITLE_TEXT)).toBeInTheDocument()
        expect(getByText(EQUIPMENT_TYPE_TEXT)).toBeInTheDocument()

        const selectElement = getByTestId('equipments-select')

        const selectButton = within(selectElement).getByRole('button')

        userEvent.click(selectButton)
        const options = getAllByTestId('equipment-option')

        expect(options).toHaveLength(TEST_EQUIPMENTS.length - 3)
    })
    test('Popup is closed when clicked on close button', async () => {
        mockAddEquipmentPopupProps.isOpen = true
        const { getByTestId } = reduxedRender(<AddEquipmentPopup {...mockAddEquipmentPopupProps} />)
        const closeButton = getByTestId('CloseIcon')
        expect(closeButton).toBeInTheDocument()

        userEvent.click(closeButton)

        expect(mockAddEquipmentPopupProps.onClosePopup).toBeCalled()
    })
    test('when button is disabled and addEquipment is not called', async () => {
        mockAddEquipmentPopupProps.isOpen = true

        const { getByText } = reduxedRender(<AddEquipmentPopup {...mockAddEquipmentPopupProps} />)

        userEvent.click(getByText('Enregistrer'))

        expect(mockAddEquipmentPopupProps.addEquipment).toHaveBeenCalledTimes(0)
    })
})
