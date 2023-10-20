import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { AddEquipmentPopup } from 'src/modules/MyHouse/components/Equipments/AddEquipmentPopup'
import { AddEquipmentPopupProps } from 'src/modules/MyHouse/components/Equipments/AddEquipmentPopup/addEquipmentPopup'

let mockAddEquipmentPopupProps: AddEquipmentPopupProps

const TITLE_TEXT = 'Nouvel Equipement'
const EQUIPMENT_TYPE_TEXT = "Type d'equipement :"

beforeEach(() => {
    mockAddEquipmentPopupProps = {
        addEquipment: jest.fn(),
        equipmentsList: [],
        isaAdEquipmentLoading: false,
        isOpen: false,
        onClosePopup: jest.fn(),
    }
})

describe('AddEquipmentsPopup', () => {
    test('Popup is open', async () => {
        mockAddEquipmentPopupProps.isOpen = true

        const { getByText } = reduxedRender(<AddEquipmentPopup {...mockAddEquipmentPopupProps} />)

        expect(getByText(TITLE_TEXT)).toBeInTheDocument()
        expect(getByText(EQUIPMENT_TYPE_TEXT)).toBeInTheDocument()
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
