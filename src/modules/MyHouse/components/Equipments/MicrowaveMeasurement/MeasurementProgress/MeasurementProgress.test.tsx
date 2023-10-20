import { screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementProgress } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'

jest.mock(
    'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgressHook',
    () => ({
        /**
         * Mock for the useMeasurementProgress hook.
         *
         * @returns The remainingTime and circularProgressValue values.
         */
        useMeasurementProgress: () => ({
            remainingTime: 30,
            circularProgressValue: 50,
        }),
    }),
)

/**
 * Mock for the getTimeFromStatusLastUpdate function.
 */
const mockGetTimeFromStatusLastUpdate = jest.fn(() => 0)

describe('MeasurementProgress', () => {
    test('Renders the message "En attente" when status is PENDING', () => {
        reduxedRender(
            <MeasurementProgress
                status={measurementStatusEnum.PENDING}
                maxDuration={60}
                getTimeFromStatusLastUpdate={mockGetTimeFromStatusLastUpdate}
            />,
        )
        const message = screen.getByText('En attente')
        expect(message).toBeInTheDocument()
    })

    test('Renders the remaining time when status is IN_PROGRESS', () => {
        reduxedRender(
            <MeasurementProgress
                status={measurementStatusEnum.IN_PROGRESS}
                maxDuration={60}
                getTimeFromStatusLastUpdate={mockGetTimeFromStatusLastUpdate}
            />,
        )
        const remainingTime = screen.getByText('00 : 30')
        expect(remainingTime).toBeInTheDocument()
    })

    test('Renders the success icon when status is success', () => {
        reduxedRender(
            <MeasurementProgress
                status={measurementStatusEnum.SUCCESS}
                maxDuration={60}
                getTimeFromStatusLastUpdate={mockGetTimeFromStatusLastUpdate}
            />,
        )
        const successIcon = screen.getByTestId('CheckCircleIcon')
        expect(successIcon).toBeInTheDocument()
    })

    test('Renders the failed icon when status is FAILED', () => {
        reduxedRender(
            <MeasurementProgress
                status={measurementStatusEnum.FAILED}
                maxDuration={60}
                getTimeFromStatusLastUpdate={mockGetTimeFromStatusLastUpdate}
            />,
        )
        const failedIcon = screen.getByTestId('CancelIcon')
        expect(failedIcon).toBeInTheDocument()
    })
})
