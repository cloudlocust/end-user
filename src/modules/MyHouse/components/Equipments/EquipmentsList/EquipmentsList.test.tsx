import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_HOUSING_EQUIPMENTS } from 'src/mocks/handlers/equipments'
import { EquipmentsList } from 'src/modules/MyHouse/components/Equipments/EquipmentsList'
import { EquipmentsListProps } from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'

let equipmentsListProps: EquipmentsListProps = {
    housingEquipmentsList: [],
    loadingEquipmentInProgress: false,
    saveEquipment: jest.fn(),
}

describe('EquipmentsList tests', () => {
    afterEach(() => {
        equipmentsListProps.housingEquipmentsList = applyCamelCase(TEST_HOUSING_EQUIPMENTS)
        equipmentsListProps.loadingEquipmentInProgress = false
    })

    test('when loadingEquipmentInProgress is true', async () => {
        equipmentsListProps.loadingEquipmentInProgress = true

        const { getByRole } = reduxedRender(<EquipmentsList {...equipmentsListProps} />)

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    test('when loadingEquipmentInProgress is false, and equipmentsList has data, show only equipments which have > 0 number', async () => {
        const { getAllByTestId } = reduxedRender(<EquipmentsList {...equipmentsListProps} />)

        expect(getAllByTestId('equipment-item')).toHaveLength(1)
    })
})
