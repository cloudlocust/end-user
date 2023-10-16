import { screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementProcessStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep'
import { MeasurementProcessStepProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep/MeasurementProcessStep'

// Mock StepSetterFunction
let mockStepSetter: jest.Mock<any, any>
let MeasurementProcessStepPropsValues: MeasurementProcessStepProps

describe('MeasurementProcessStep Component', () => {
    beforeEach(() => {
        mockStepSetter = jest.fn()
        MeasurementProcessStepPropsValues = {
            housingEquipmentId: 0,
            measurementMode: 'mode',
            microwaveNumber: 1,
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
