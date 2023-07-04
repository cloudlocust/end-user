import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_SOLAR_EQUIPMENTS } from 'src/mocks/handlers/solarEquipments'
import { SolarEquipmentCreateUpdateProps } from 'src/modules/SolarEquipments/components/SolarEquipmentCreateUpdate/solarEquipmentCreateUpdate'
import { SolarEquipmentCreateUpdate } from 'src/modules/SolarEquipments/components/SolarEquipmentCreateUpdate'
import { ISolarEquipment } from 'src/modules/SolarEquipments/solarEquipments'
import userEvent from '@testing-library/user-event'

const SOLAR_EQUIPMENT: ISolarEquipment[] = applyCamelCase(TEST_SOLAR_EQUIPMENTS)

let mockSolarEquipmentCreateUpdateProps: SolarEquipmentCreateUpdateProps = {
    onClose: jest.fn(),
    open: false,
    solarEquipmentDetails: SOLAR_EQUIPMENT[0],
    reloadSolarEquipmentsList: jest.fn(),
}

describe('SolarEquipmentCreateUpdate component', () => {
    test('dialog is closed', async () => {
        mockSolarEquipmentCreateUpdateProps.open = false
        const { getByText } = reduxedRender(<SolarEquipmentCreateUpdate {...mockSolarEquipmentCreateUpdateProps} />)

        expect(() => getByText('Mon équipement')).toThrow()
    })
    test('dialog is open and solarEquipmentDetails is true, Mon équipement title is shown', async () => {
        mockSolarEquipmentCreateUpdateProps.open = true
        const { getByText } = reduxedRender(<SolarEquipmentCreateUpdate {...mockSolarEquipmentCreateUpdateProps} />)

        expect(getByText('Mon équipement')).toBeInTheDocument()
        expect(getByText('Modifier')).toBeInTheDocument()
    })
    test('dialog is open and user click on close button', async () => {
        mockSolarEquipmentCreateUpdateProps.open = true
        const { getByTestId } = reduxedRender(<SolarEquipmentCreateUpdate {...mockSolarEquipmentCreateUpdateProps} />)

        const closeBtn = getByTestId('solrEquipmentCloseIcon')

        expect(closeBtn).toBeInTheDocument()
        userEvent.click(closeBtn)
        expect(mockSolarEquipmentCreateUpdateProps.onClose).toBeCalled()
    })
    test('dialog is open and solarEquipmentDetails is false, Mon équipement title is shown', async () => {
        mockSolarEquipmentCreateUpdateProps.open = true
        mockSolarEquipmentCreateUpdateProps.solarEquipmentDetails = null
        const { getByText } = reduxedRender(<SolarEquipmentCreateUpdate {...mockSolarEquipmentCreateUpdateProps} />)

        expect(getByText('Ajouter mon équipement')).toBeInTheDocument()
        expect(getByText('Ajouter')).toBeInTheDocument()
    })
    test('when solarEquipmentDetails is true, all fields are filled', async () => {
        mockSolarEquipmentCreateUpdateProps.open = true
        mockSolarEquipmentCreateUpdateProps.solarEquipmentDetails = SOLAR_EQUIPMENT[0]
        const { getByText, getByLabelText } = reduxedRender(
            <SolarEquipmentCreateUpdate {...mockSolarEquipmentCreateUpdateProps} />,
        )

        const equipments = ['Panneau Solaire', 'Onduleur', 'Domotique', 'Autre']
        expect(getByText(equipments[0])).toBeTruthy()
        expect(getByText(equipments[1])).toBeTruthy()
        expect(getByText(equipments[2])).toBeTruthy()
        expect(getByText(equipments[3])).toBeTruthy()

        const installedAt = getByLabelText("Date d'installation")
        expect(installedAt).toHaveAttribute('aria-label', 'Choose date, selected date is 15 déc. 2021')

        expect(getByLabelText('Marque *')).toHaveValue(SOLAR_EQUIPMENT[0].brand)

        expect(getByLabelText('Modèle *')).toHaveValue(SOLAR_EQUIPMENT[0].reference)
    })
    test('when solarEquipment is false, inputs are empty', async () => {
        mockSolarEquipmentCreateUpdateProps.open = true
        mockSolarEquipmentCreateUpdateProps.solarEquipmentDetails = null
        const { getByLabelText } = reduxedRender(
            <SolarEquipmentCreateUpdate {...mockSolarEquipmentCreateUpdateProps} />,
        )

        expect(getByLabelText("Date d'installation")).toHaveValue('')
        expect(getByLabelText('Marque *')).toHaveValue('')
        expect(getByLabelText('Modèle *')).toHaveValue('')
    })
})
