import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentsHeader } from 'src/modules/MyHouse/components/Equipments/EquipmentsHeader/'

let mockIsEquipmentMeterListEmpty = false
let mockHistoryGoBack = jest.fn()
let GO_BACK_BUTTON_TEXT = 'Retour'
let MY_EQUIPMENTS_TEXT = 'Mes équipements'
let ADD_EQUIPMENT_TEXT = 'Ajouter un équipement'
let ADD_ICON = 'add'

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),

    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        goBack: mockHistoryGoBack,
        listen: jest.fn(),
    }),
}))

describe('EquipmentsHeader tests', () => {
    test('when isEquipmentMeterListEmpty is true', async () => {
        mockIsEquipmentMeterListEmpty = true
        const { getByText } = reduxedRender(
            <EquipmentsHeader isEquipmentMeterListEmpty={mockIsEquipmentMeterListEmpty} />,
        )

        expect(getByText(GO_BACK_BUTTON_TEXT)).toBeInTheDocument()
        expect(getByText('arrow_back')).toBeInTheDocument()
        expect(getByText(MY_EQUIPMENTS_TEXT)).toBeInTheDocument()
        expect(() => getByText(ADD_EQUIPMENT_TEXT)).toThrow()
    })
    test('when isEquipmentMeterListEmpty is false', async () => {
        mockIsEquipmentMeterListEmpty = false
        const { getByText } = reduxedRender(
            <EquipmentsHeader isEquipmentMeterListEmpty={mockIsEquipmentMeterListEmpty} />,
        )

        expect(getByText(GO_BACK_BUTTON_TEXT)).toBeInTheDocument()
        expect(getByText('arrow_back')).toBeInTheDocument()
        expect(getByText(MY_EQUIPMENTS_TEXT)).toBeInTheDocument()
        expect(getByText(ADD_EQUIPMENT_TEXT)).toBeInTheDocument()
        expect(getByText(ADD_ICON)).toBeTruthy()
    })
    test('when clicked on Retour, it goBack is called', async () => {
        const { getByText } = reduxedRender(
            <EquipmentsHeader isEquipmentMeterListEmpty={mockIsEquipmentMeterListEmpty} />,
        )

        expect(getByText(GO_BACK_BUTTON_TEXT)).toBeInTheDocument()
        userEvent.click(getByText(GO_BACK_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockHistoryGoBack).toHaveBeenCalled()
        })
    })
})
