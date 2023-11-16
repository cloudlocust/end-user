import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentMeasurementResultsList } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList'

const mockedMeasurementModes = ['mode1', 'mode2']
const mockedHousingEquipmentId = 1
const mockedEquipmentNumber = 2
const tableContainerTestId = 'table-container'
const loadingButtonTestId = 'loading-button'

describe('EquipmentMeasurementResultsList', () => {
    test('renders correctly with measurement modes', async () => {
        const { getByText, getByTestId, getAllByTestId } = reduxedRender(
            <EquipmentMeasurementResultsList
                measurementModes={mockedMeasurementModes}
                housingEquipmentId={mockedHousingEquipmentId}
                equipmentNumber={mockedEquipmentNumber}
            />,
        )
        expect(
            getByText((content, _) => {
                return content.startsWith('Résultats des mesures')
            }),
        ).toBeInTheDocument()
        expect(getByTestId(tableContainerTestId)).toBeInTheDocument()
        mockedMeasurementModes.forEach((mode) => {
            expect(getByText(`Conso active mode ${mode} :`)).toBeInTheDocument()
        })
        expect(getAllByTestId(loadingButtonTestId)).toHaveLength(mockedMeasurementModes.length)
    })

    test('does not render without measurement modes', () => {
        const { container } = reduxedRender(
            <EquipmentMeasurementResultsList
                measurementModes={[]}
                housingEquipmentId={mockedHousingEquipmentId}
                equipmentNumber={mockedEquipmentNumber}
            />,
        )

        expect(container.firstChild).toBeNull()
    })
})
