import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentCard } from 'src/modules/MyHouse/components/Equipments/EquipmentCard'
import { EquipmentCardProps } from 'src/modules/MyHouse/components/Equipments/EquipmentCard/equipmentsCard'

describe('EquipmentCard tests', () => {
    let mockEquipmentCardProps: EquipmentCardProps = {
        id: 1,
        name: 'tv',
        number: 5,
        onEquipmentChange: jest.fn(),
        label: 'Label',
    }

    const EQUIPMENT_CARD_TEST_ID = 'equipment-item'

    test('if equipmentCard component is rendered', async () => {
        const { getByTestId } = reduxedRender(<EquipmentCard {...mockEquipmentCardProps} />)
        expect(getByTestId(EQUIPMENT_CARD_TEST_ID)).toBeInTheDocument()
    })

    test('displays the correct label', async () => {
        const { getByText } = reduxedRender(<EquipmentCard {...mockEquipmentCardProps} />)
        expect(getByText(mockEquipmentCardProps.label!)).toBeInTheDocument()
    })

    test('display the correct number', async () => {
        const { getByText } = reduxedRender(<EquipmentCard {...mockEquipmentCardProps} />)
        expect(getByText(mockEquipmentCardProps.number)).toBeInTheDocument()
    })
    test('increament call', async () => {
        const { getByText } = reduxedRender(<EquipmentCard {...mockEquipmentCardProps} />)
        const increamentButton = getByText('add_circle_outlined')
        expect(increamentButton).toBeInTheDocument()
        userEvent.click(increamentButton)

        expect(mockEquipmentCardProps.onEquipmentChange).toHaveBeenCalledWith([{ equipmentId: 1, equipmentNumber: 6 }])
        expect(getByText('6')).toBeInTheDocument()
    })
    test('decreament call', async () => {
        const { getByText } = reduxedRender(<EquipmentCard {...mockEquipmentCardProps} />)
        const increamentButton = getByText('remove_circle_outlined')
        expect(increamentButton).toBeInTheDocument()
        userEvent.click(increamentButton)

        expect(mockEquipmentCardProps.onEquipmentChange).toHaveBeenCalledWith([{ equipmentId: 1, equipmentNumber: 4 }])
        expect(getByText('4')).toBeInTheDocument()
    })
    test('measurement popyp', async () => {
        mockEquipmentCardProps.name = 'microwave'
        const { getByText } = reduxedRender(<EquipmentCard {...mockEquipmentCardProps} />)
        userEvent.click(getByText('Mesurer'))

        expect(getByText("Mesure d'appareil")).toBeInTheDocument()
    })
})
