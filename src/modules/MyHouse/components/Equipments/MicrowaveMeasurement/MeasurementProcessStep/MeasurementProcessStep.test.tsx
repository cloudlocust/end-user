import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { MeasurementProcessStep } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep'
import { MeasurementProcessStepProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep/MeasurementProcessStep'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'

const HEADER_TEXT_PENDING_OR_IN_PROGRESS = 'Mesure en cours ...'
const HEADER_TEXT_SUCCESS = 'Mesure effectuée avec succès'
const BUTTON_TEXT = 'Voir le résultat'

let mockStepSetter: jest.Mock<any, any>
let mockStartMeasurement: jest.Mock<any, any>
let mockRestartMeasurementFromBeginning: jest.Mock<any, any>
let mockGetTimeFromStatusLastUpdate: jest.Mock<any, any>
let MeasurementProcessStepPropsDefaultValues: MeasurementProcessStepProps

describe('MeasurementProcessStep Component', () => {
    beforeEach(() => {
        mockStepSetter = jest.fn()
        mockStartMeasurement = jest.fn()
        mockRestartMeasurementFromBeginning = jest.fn()
        mockGetTimeFromStatusLastUpdate = jest.fn(() => 0)

        MeasurementProcessStepPropsDefaultValues = {
            measurementStatus: null,
            measurementMaxDuration: 50,
            getTimeFromStatusLastUpdate: mockGetTimeFromStatusLastUpdate,
            startMeasurement: mockStartMeasurement,
            restartMeasurementFromBeginning: mockRestartMeasurementFromBeginning,
            stepSetter: mockStepSetter,
        }
    })

    test('When the measurement status is null (initially, before getting the status value from the backend)', () => {
        reduxedRender(<MeasurementProcessStep {...MeasurementProcessStepPropsDefaultValues} />)

        const headerText = screen.getByText(HEADER_TEXT_PENDING_OR_IN_PROGRESS)
        expect(headerText).toBeInTheDocument()

        const progressCircle = screen.getByRole('progressbar')
        expect(progressCircle).toBeInTheDocument()

        const buttonFinish = screen.getByText(BUTTON_TEXT)
        expect(buttonFinish).toBeInTheDocument()
        expect(buttonFinish).toBeDisabled()
    })

    test('When the measurement status is PENDING', () => {
        reduxedRender(
            <MeasurementProcessStep
                {...MeasurementProcessStepPropsDefaultValues}
                measurementStatus={{ status: measurementStatusEnum.PENDING }}
            />,
        )

        const headerText = screen.getByText(HEADER_TEXT_PENDING_OR_IN_PROGRESS)
        expect(headerText).toBeInTheDocument()

        const progressCircle = screen.getByRole('progressbar')
        expect(progressCircle).toBeInTheDocument()

        const loadingMessage = screen.getByText('En attente')
        expect(loadingMessage).toBeInTheDocument()

        const buttonFinish = screen.getByText(BUTTON_TEXT)
        expect(buttonFinish).toBeInTheDocument()
        expect(buttonFinish).toBeDisabled()
    })

    test('When the measurement status is IN_PROGRESS', () => {
        reduxedRender(
            <MeasurementProcessStep
                {...MeasurementProcessStepPropsDefaultValues}
                measurementStatus={{ status: measurementStatusEnum.IN_PROGRESS }}
            />,
        )

        const headerText = screen.getByText(HEADER_TEXT_PENDING_OR_IN_PROGRESS)
        expect(headerText).toBeInTheDocument()

        const progressCircle = screen.getByRole('progressbar')
        expect(progressCircle).toBeInTheDocument()

        // Checking the time counter (mm : ss)
        const timeCounter = screen.getByText(/^[0-9][0-9] : [0-5][0-9]$/)
        expect(timeCounter).toBeInTheDocument()

        const buttonFinish = screen.getByText(BUTTON_TEXT)
        expect(buttonFinish).toBeInTheDocument()
        expect(buttonFinish).toBeDisabled()
    })

    test('When the measurement status is SUCCESS', async () => {
        reduxedRender(
            <MeasurementProcessStep
                {...MeasurementProcessStepPropsDefaultValues}
                measurementStatus={{ status: measurementStatusEnum.SUCCESS }}
            />,
        )

        const headerText = screen.getByText(HEADER_TEXT_SUCCESS)
        expect(headerText).toBeInTheDocument()

        const progressCircle = screen.getByRole('progressbar')
        expect(progressCircle).toBeInTheDocument()

        const successMessage = screen.getByText('Félicitations !')
        expect(successMessage).toBeInTheDocument()

        const buttonFinish = screen.getByText(BUTTON_TEXT)
        expect(buttonFinish).toBeInTheDocument()
        expect(buttonFinish).toBeEnabled()

        // Calling stepSetter function on clicking on the button "Voir le résultat"
        userEvent.click(buttonFinish)
        await waitFor(() => {
            expect(mockStepSetter).toHaveBeenCalledWith(4)
        })
    })

    test('When the measurement status is FAILED', async () => {
        reduxedRender(
            <MeasurementProcessStep
                {...MeasurementProcessStepPropsDefaultValues}
                measurementStatus={{ status: measurementStatusEnum.FAILED, failureReason: 'Failur message test' }}
            />,
        )

        const progressCircle = screen.getByRole('progressbar')
        expect(progressCircle).toBeInTheDocument()

        const successMessage = screen.getByText('La mesure a échoué')
        expect(successMessage).toBeInTheDocument()

        const buttonRetest = screen.getByText('Recommencer la mesure')
        expect(buttonRetest).toBeInTheDocument()
        expect(buttonRetest).toBeEnabled()

        // Calling startMeasurement function on clicking on the button "Recommencer la mesure"
        userEvent.click(buttonRetest)
        await waitFor(() => {
            expect(mockStartMeasurement).toHaveBeenCalled()
        })
    })
})
