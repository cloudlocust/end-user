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

describe('MeasurementProgress', () => {
    test('Renders the message "En attente" when status is pending', () => {
        reduxedRender(<MeasurementProgress status={measurementStatusEnum.pending} maxDuration={60} />)
        const message = screen.getByText('En attente')
        expect(message).toBeInTheDocument()
    })

    test('Renders the remaining time when status is inProgress', () => {
        reduxedRender(<MeasurementProgress status={measurementStatusEnum.inProgress} maxDuration={60} />)
        const remainingTime = screen.getByText('00 : 30')
        expect(remainingTime).toBeInTheDocument()
    })

    test('Renders the success icon when status is success', () => {
        reduxedRender(<MeasurementProgress status={measurementStatusEnum.success} maxDuration={60} />)
        const successIcon = screen.getByTestId('CheckCircleIcon')
        expect(successIcon).toBeInTheDocument()
    })

    test('Renders the failed icon when status is failed', () => {
        reduxedRender(<MeasurementProgress status={measurementStatusEnum.failed} maxDuration={60} />)
        const failedIcon = screen.getByTestId('CancelIcon')
        expect(failedIcon).toBeInTheDocument()
    })
})
