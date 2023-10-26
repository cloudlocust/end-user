import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentsHeader } from 'src/modules/MyHouse/components/Equipments/EquipmentsHeader/'
import { EquipmentHeaderProps } from 'src/modules/MyHouse/components/Equipments/EquipmentsHeader/equipmentsHeader'

let mockIsEquipmentMeterListEmpty = false
let mockOnOpenAddEquipmentPopup = jest.fn()

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

let mockEquipmentHeaderProps: EquipmentHeaderProps = {
    isEquipmentMeterListEmpty: mockIsEquipmentMeterListEmpty,
    onOpenAddEquipmentPopup: mockOnOpenAddEquipmentPopup,
}

describe('EquipmentsHeader tests', () => {
    test('when isEquipmentMeterListEmpty is true', async () => {
        mockEquipmentHeaderProps.isEquipmentMeterListEmpty = true
        const { getByText } = reduxedRender(<EquipmentsHeader {...mockEquipmentHeaderProps} />)

        expect(getByText(GO_BACK_BUTTON_TEXT)).toBeInTheDocument()
        expect(getByText('arrow_back')).toBeInTheDocument()
        expect(getByText(MY_EQUIPMENTS_TEXT)).toBeInTheDocument()
        expect(() => getByText(ADD_EQUIPMENT_TEXT)).toThrow()
    })
    test('when isEquipmentMeterListEmpty is false', async () => {
        mockEquipmentHeaderProps.isEquipmentMeterListEmpty = false
        const { getByText } = reduxedRender(<EquipmentsHeader {...mockEquipmentHeaderProps} />)

        expect(getByText(GO_BACK_BUTTON_TEXT)).toBeInTheDocument()
        expect(getByText('arrow_back')).toBeInTheDocument()
        expect(getByText(MY_EQUIPMENTS_TEXT)).toBeInTheDocument()
        expect(getByText(ADD_EQUIPMENT_TEXT)).toBeInTheDocument()
        expect(getByText(ADD_ICON)).toBeTruthy()
    })
    test('when clicked on Retour, it goBack is called', async () => {
        const { getByText } = reduxedRender(<EquipmentsHeader {...mockEquipmentHeaderProps} />)

        expect(getByText(GO_BACK_BUTTON_TEXT)).toBeInTheDocument()
        userEvent.click(getByText(GO_BACK_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockHistoryGoBack).toHaveBeenCalled()
        })
    })
    test('when clicked on Ajouter un équipement, onOpenAddEquipmentPopup gets called', async () => {
        const { getByText } = reduxedRender(<EquipmentsHeader {...mockEquipmentHeaderProps} />)

        userEvent.click(getByText('Ajouter un équipement'))

        await waitFor(() => expect(mockOnOpenAddEquipmentPopup).toHaveBeenCalled())
    })
})
