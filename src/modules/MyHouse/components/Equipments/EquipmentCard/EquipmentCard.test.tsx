import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentCard } from 'src/modules/MyHouse/components/Equipments/EquipmentCard'
import { EquipmentCardProps } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'
import { URL_MY_HOUSE } from 'src/modules/MyHouse/MyHouseConfig'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

let mockIsEquipmentMeasurementFeatureState = true

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isEquipmentMeasurementFeatureState() {
        return mockIsEquipmentMeasurementFeatureState
    },
}))

// TODO: add a beforeEach hook to reset the props before each test.
describe('EquipmentCard tests', () => {
    let mockEquipmentCardProps: EquipmentCardProps = {
        equipment: {
            id: 1,
            housingEquipmentId: 81,
            name: 'tv',
            allowedType: ['electricity'],
            number: 5,
            isNumber: true,
            measurementModes: undefined,
            customerId: undefined,
        },
        label: 'Label',
        onEquipmentChange: jest.fn(),
    }

    const EQUIPMENT_CARD_TEST_ID = 'equipment-item'
    const MES_MESURES_TEXT = 'Mes mesures'

    test('if equipmentCard component is rendered', async () => {
        const { getByTestId } = reduxedRender(
            <Router>
                <EquipmentCard {...mockEquipmentCardProps} />
            </Router>,
        )
        expect(getByTestId(EQUIPMENT_CARD_TEST_ID)).toBeInTheDocument()
    })

    test('displays the correct label', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <EquipmentCard {...mockEquipmentCardProps} />
            </Router>,
        )
        expect(getByText(mockEquipmentCardProps.label!)).toBeInTheDocument()
    })

    test('display the correct number', async () => {
        const { getByText, queryByRole } = reduxedRender(
            <Router>
                <EquipmentCard {...mockEquipmentCardProps} />
            </Router>,
        )
        expect(getByText(mockEquipmentCardProps.equipment.number!)).toBeInTheDocument()
        expect(queryByRole('progressbar')).not.toBeInTheDocument()
    })

    test('display a progress circle when addingEquipmentInProgress is true', async () => {
        const { queryByText, getByRole } = reduxedRender(
            <Router>
                <EquipmentCard {...mockEquipmentCardProps} addingEquipmentInProgress />
            </Router>,
        )
        expect(getByRole('progressbar')).toBeInTheDocument()
        expect(queryByText(mockEquipmentCardProps.equipment.number!)).not.toBeInTheDocument()
    })

    test('increament call', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <EquipmentCard {...mockEquipmentCardProps} />
            </Router>,
        )
        const increamentButton = getByText('add_circle_outlined')
        expect(increamentButton).toBeInTheDocument()
        userEvent.click(increamentButton)

        expect(mockEquipmentCardProps.onEquipmentChange).toHaveBeenCalledWith([{ equipmentId: 1, equipmentNumber: 6 }])
    })

    test('decreament call', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <EquipmentCard {...mockEquipmentCardProps} />
            </Router>,
        )
        const increamentButton = getByText('remove_circle_outlined')
        expect(increamentButton).toBeInTheDocument()
        userEvent.click(increamentButton)

        expect(mockEquipmentCardProps.onEquipmentChange).toHaveBeenCalledWith([{ equipmentId: 1, equipmentNumber: 4 }])
    })

    test('measurement popup', async () => {
        mockEquipmentCardProps.equipment.name = 'microwave'
        reduxedRender(
            <Router>
                <EquipmentCard {...mockEquipmentCardProps} />
            </Router>,
        )
        userEvent.click(screen.getByText('Mesurer'))

        await waitFor(() => {
            expect(screen.getByRole('presentation')).toBeInTheDocument()
        })
    })

    test('measurement results', async () => {
        mockEquipmentCardProps.equipment.name = 'microwave'
        reduxedRender(
            <Router>
                <EquipmentCard {...mockEquipmentCardProps} />
            </Router>,
            {
                initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
            },
        )
        userEvent.click(screen.getByText(MES_MESURES_TEXT))

        await waitFor(() => {
            expect(window.location.pathname).toBe(`${URL_MY_HOUSE}/${LIST_OF_HOUSES[0].id}/equipments/measurements`)
        })
    })

    test('when isEquipmentMeasurementFeatureState is false, the buttons is disabled', async () => {
        mockIsEquipmentMeasurementFeatureState = false
        mockEquipmentCardProps.equipment.name = 'microwave'
        const { getByText } = reduxedRender(
            <Router>
                <EquipmentCard {...mockEquipmentCardProps} />
            </Router>,
        )
        const measurementButton = getByText('Mesurer')
        userEvent.click(measurementButton)
        expect(() => getByText("Mesure d'appareil")).toThrow()
        expect(getByText(MES_MESURES_TEXT).closest('button')).toBeDisabled()
        expect(getByText('Mesurer').closest('button')).toBeDisabled()
    })
})
