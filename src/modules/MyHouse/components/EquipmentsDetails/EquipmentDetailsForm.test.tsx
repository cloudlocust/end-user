import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import EquipmentDetailsForm from 'src/modules/MyHouse/components/EquipmentsDetails/EquipmentsDetailsForm'

let housingEquipmentDetailsData = applyCamelCase([
    {
        equipment_id: 1,
        equipment_type: 'electricity',
        equipment_number: 1,
        equipment_label: null,
        equipment_brand: null,
        equipment_model: null,
        year_of_purchase: null,
        frequency_of_usage_per_week: null,
        average_usage_per_minute: null,
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
        equipment_label: null,
        equipment_brand: null,
        equipment_model: null,
        year_of_purchase: null,
        frequency_of_usage_per_week: null,
        average_usage_per_minute: null,
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

describe('EquipmentDetailsForm', () => {
    let equipmentDetailsFormProps = {
        housingEquipmentsDetails: [],
        addHousingEquipment: mockAddHousingEquipment,
    }

    // Reset props
    beforeEach(() => {
        equipmentDetailsFormProps = {
            housingEquipmentsDetails: [],
            addHousingEquipment: mockAddHousingEquipment,
        }
    })

    test('should render EquipmentDetailsForm normally', () => {
        equipmentDetailsFormProps.housingEquipmentsDetails = housingEquipmentDetailsData

        const { getByLabelText, getByText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)

        // Check if the form is rendered
        expect(getByLabelText('Marque')).toBeInTheDocument()
        expect(getByLabelText('Modèle')).toBeInTheDocument()
        expect(getByLabelText("Date de l'achat")).toBeInTheDocument()
        expect(getByText('Enregistrer')).toBeInTheDocument()
    })

    test('should render EquipmentDetailsForm with default selected equipment', () => {
        equipmentDetailsFormProps.housingEquipmentsDetails = housingEquipmentDetailsData

        const { getByLabelText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)

        // Check if the equipment is selected
        expect(getByLabelText('Equipement 1')).toBeInTheDocument()
        expect(() => getByLabelText('Equipement 2')).toThrow()
    })
    test('should render fields that got changed and saved', async () => {
        equipmentDetailsFormProps.housingEquipmentsDetails = housingEquipmentDetailsData
        const { getByLabelText, getByText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)
        const brandField = getByLabelText('Marque')
        const modelField = getByLabelText('Modèle')
        const saveButton = getByText('Enregistrer')

        let brandFieldNewValue = 'Brand changed'
        let modelFieldNewValue = 'Model changed'

        userEvent.type(brandField, brandFieldNewValue)
        userEvent.type(modelField, modelFieldNewValue)
        userEvent.click(saveButton)

        await waitFor(() => {
            expect(brandField).toHaveValue('Brand changed')
            expect(modelField).toHaveValue('Model changed')

            expect(mockAddHousingEquipment).toBeCalledWith([
                {
                    id: 1,
                    equipmentBrand: brandFieldNewValue,
                    equipmentModel: modelFieldNewValue,
                    equipmentId: 1,
                    yearOfPurchase: null,
                },
            ])
        })
    })
})
