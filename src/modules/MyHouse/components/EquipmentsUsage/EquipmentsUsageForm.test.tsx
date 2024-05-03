import { within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentsUsageFormProps } from 'src/modules/MyHouse/components/EquipmentsUsage/EquipmentsUsage.types'
import EquipmentsUsageForm from 'src/modules/MyHouse/components/EquipmentsUsage/EquipmentsUsageForm'

let housingEquipmentsDetails = applyCamelCase([
    {
        equipment_id: 1,
        equipment_type: 'electricity',
        equipment_number: 1,
        equipment_label: 'Equipment label 1',
        equipment_brand: null,
        equipment_model: null,
        year_of_purchase: null,
        frequency_of_usage_per_week: 3,
        average_usage_per_minute: 10,
        usage: ['march, april'],
        id: 1,
        equipment: {
            id: 1,
            name: 'swimmingpool',
            allowed_type: ['electricity'],
            customer_id: null,
            measurement_duration: null,
            measurement_modes: null,
        },
    },
    {
        equipment_id: 2,
        equipment_type: 'electricity',
        equipment_number: 2,
        equipment_label: 'Equipment label 2',
        equipment_brand: null,
        equipment_model: null,
        year_of_purchase: null,
        frequency_of_usage_per_week: 5,
        average_usage_per_minute: 20,
        usage: ['all_year'],
        id: 2,
        equipment: {
            id: 2,
            name: 'swimmingpool',
            allowed_type: ['electricity'],
            customer_id: null,
            measurement_duration: null,
            measurement_modes: null,
        },
    },
])

let mockAddHousingEquipment = jest.fn()

let TITLE = 'Equipment Title Test'

describe('EquipmentsUsageForm tests', () => {
    let equipmentsUsageFormProps: EquipmentsUsageFormProps = {
        housingEquipmentsDetails: [],
        addHousingEquipment: mockAddHousingEquipment,
        title: TITLE,
    }

    // Reset props
    beforeEach(() => {
        equipmentsUsageFormProps = {
            housingEquipmentsDetails: [],
            addHousingEquipment: mockAddHousingEquipment,
            title: '',
        }
    })

    test('should render EquipmentsUsageForm', () => {
        equipmentsUsageFormProps.housingEquipmentsDetails = housingEquipmentsDetails
        equipmentsUsageFormProps.title = TITLE

        const { getByText } = reduxedRender(<EquipmentsUsageForm {...equipmentsUsageFormProps} />)

        expect(getByText(housingEquipmentsDetails[0].equipmentLabel)).toBeInTheDocument()

        expect(getByText(TITLE)).toBeInTheDocument()

        expect(getByText("J'utilise cet équipement environ :")).toBeInTheDocument()
        expect(getByText('Fois par semaine')).toBeInTheDocument()
        expect(getByText('Combien de temps dure chaque utilisation en moyenne :')).toBeInTheDocument()
        expect(getByText("Toute l'année")).toBeInTheDocument()
        expect(getByText('Seulement :')).toBeInTheDocument()
    })
    test('should render select with housing equipments', () => {
        equipmentsUsageFormProps.housingEquipmentsDetails = housingEquipmentsDetails
        equipmentsUsageFormProps.title = TITLE

        const { getByTestId, getAllByTestId } = reduxedRender(<EquipmentsUsageForm {...equipmentsUsageFormProps} />)

        const selectElement = getByTestId('housing-equipments-select')

        const selectButton = within(selectElement).getByRole('button')

        userEvent.click(selectButton)
        const options = getAllByTestId('housing-equipment-option')

        expect(options).toHaveLength(housingEquipmentsDetails.length)
    })
    test('should call addHousingEquipment when button is not clicked', () => {
        equipmentsUsageFormProps.housingEquipmentsDetails = housingEquipmentsDetails
        equipmentsUsageFormProps.title = TITLE

        const { getByText } = reduxedRender(<EquipmentsUsageForm {...equipmentsUsageFormProps} />)

        const submitButton = getByText('Enregistrer')

        userEvent.click(submitButton)

        expect(mockAddHousingEquipment).not.toHaveBeenCalled()
    })
})
