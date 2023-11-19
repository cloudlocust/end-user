import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import {
    EquipmentMeasurementResultsList,
    MeasurementResult,
} from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentMeasurementResultsList'

const mockedMeasurementModes = ['mode1', 'mode2']
const mockedHousingEquipmentId = 1
const mockedEquipmentNumber = 2
const tableContainerTestId = 'table-container'
const measurementResultTestId = 'measurement-result'

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
        expect(getAllByTestId(measurementResultTestId)).toHaveLength(mockedMeasurementModes.length)
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

const mockedHandleClickingOnMeasurementResult = jest.fn()

describe('MeasurementResult', () => {
    test('calling the handleClickingOnMeasurementResult function when clicking on a result value', async () => {
        const { getByRole } = reduxedRender(
            <MeasurementResult
                handleClickingOnMeasurementResult={mockedHandleClickingOnMeasurementResult}
                result={{ value: 120, isLoading: false }}
            />,
        )
        const resultButton = getByRole('button', { name: '120 W' })
        userEvent.click(resultButton)
        await waitFor(() => {
            expect(mockedHandleClickingOnMeasurementResult).toHaveBeenCalledTimes(1)
        })
    })
})
