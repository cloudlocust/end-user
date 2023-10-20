import { screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementProcessStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep'
import { MeasurementProcessStepProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep/MeasurementProcessStep'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'

// Mock StepSetterFunction
let mockStepSetter: jest.Mock<any, any>
let mockStartMeasurement: jest.Mock<any, any>
let mockGetTimeFromStatusLastUpdate: jest.Mock<any, any>
let MeasurementProcessStepPropsValues: MeasurementProcessStepProps

describe('MeasurementProcessStep Component', () => {
    beforeEach(() => {
        mockStepSetter = jest.fn()
        mockStartMeasurement = jest.fn()
        mockGetTimeFromStatusLastUpdate = jest.fn(() => 0)

        MeasurementProcessStepPropsValues = {
            measurementStatus: { status: measurementStatusEnum.PENDING },
            measurementResult: 24,
            measurementMaxDuration: 50,
            getTimeFromStatusLastUpdate: mockGetTimeFromStatusLastUpdate,
            startMeasurement: mockStartMeasurement,
            stepSetter: mockStepSetter,
        }
    })

    test('Renders correctly', () => {
        reduxedRender(<MeasurementProcessStep {...MeasurementProcessStepPropsValues} />)

        const header = screen.getByTestId('headerElement')
        expect(header).toBeInTheDocument()

        const progressCircle = screen.getByRole('progressbar')
        expect(progressCircle).toBeInTheDocument()

        const button = screen.getByText('Terminer')
        expect(button).toBeInTheDocument()

        // The button must be disabled initially
        expect(button).toBeDisabled()
    })
})
