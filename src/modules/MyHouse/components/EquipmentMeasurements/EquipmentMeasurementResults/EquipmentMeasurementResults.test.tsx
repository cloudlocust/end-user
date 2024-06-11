import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentMeasurementsResults } from 'src/modules/MyHouse/components/EquipmentMeasurements/EquipmentMeasurementResults'
import { EquipmentMeasurementResultsProps } from 'src/modules/MyHouse/components/EquipmentMeasurements/EquipmentMeasurementResults/EquipmentMeasurementResults'

const mockedMeasurementModes: ['mode1', 'mode2'] = ['mode1', 'mode2']
const mockedMeasurementResults = { mode1: 500, mode2: 1200 }
const mockedHousingEquipmentId = 81
const mockedEquipmentsNumber = 2
const mockedEquipmentNumber = 1
const mockedIsLoadingMeasurements = false
const mockedUpdateEquipmentMeasurementResults = jest.fn()

const props: EquipmentMeasurementResultsProps = {
    measurementModes: mockedMeasurementModes,
    measurementResults: mockedMeasurementResults,
    housingEquipmentId: mockedHousingEquipmentId,
    equipmentsNumber: mockedEquipmentsNumber,
    equipmentNumber: mockedEquipmentNumber,
    isLoadingMeasurements: mockedIsLoadingMeasurements,
    updateEquipmentMeasurementResults: mockedUpdateEquipmentMeasurementResults,
}

const tableContainerTestId = 'table-container'

describe('EquipmentMeasurementResultsList', () => {
    test('renders correctly with measurement modes', async () => {
        const { getByText, getByTestId } = reduxedRender(<EquipmentMeasurementsResults {...props} />)

        expect(
            getByText((content, _) => {
                return content.startsWith('Résultats des mesures')
            }),
        ).toBeInTheDocument()
        expect(getByTestId(tableContainerTestId)).toBeInTheDocument()
        mockedMeasurementModes.forEach((mode) => {
            expect(getByText(`Mode ${mode}`)).toBeInTheDocument()
            expect(getByText(`${mockedMeasurementResults[mode]} W`)).toBeInTheDocument()
        })
    })

    test('doesn nott display anything when there are no measurementModes', () => {
        const { container } = reduxedRender(<EquipmentMeasurementsResults {...props} measurementModes={[]} />)
        expect(container.firstChild).toBeNull()
    })
})
