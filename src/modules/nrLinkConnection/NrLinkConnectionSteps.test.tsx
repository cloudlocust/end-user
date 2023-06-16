import { waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { NrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import userEvent from '@testing-library/user-event'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'

const BACK_BUTTON_TEXT = 'Précédent'
const NEXT_BUTTON_TEXT = 'Suivant'
const SKIP_LINK_TEXT = "Aller vers l'accueil"
const horizontalStepperClassName = '.MuiStep-horizontal'
const verticalStepperClassName = '.MuiStep-vertical'
const stepperContentClassName = '.StepperContent'
const stepContentClassName = '.MuiStepContent-root'
let mockManualContractFillingIsEnabled = true
const mockHistoryPush = jest.fn()

let mockUseMediaQuery = true
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))

// testing for mobile as default
jest.mock('@mui/material', () => ({
    ...jest.requireActual('@mui/material'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMediaQuery: () => mockUseMediaQuery,
}))

jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    ...jest.requireActual('src/modules/MyHouse/MyHouseConfig'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    get manualContractFillingIsEnabled() {
        return mockManualContractFillingIsEnabled
    },
}))

/* eslint-disable-next-line jsdoc/require-jsdoc */
const NrLinkConnectionStepsRouter = () => (
    <Router>
        <NrLinkConnectionSteps />
    </Router>
)
describe('Test NrLinkConnection Page', () => {
    const windowMatchMediaValue = {
        // INDICATES THE RESULT OF THE matchMedia("portrait")
        // true means it's portrait and thus Stepper vertical
        // false means it's landscape and thus Stepper horizontal
        matches: true,
        media: null,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }
    describe('mobileOrientation', () => {
        test('When Screen is portrait stepper is vertical, and content is inside the stepper and stepContent', async () => {
            // Mock MatchMedia of window
            // REFERENCE: https://stackoverflow.com/a/53449595/13145536
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation((query) => ({
                    // INDICATES THE RESULT OF THE matchMedia("portrait")
                    // false means it's landscape and thus Stepper horizontal
                    ...windowMatchMediaValue,
                    matches: false,
                    media: query,
                })),
            })
            const { getByText, container } = reduxedRender(<NrLinkConnectionStepsRouter />)
            expect(container.querySelector(horizontalStepperClassName)).toBeInTheDocument()
            expect(container.querySelector(stepContentClassName)).not.toBeInTheDocument()
            await waitFor(() => {
                expect(getByText(SKIP_LINK_TEXT)).toBeTruthy()
            })
            expect(getByText(SKIP_LINK_TEXT).closest('a')).toHaveAttribute('href', URL_CONSUMPTION)
        })
        test('When Screen is landscape stepper is vertical, and content is inside the stepper and stepContent, Skip_Link it should redirect to URL_CONSUMPTION', async () => {
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation((query) => ({
                    // INDICATES THE RESULT OF THE matchMedia("portrait")
                    // true means it's portrait and thus Stepper vertical
                    ...windowMatchMediaValue,
                    matches: true,
                    media: query,
                })),
            })
            const { getByText, container } = reduxedRender(<NrLinkConnectionStepsRouter />)

            expect(container.querySelector(verticalStepperClassName)).toBeInTheDocument()
            expect(container.querySelector(stepContentClassName)).toBeInTheDocument()
            await waitFor(() => {
                expect(getByText(SKIP_LINK_TEXT)).toBeTruthy()
            })
            expect(getByText(SKIP_LINK_TEXT).closest('a')).toHaveAttribute('href', URL_CONSUMPTION)
        })
    })
    describe('test stateChanges', () => {
        test('handleNext and handleBack changes the activeStep', async () => {
            mockUseMediaQuery = false
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation((mediaParam) => ({
                    // INDICATES THE RESULT OF THE matchMedia("portrait")
                    // true means it's portrait and thus Stepper vertical
                    ...windowMatchMediaValue,
                    media: mediaParam,
                })),
            })
            const { container, getByText } = reduxedRender(<NrLinkConnectionStepsRouter />)
            // When it's not mobile div StepperContent is shown
            expect(container.querySelector(stepperContentClassName)).toBeTruthy()
            // Click on next step (activeStep+1)
            expect(() => getByText(BACK_BUTTON_TEXT)).toThrow()
            userEvent.click(getByText(NEXT_BUTTON_TEXT))
            await waitFor(() => {
                expect(getByText(BACK_BUTTON_TEXT)).toBeTruthy()
            })
            // Click on previous step (activeStep-1)
            userEvent.click(getByText(BACK_BUTTON_TEXT))
            await waitFor(() => {
                expect(() => getByText(BACK_BUTTON_TEXT)).toThrow()
            })
        })
        test('handleScreenOrientation', async () => {
            let mockPortraitOrientation = true
            mockUseMediaQuery = true
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation((media) => ({
                    // INDICATES THE RESULT OF THE matchMedia("portrait")
                    ...windowMatchMediaValue,
                    matches: mockPortraitOrientation,
                    media: media,
                })),
            })

            const { container } = reduxedRender(<NrLinkConnectionStepsRouter />)

            // By default matchMedia returns true means it's portrait and thus Stepper vertical
            expect(container.querySelector(verticalStepperClassName)).toBeInTheDocument()
            expect(container.querySelector(stepContentClassName)).toBeInTheDocument()
            // Allow to update the innerWidth, to mock the resize event.
            // REFERENCE: https://stackoverflow.com/a/55955409/13145536
            mockPortraitOrientation = false
            window.dispatchEvent(new Event('resize'))
            await waitFor(
                () => {
                    // When resize event and matchMedia returns false means it's landscape thus Stepper horizontal
                    expect(container.querySelector(horizontalStepperClassName)).toBeInTheDocument()
                    expect(container.querySelector(stepContentClassName)).not.toBeInTheDocument()
                },
                { timeout: 5000 },
            )
            mockPortraitOrientation = true
            window.dispatchEvent(new Event('resize'))
            await waitFor(
                () => {
                    // When resize event and matchMedia returns true means it's landscape thus Stepper vertical
                    expect(container.querySelector(verticalStepperClassName)).toBeInTheDocument()
                    expect(container.querySelector(stepContentClassName)).toBeInTheDocument()
                },
                { timeout: 5000 },
            )
        }, 20000)
        test('When manual contract filling is disabled, contract step does not show.', async () => {
            mockManualContractFillingIsEnabled = false
            mockUseMediaQuery = false
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation((media) => ({
                    ...windowMatchMediaValue,
                    matches: false,
                    media: media,
                })),
            })
            const { queryByText } = reduxedRender(<NrLinkConnectionStepsRouter />)

            expect(queryByText("Je configure mon contrat de fourniture d'énergie")).not.toBeInTheDocument()

            mockManualContractFillingIsEnabled = true
        })
    })
})
