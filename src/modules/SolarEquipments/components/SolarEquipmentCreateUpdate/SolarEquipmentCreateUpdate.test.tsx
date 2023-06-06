import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_SOLAR_EQUIPMENTS } from 'src/mocks/handlers/solarEquipments'
import { SolarEquipmentCreateUpdateProps } from 'src/modules/SolarEquipments/components/SolarEquipmentCreateUpdate/solarEquipmentCreateUpdate'
import { SolarEquipmentCreateUpdate } from 'src/modules/SolarEquipments/components/SolarEquipmentCreateUpdate'
import { ISolarEquipment } from 'src/modules/SolarEquipments/solarEquipments'

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
        const { getByText, getByLabelText, getByRole } = reduxedRender(
            <SolarEquipmentCreateUpdate {...mockSolarEquipmentCreateUpdateProps} />,
        )

        const equipments = ['Panneau Solaire', 'Onduleur', 'Domotique', 'Autre']
        expect(getByText(equipments[0])).toBeTruthy()
        expect(getByText(equipments[1])).toBeTruthy()
        expect(getByText(equipments[2])).toBeTruthy()
        expect(getByText(equipments[3])).toBeTruthy()

        expect(getByText('Quand votre matériel a été posé ?')).toBeInTheDocument()
        const installedAt = getByLabelText("Date d'installation")
        expect(installedAt).toHaveAttribute('aria-label', 'Choose date, selected date is 15 déc. 2021')

        expect(getByText('Quelle est votre marque ?')).toBeInTheDocument()
        expect(getByRole('textbox', { name: 'brand' })).toHaveValue(SOLAR_EQUIPMENT[0].brand)

        expect(getByText('Quel est le modèle ?')).toBeInTheDocument()
        expect(getByRole('textbox', { name: 'reference' })).toHaveValue(SOLAR_EQUIPMENT[0].reference)
    })
    test('when solarEquipment is false, inputs are empty', async () => {
        mockSolarEquipmentCreateUpdateProps.open = true
        mockSolarEquipmentCreateUpdateProps.solarEquipmentDetails = null
        const { getByLabelText, getByRole } = reduxedRender(
            <SolarEquipmentCreateUpdate {...mockSolarEquipmentCreateUpdateProps} />,
        )

        expect(getByLabelText("Date d'installation")).toHaveValue('')
        expect(getByRole('textbox', { name: 'brand' })).toHaveValue('')
        expect(getByRole('textbox', { name: 'reference' })).toHaveValue('')
    })
})
