import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import {
    EquipmentMeasurementResultsList,
    MeasurementResult,
} from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList'
import { EquipmentMeasurementResultsListProps } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList/EquipmentMeasurementResultsList'

const mockedMeasurementModes: ['mode1', 'mode2'] = ['mode1', 'mode2']
const mockedMeasurementResults = { mode1: 500, mode2: 1200 }
const mockedHousingEquipmentId = 81
const mockedEquipmentsNumber = 2
const mockedEquipmentNumber = 1
const mockedIsLoadingMeasurements = false
const mockedUpdateEquipmentMeasurementResults = jest.fn()

const props: EquipmentMeasurementResultsListProps = {
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
        const { getByText, getByTestId } = reduxedRender(<EquipmentMeasurementResultsList {...props} />)

        expect(
            getByText((content, _) => {
                return content.startsWith('Résultats des mesures')
            }),
        ).toBeInTheDocument()
        expect(getByTestId(tableContainerTestId)).toBeInTheDocument()
        mockedMeasurementModes.forEach((mode) => {
            expect(getByText(`Conso active mode ${mode} :`)).toBeInTheDocument()
            expect(getByText(`${mockedMeasurementResults[mode]} W`)).toBeInTheDocument()
        })
    })

    test('does not render without measurement modes', () => {
        const { container } = reduxedRender(<EquipmentMeasurementResultsList {...props} measurementModes={[]} />)
        expect(container.firstChild).toBeNull()
    })
})

const mockedHandleClickingOnMeasurementResult = jest.fn()

describe('MeasurementResult', () => {
    test('calling the handleClickingOnMeasurementResult function when clicking on a result value', async () => {
        const { getByRole } = reduxedRender(
            <MeasurementResult
                handleClickingOnMeasurementResult={mockedHandleClickingOnMeasurementResult}
                result={120}
            />,
        )
        const resultButton = getByRole('button', { name: '120 W' })
        userEvent.click(resultButton)
        await waitFor(() => {
            expect(mockedHandleClickingOnMeasurementResult).toHaveBeenCalledTimes(1)
        })
    })

    test('display ? when the result value is null', async () => {
        const { getByText } = reduxedRender(
            <MeasurementResult
                handleClickingOnMeasurementResult={mockedHandleClickingOnMeasurementResult}
                result={null}
            />,
        )
        expect(getByText('?')).toBeInTheDocument()
    })

    test('show a loading progress circle when isLoading is true', async () => {
        const { getByRole } = reduxedRender(
            <MeasurementResult
                handleClickingOnMeasurementResult={mockedHandleClickingOnMeasurementResult}
                result={null}
                isLoading
            />,
        )
        expect(getByRole('progressbar')).toBeInTheDocument()
    })
})
