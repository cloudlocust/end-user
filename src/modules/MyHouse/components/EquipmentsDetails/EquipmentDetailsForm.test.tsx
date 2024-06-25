import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import EquipmentDetailsForm from 'src/modules/MyHouse/components/EquipmentsDetails/EquipmentsDetailsForm'

// const CHARGING_STATION_LABEL = 'J’ai une borne de recharge'
// const SOCKET_LABEL = 'Je branche sur une prise sans borne'

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
                    extraData: undefined,
                },
            ])
        })
    })

    // NEW TEST CASES

    // test('should render and interact with isChargesAtHome radio buttons', () => {
    //     equipmentDetailsFormProps.housingEquipmentsDetails = housingEquipmentDetailsData

    //     const { getByLabelText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)

    //     // Check if the radio buttons are rendered
    //     expect(getByLabelText('Oui')).toBeInTheDocument()
    //     expect(getByLabelText('Non')).toBeInTheDocument()

    //     // Interact with the radio buttons
    //     userEvent.click(getByLabelText('Oui'))
    //     expect(getByLabelText('Oui')).toBeChecked()

    //     userEvent.click(getByLabelText('Non'))
    //     expect(getByLabelText('Non')).toBeChecked()
    // })

    // test('should render and interact with chargingMethod radio buttons when isChargesAtHome is true', async () => {
    //     equipmentDetailsFormProps.housingEquipmentsDetails = housingEquipmentDetailsData

    //     const { getByLabelText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)

    //     // Interact with the isChargesAtHome radio button
    //     userEvent.click(getByLabelText('Oui'))

    //     // Check if the chargingMethod radio buttons are rendered
    //     await waitFor(() => {
    //         expect(getByLabelText(CHARGING_STATION_LABEL)).toBeInTheDocument()
    //         expect(getByLabelText(SOCKET_LABEL)).toBeInTheDocument()
    //     })

    //     // Interact with the chargingMethod radio buttons
    //     userEvent.click(getByLabelText(CHARGING_STATION_LABEL))
    //     expect(getByLabelText(CHARGING_STATION_LABEL)).toBeChecked()

    //     userEvent.click(getByLabelText(SOCKET_LABEL))
    //     expect(getByLabelText(SOCKET_LABEL)).toBeChecked()
    // })

    // test('should submit form with isChargesAtHome and chargingMethod fields', async () => {
    //     equipmentDetailsFormProps.housingEquipmentsDetails = housingEquipmentDetailsData
    //     const { getByLabelText, getByText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)
    //     const saveButton = getByText('Enregistrer')

    //     // Interact with fields
    //     userEvent.click(getByLabelText('Oui'))
    //     userEvent.click(getByLabelText(CHARGING_STATION_LABEL))
    //     userEvent.click(saveButton)

    //     await waitFor(() => {
    //         expect(mockAddHousingEquipment).toBeCalledWith([
    //             {
    //                 id: 1,
    //                 equipmentBrand: null,
    //                 equipmentModel: null,
    //                 equipmentId: 1,
    //                 yearOfPurchase: null,
    //                 extraData: {
    //                     isChargesAtHome: true,
    //                     chargingMethod: 'hasChargingStation',
    //                 },
    //             },
    //         ])
    //     })
    // })

    // // NEW TEST CASE TO ENSURE EXTRA_DATA IS NULL FOR NON-ELECTRIC_CAR
    // test('should submit form with extraData undefined for non-electric_car', async () => {
    //     equipmentDetailsFormProps.housingEquipmentsDetails = housingEquipmentDetailsData
    //     const { getByLabelText, getByText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)

    //     // Select the second equipment which is not an electric car
    //     userEvent.selectOptions(getByLabelText('Equipement 1'), '2')

    //     const saveButton = getByText('Enregistrer')
    //     userEvent.click(saveButton)

    //     await waitFor(() => {
    //         expect(mockAddHousingEquipment).toBeCalledWith([
    //             {
    //                 id: 2,
    //                 equipmentBrand: null,
    //                 equipmentModel: null,
    //                 equipmentId: 2,
    //                 yearOfPurchase: null,
    //                 extraData: undefined,
    //             },
    //         ])
    //     })
    // })
})
