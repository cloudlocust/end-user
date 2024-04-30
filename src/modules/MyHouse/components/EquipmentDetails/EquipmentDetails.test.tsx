import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import EquipmentDetails from 'src/modules/MyHouse/components/EquipmentDetails'

let mockLocationState = {
    equipment: {
        id: 1,
        housingEquipmentId: 1,
        name: 'oven',
        allowedType: ['electricity'],
        equipmentBrand: 'test brand',
        equipmentModel: 'test model',
        yearOfPurchase: '2024',
    },
}

let mockAddHousingEquipment = jest.fn()
let mockHistoryGoBack = jest.fn()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useLocation: () => ({
        state: {
            ...mockLocationState,
        },
    }),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        listen: jest.fn(),
        goBack: mockHistoryGoBack,
    }),
}))

/**
 * Mock the useEquipment hook.
 */
jest.mock('src/modules/MyHouse/components/Installation/installationHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/Installation/installationHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useEquipmentList: () => ({
        addHousingEquipment: mockAddHousingEquipment,
    }),
}))

describe('EquipmentDetails tests', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('when form is submitted', async () => {
        const { getByLabelText, getByText, getByRole } = reduxedRender(<EquipmentDetails />)

        expect(getByText('Informations relatives à mon équipement')).toBeInTheDocument()

        const equipmentBrand = getByLabelText('Marque')
        const equipmentModel = getByLabelText('Modèle')
        const yearOfPurchase = getByLabelText("Année d'achat")

        // Fill the form fields
        userEvent.type(equipmentBrand, 'Brand')
        userEvent.type(equipmentModel, 'Model')
        userEvent.type(yearOfPurchase, '2022/03/29')
        const chosenDate = getByRole('button', { name: '2024' })
        userEvent.click(chosenDate)
        userEvent.click(getByRole('button', { name: 'OK' }))

        // Submit the form
        userEvent.click(getByText('Enregistrer'))

        await waitFor(() => {
            expect(mockAddHousingEquipment).toBeCalled()
        })
    })
    test('when form has default values', async () => {
        const { getByDisplayValue } = reduxedRender(<EquipmentDetails />)

        expect(getByDisplayValue('test brand')).toBeInTheDocument()
        expect(getByDisplayValue('test model')).toBeInTheDocument()
        expect(getByDisplayValue('2024')).toBeInTheDocument()
    })
    test('when clicked on go back button', async () => {
        const { getByTestId } = reduxedRender(<EquipmentDetails />)

        userEvent.click(getByTestId('ArrowBackIosNewIcon'))

        await waitFor(() => {
            expect(mockHistoryGoBack).toBeCalled()
        })
    })
})
