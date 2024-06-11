import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementResult } from 'src/modules/MyHouse/components/EquipmentMeasurements/EquipmentMeasurementResults/MeasurementResult'

const mockedHandleClickingOnMeasurementResult = jest.fn()
const mockedHandleClickingOnMeasurementButton = jest.fn()

describe('MeasurementResult', () => {
    test('calling the handleClickingOnMeasurementResult function when clicking on a result value', async () => {
        const { getByText } = reduxedRender(
            <MeasurementResult
                handleClickingOnMeasurementResult={mockedHandleClickingOnMeasurementResult}
                handleClickingOnMeasurementButton={mockedHandleClickingOnMeasurementButton}
                result={120}
            />,
        )
        const resultButton = getByText('120 W')
        userEvent.click(resultButton)
        await waitFor(() => {
            expect(mockedHandleClickingOnMeasurementResult).toHaveBeenCalledTimes(1)
        })
    })

    test('display button "Mesurer" when the result value is null and call the handleClickingOnMeasurementButton function when clicking on it', async () => {
        const { getByRole } = reduxedRender(
            <MeasurementResult
                handleClickingOnMeasurementResult={mockedHandleClickingOnMeasurementResult}
                handleClickingOnMeasurementButton={mockedHandleClickingOnMeasurementButton}
                result={null}
            />,
        )
        expect(getByRole('button', { name: 'Mesurer' })).toBeInTheDocument()
    })

    test('show a loading progress circle when isLoading is true', async () => {
        const { getByRole } = reduxedRender(
            <MeasurementResult
                handleClickingOnMeasurementResult={mockedHandleClickingOnMeasurementResult}
                handleClickingOnMeasurementButton={mockedHandleClickingOnMeasurementButton}
                result={null}
                isLoading
            />,
        )
        expect(getByRole('progressbar')).toBeInTheDocument()
    })
})
