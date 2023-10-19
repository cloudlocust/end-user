import { screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementProcessStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep'
import { MeasurementProcessStepProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep/MeasurementProcessStep'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'

// Mock StepSetterFunction
let mockStepSetter: jest.Mock<any, any>
let mockSetMeasurementStatus: jest.Mock<any, any>
let MeasurementProcessStepPropsValues: MeasurementProcessStepProps

describe('MeasurementProcessStep Component', () => {
    beforeEach(() => {
        mockStepSetter = jest.fn()
        mockSetMeasurementStatus = jest.fn()

        MeasurementProcessStepPropsValues = {
            microwave: '',
            measurementMode: '',
            measurementStatus: measurementStatusEnum.pending,
            setMeasurementStatus: mockSetMeasurementStatus,
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

    // More tests will be added after creating the hook that manage the measurement requests.
})
