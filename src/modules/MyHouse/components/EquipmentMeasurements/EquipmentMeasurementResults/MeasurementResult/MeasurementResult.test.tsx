import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementResult } from 'src/modules/MyHouse/components/EquipmentMeasurements/EquipmentMeasurementResults/MeasurementResult'

const mockedHandleClickingOnMeasurementResult = jest.fn()

describe('MeasurementResult', () => {
    test('calling the handleClickingOnMeasurementResult function when clicking on a result value', async () => {
        const { getByText } = reduxedRender(
            <MeasurementResult
                handleClickingOnMeasurementResult={mockedHandleClickingOnMeasurementResult}
                result={120}
            />,
        )
        const resultButton = getByText('120 W')
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
