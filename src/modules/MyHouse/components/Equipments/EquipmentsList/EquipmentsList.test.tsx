import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentsList } from 'src/modules/MyHouse/components/Equipments/EquipmentsList'
import {
    EquipmentsListProps,
    HousingEquipmentListType,
} from 'src/modules/MyHouse/components/Equipments/EquipmentsList/equipmentsList'

const mockHousingEquipmentsList: HousingEquipmentListType = [
    {
        id: 1,
        equipmentLabel: 'equipment 1 label',
        name: 'equipment 1 name',
        allowedType: ['electricity', 'other'],
        isNumber: true,
    },
    {
        id: 2,
        equipmentLabel: 'equipment 2 label',
        name: 'equipment 2 name',
        allowedType: ['other'],
        isNumber: true,
    },
    {
        id: 3,
        equipmentLabel: 'equipment 3 label',
        name: 'equipment 3 name',
        allowedType: ['electricity'],
        isNumber: true,
    },
]

let equipmentsListProps: EquipmentsListProps = {
    housingEquipmentsList: mockHousingEquipmentsList,
    addingInProgressEquipmentsIds: [],
    addHousingEquipment: jest.fn(),
    onOpenAddEquipmentPopup: jest.fn(),
}

describe('EquipmentsList tests', () => {
    test("renders correctly when housingEquipmentsList isn't empty", () => {
        const { getByText } = reduxedRender(<EquipmentsList {...equipmentsListProps} />)

        expect(getByText('Ajouter un équipement')).toBeInTheDocument()
        mockHousingEquipmentsList.forEach((housingEquipment) => {
            expect(getByText(housingEquipment.name!)).toBeInTheDocument()
        })
    })

    test('when addingInProgressEquipmentsIds is not empty, renders progress circles', async () => {
        equipmentsListProps.addingInProgressEquipmentsIds = [1, 3]
        const { getAllByRole } = reduxedRender(<EquipmentsList {...equipmentsListProps} />)

        expect(getAllByRole('progressbar')).toHaveLength(2)

        equipmentsListProps.addingInProgressEquipmentsIds = []
    })

    test('when click on add equipement, openAddEquipmentPopup callback should be called', async () => {
        const { getByText } = reduxedRender(<EquipmentsList {...equipmentsListProps} />)

        getByText('Ajouter un équipement').click()

        expect(equipmentsListProps.onOpenAddEquipmentPopup).toBeCalled()
    })
})
