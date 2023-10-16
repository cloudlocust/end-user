import { Theme } from '@mui/material'
import { screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import {
    ResponseMessage,
    MeasurementProcessStep,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep'

const TEST_TITLE = 'test title'
const TEST_CONTENT = 'test content'
const SUCCESS_COLOR = 'rgb(0, 255, 0)'
const ERROR_COLOR = 'rgb(255, 0, 0)'

const ResponseMessageProps = {
    theme: {
        palette: {
            success: { main: SUCCESS_COLOR },
            error: { main: ERROR_COLOR },
        },
    } as Theme,
    title: TEST_TITLE,
    content: TEST_CONTENT,
}

// Mock StepSetterFunction
const mockStepSetter = jest.fn()

const MeasurementProcessStepProps = {
    housingEquipmentId: 0,
    measurementMode: 'mode',
    microwaveNumber: 1,
    stepSetter: mockStepSetter,
}

describe('ResponseMessage Component', () => {
    test('Renders correctly', () => {
        reduxedRender(<ResponseMessage {...ResponseMessageProps} />)

        const titleElement = screen.getByText(TEST_TITLE)
        expect(titleElement).toBeInTheDocument()

        // Title must have the color error of MUI theme if the success property is false (not specified)
        const computedStyle = window.getComputedStyle(titleElement)
        expect(computedStyle.color).toBe(ERROR_COLOR)

        const contentElement = screen.getByText(TEST_CONTENT)
        expect(contentElement).toBeInTheDocument()
    })

    test('Title color is the success color of MUI theme when the success property is true', () => {
        reduxedRender(<ResponseMessage {...ResponseMessageProps} success />)

        const titleElement = screen.getByText(TEST_TITLE)
        const computedStyle = window.getComputedStyle(titleElement)
        expect(computedStyle.color).toBe(SUCCESS_COLOR)
    })
})

describe('MeasurementProcessStep Component', () => {
    test('Renders correctly', () => {
        reduxedRender(<MeasurementProcessStep {...MeasurementProcessStepProps} />)

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
