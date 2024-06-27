import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentDetailsFormProps } from 'src/modules/MyHouse/components/EquipmentsDetails/EquipmentsDetails.types'
import EquipmentDetailsForm from 'src/modules/MyHouse/components/EquipmentsDetails/EquipmentsDetailsForm'
import { IEquipmentMeter } from 'src/modules/MyHouse/components/Installation/InstallationType'

const CHARGING_STATION_LABEL = 'J’ai une borne de recharge'
const SOCKET_LABEL = 'Je branche sur une prise sans borne'
const SAVE_BUTTON_TEXT = 'Enregistrer'
const YES_TEXT = 'Oui'
const NO_TEXT = 'Non'

let housingEquipmentDetailsData: IEquipmentMeter[] = applyCamelCase([
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
    {
        equipment_id: 3,
        equipment_type: 'electricity',
        equipment_number: 3,
        equipment_label: null,
        equipment_brand: null,
        equipment_model: null,
        year_of_purchase: null,
        frequency_of_usage_per_week: null,
        average_usage_per_minute: null,
        id: 3,
        equipment: {
            id: 3,
            name: 'electric_car',
            allowed_type: ['electricity'],
            customer_id: null,
            measurement_duration: null,
            measurement_modes: null,
        },
    },
])

let mockAddHousingEquipment = jest.fn()

describe('EquipmentDetailsForm', () => {
    let equipmentDetailsFormProps: EquipmentDetailsFormProps = {
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
        expect(getByText(SAVE_BUTTON_TEXT)).toBeInTheDocument()
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
        const saveButton = getByText(SAVE_BUTTON_TEXT)

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

    describe('Electric Car Equipment', () => {
        test('should render and interact with isChargesAtHome radio buttons', () => {
            // Select the third equipment which is an electric car
            equipmentDetailsFormProps.housingEquipmentsDetails = [housingEquipmentDetailsData[2]]

            const { getByLabelText, getByText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)

            expect(getByText('Je charge ma voiture à mon domicile')).toBeInTheDocument()

            // Check if the radio buttons are rendered
            expect(getByLabelText(YES_TEXT)).toBeInTheDocument()
            expect(getByLabelText(NO_TEXT)).toBeInTheDocument()

            // Interact with the radio buttons
            userEvent.click(getByLabelText(YES_TEXT))
            expect(getByLabelText(YES_TEXT)).toBeChecked()

            userEvent.click(getByLabelText(NO_TEXT))
            expect(getByLabelText(NO_TEXT)).toBeChecked()
        })
        test('should render and interact with chargingMethod radio buttons when isChargesAtHome is true', async () => {
            // Select the third equipment which is an electric car
            equipmentDetailsFormProps.housingEquipmentsDetails = [housingEquipmentDetailsData[2]]

            const { getByLabelText, getByText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)

            // Interact with the isChargesAtHome radio button
            userEvent.click(getByLabelText(YES_TEXT))

            // Check if the chargingMethod radio buttons are rendered
            await waitFor(() => {
                expect(getByText('Méthode de chargement')).toBeInTheDocument()
                expect(getByLabelText(CHARGING_STATION_LABEL)).toBeInTheDocument()
                expect(getByLabelText(SOCKET_LABEL)).toBeInTheDocument()
            })

            // Interact with the chargingMethod radio buttons
            userEvent.click(getByLabelText(CHARGING_STATION_LABEL))
            expect(getByLabelText(CHARGING_STATION_LABEL)).toBeChecked()

            userEvent.click(getByLabelText(SOCKET_LABEL))
            expect(getByLabelText(SOCKET_LABEL)).toBeChecked()
        })
        test('should submit form with isChargesAtHome and chargingMethod fields', async () => {
            // Select the third equipment which is an electric car
            equipmentDetailsFormProps.housingEquipmentsDetails = [housingEquipmentDetailsData[2]]

            const { getByLabelText, getByText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)

            // Interact with fields
            userEvent.click(getByLabelText(YES_TEXT))
            userEvent.click(getByLabelText(CHARGING_STATION_LABEL))
            userEvent.click(getByText(SAVE_BUTTON_TEXT))

            await waitFor(() => {
                expect(mockAddHousingEquipment).toBeCalledTimes(1)

                expect(mockAddHousingEquipment).toBeCalledWith([
                    {
                        id: 3,
                        equipmentBrand: null,
                        equipmentModel: null,
                        equipmentId: 3,
                        yearOfPurchase: null,
                        extraData: {
                            isChargesAtHome: true,
                            chargingMethod: 'chargingStation',
                        },
                    },
                ])
            })
        })

        test('should submit form with extraData undefined when equipment is not electric_car', async () => {
            equipmentDetailsFormProps.housingEquipmentsDetails = housingEquipmentDetailsData
            const { getByText } = reduxedRender(<EquipmentDetailsForm {...equipmentDetailsFormProps} />)

            userEvent.click(getByText(SAVE_BUTTON_TEXT))

            await waitFor(() => {
                expect(mockAddHousingEquipment).toBeCalledWith([
                    {
                        id: 1,
                        equipmentBrand: null,
                        equipmentModel: null,
                        equipmentId: 1,
                        yearOfPurchase: null,
                        extraData: undefined,
                    },
                ])
            })
        })
    })
})
