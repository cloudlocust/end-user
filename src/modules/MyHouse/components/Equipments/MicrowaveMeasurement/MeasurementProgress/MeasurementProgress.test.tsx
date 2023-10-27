import { screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementProgress } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import { MeasurementProgressProps } from './MeasurementProgress.d'

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
let mockGetTimeFromStatusLastUpdate: jest.Mock<any, any>
let MeasurementProgressPropsDefaultValues: MeasurementProgressProps

describe('MeasurementProgress', () => {
    beforeEach(() => {
        mockGetTimeFromStatusLastUpdate = jest.fn(() => 0)

        MeasurementProgressPropsDefaultValues = {
            status: null,
            maxDuration: 60,
            getTimeFromStatusLastUpdate: mockGetTimeFromStatusLastUpdate,
        }
    })

    test('Renders the message "En attente" when status is PENDING', () => {
        reduxedRender(
            <MeasurementProgress {...MeasurementProgressPropsDefaultValues} status={measurementStatusEnum.PENDING} />,
        )
        const message = screen.getByText('En attente')
        expect(message).toBeInTheDocument()
    })

    test('Renders the remaining time when status is IN_PROGRESS', () => {
        reduxedRender(
            <MeasurementProgress
                {...MeasurementProgressPropsDefaultValues}
                status={measurementStatusEnum.IN_PROGRESS}
            />,
        )
        const remainingTime = screen.getByText('00 : 30')
        expect(remainingTime).toBeInTheDocument()
    })

    test('Renders the success icon when status is success', () => {
        reduxedRender(
            <MeasurementProgress {...MeasurementProgressPropsDefaultValues} status={measurementStatusEnum.SUCCESS} />,
        )
        const successIcon = screen.getByTestId('CheckCircleIcon')
        expect(successIcon).toBeInTheDocument()
    })

    test('Renders the failed icon when status is FAILED', () => {
        reduxedRender(
            <MeasurementProgress {...MeasurementProgressPropsDefaultValues} status={measurementStatusEnum.FAILED} />,
        )
        const failedIcon = screen.getByTestId('CancelIcon')
        expect(failedIcon).toBeInTheDocument()
    })
})
