import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentMeasurementResults } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResults'

const mockedMeasurementModes = ['mode1', 'mode2']
const mockedHousingEquipmentId = 1
const mockedEquipmentNumber = 2
const tableContainerTestId = 'table-container'
const loadingButtonTestId = 'measurement-result'

describe('EquipmentMeasurementResults', () => {
    test('renders correctly with measurement modes', async () => {
        const { getByText, getByTestId, getAllByTestId } = reduxedRender(
            <EquipmentMeasurementResults
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

    test('when there is no measurement modes, it would not show anything', () => {
        const { container } = reduxedRender(
            <EquipmentMeasurementResults
                measurementModes={[]}
                housingEquipmentId={mockedHousingEquipmentId}
                equipmentNumber={mockedEquipmentNumber}
            />,
        )
        expect(container.firstChild).toBeNull()
    })
})
