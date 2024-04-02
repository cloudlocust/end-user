import { waitFor, within, screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { applyCamelCase, Form } from 'src/common/react-platform-components'
import { TEST_EQUIPMENTS, TEST_HOUSING_EQUIPMENTS } from 'src/mocks/handlers/equipments'
import { IEquipmentMeter, equipmentType } from 'src/modules/MyHouse/components/Installation/InstallationType'
import AddLabelButtonForm from 'src/modules/MyConsumption/components/LabelizationContainer/AddLabelButtonForm'
import { AddLabelButtonFormProps } from 'src/modules/MyConsumption/components/LabelizationContainer/AddLabelButtonForm/AddLabelButtonForm'
import userEvent from '@testing-library/user-event'

/**
 * Mocking the useEquipmentList hook.
 */
const CAMEL_CASED_TEST_EQUIPMENTS = applyCamelCase(TEST_EQUIPMENTS)
let mockEquipmentsList: equipmentType[] = CAMEL_CASED_TEST_EQUIPMENTS
const CAMEL_CASED_TEST_HOUSING_EQUIPMENTS = applyCamelCase(TEST_HOUSING_EQUIPMENTS)
let mockHousingEquipmentsList: IEquipmentMeter[] = CAMEL_CASED_TEST_HOUSING_EQUIPMENTS
let mockAddHousingEquipment = jest.fn()
let mockAddEquipment = jest.fn()
let mockLoadingEquipmentInProgress = false
let mockIsAddEquipmentLoading = false

jest.mock('src/modules/MyHouse/components/Installation/installationHook', () => ({
    ...jest.requireActual('src/modules/MyHouse/components/Installation/installationHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useEquipmentList: () => ({
        equipmentsList: mockEquipmentsList,
        housingEquipmentsList: mockHousingEquipmentsList,
        addHousingEquipment: mockAddHousingEquipment,
        loadingEquipmentInProgress: mockLoadingEquipmentInProgress,
        addEquipment: mockAddEquipment,
        isAddEquipmentLoading: mockIsAddEquipmentLoading,
    }),
}))

let mockEchartsInstanceDispatchAction = jest.fn()
let mockSetInputPeriodTime = jest.fn()
let mockIsAddingLabelInProgress = false

let mockAddLabelButtonFormProps: AddLabelButtonFormProps = {
    chartRef: {
        current: {
            // eslint-disable-next-line jsdoc/require-jsdoc
            getEchartsInstance: () => ({ dispatchAction: mockEchartsInstanceDispatchAction }),
        },
    },
    inputPeriodTime: {
        startTime: undefined,
        endTime: undefined,
    },
    setInputPeriodTime: mockSetInputPeriodTime,
    isAddingLabelInProgress: mockIsAddingLabelInProgress,
    range: {
        from: '',
        to: '',
    },
    chartData: [],
}

const housingEquipmentSelectTestId = 'housing-equipment-select'
const housingEquipmentOptionTestId = 'housing-equipment-option'
const useTypeLabel = "Type d'usage"
const startTimeLabel = 'De'
const endTimeLabel = 'À'

describe('AddLabelButtonForm', () => {
    test('render correctly', () => {
        const { getByRole } = reduxedRender(
            <Form onSubmit={() => {}}>
                <AddLabelButtonForm {...mockAddLabelButtonFormProps} />
            </Form>,
        )

        expect(screen.getByLabelText('Equipement *')).toBeInTheDocument()
        expect(getByRole('textbox', { name: useTypeLabel })).toBeInTheDocument()
        expect(getByRole('textbox', { name: startTimeLabel })).toBeInTheDocument()
        expect(getByRole('textbox', { name: endTimeLabel })).toBeInTheDocument()
        expect(getByRole('button', { name: 'Ajouter' })).toBeInTheDocument()
        expect(getByRole('button', { name: 'Annuler' })).toBeInTheDocument()
    })

    test('show popup when clicking on button to add a housingEquipment', async () => {
        const { getByTestId } = reduxedRender(
            <Form onSubmit={() => {}}>
                <AddLabelButtonForm {...mockAddLabelButtonFormProps} />
            </Form>,
        )

        const selectElement = getByTestId(housingEquipmentSelectTestId)
        const selectButton = within(selectElement).getByRole('button')
        userEvent.click(selectButton)
        await waitFor(async () => {
            const options = screen.getAllByTestId(housingEquipmentOptionTestId)
            expect(options).toHaveLength(TEST_HOUSING_EQUIPMENTS.length - 4)
            const addEquipmentButton = screen.getByRole('button', { name: 'Ajouter un équipement' })
            expect(addEquipmentButton).toBeInTheDocument()
            userEvent.click(addEquipmentButton)
            await waitFor(() => {
                // Assert that the add equipment popup is opened
                expect(screen.getByText('Nouvel Equipement')).toBeInTheDocument()
            })
        })
    })
})
