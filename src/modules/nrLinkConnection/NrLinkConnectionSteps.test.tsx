import React from 'react'
import { waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ActionsNrLinkConnectionSteps, NrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import userEvent from '@testing-library/user-event'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'

const BACK_BUTTON_TEXT = 'Précédent'
const NEXT_BUTTON_TEXT = 'Suivant'
const SKIP_LINK_TEXT = "Aller vers l'acceuil"
const FINISH_BUTTON_TEXT = 'Terminer'
const loadingButtonClassName = '.MuiCircularProgress-root '
const horizontalStepperClassName = '.MuiStep-horizontal'
const verticalStepperClassName = '.MuiStep-vertical'
const skipLinkBaseClassName = '.flex.justify-between.items-center.mt-24'
const skipLinkPortraitClassName = `${skipLinkBaseClassName}.text-right.flex-row-reverse`
const skipLinkLandscapeClassName = `${skipLinkBaseClassName}.text-center`
const actionsClassName = 'MuiBox-root'
const stepContentClassName = '.MuiStepContent-root'
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

// eslint-disable-next-line jsdoc/require-jsdoc
const actionsNrLinkConnectionStepsProps: {
    // eslint-disable-next-line jsdoc/require-jsdoc
    activeStep: number
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleBack: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    handleNext: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    inProgress?: boolean
} = {
    handleNext: jest.fn(),
    handleBack: jest.fn(),
    activeStep: 0,
}

/* eslint-disable-next-line jsdoc/require-jsdoc */
const NrLinkConnectionStepsRouter = () => (
    <Router>
        <NrLinkConnectionSteps />
    </Router>
)
describe('Test NrLinkConnection Page', () => {
    describe('mobileOrientation', () => {
        test('When Screen is portrait stepper is vertical, and content is inside the stepper and stepContent', async () => {
            // Mock MatchMedia of window
            // REFERENCE: https://stackoverflow.com/a/53449595/13145536
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation((query) => ({
                    // INDICATES THE RESULT OF THE matchMedia("portrait")
                    // false means it's landscape and thus Stepper horizontal
                    matches: false,
                    media: query,
                    onchange: null,
                    addListener: jest.fn(), // Deprecated
                    removeListener: jest.fn(), // Deprecated
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn(),
                })),
            })
            const { getByText, container } = reduxedRender(<NrLinkConnectionStepsRouter />)
            expect(container.querySelector(horizontalStepperClassName)).toBeInTheDocument()
            expect(container.querySelector(stepContentClassName)).not.toBeInTheDocument()
            await waitFor(() => {
                expect(getByText(SKIP_LINK_TEXT)).toBeTruthy()
            })
            expect(getByText(SKIP_LINK_TEXT).closest('a')).toHaveAttribute('href', URL_CONSUMPTION)
            expect(container.querySelector(skipLinkPortraitClassName)).not.toBeInTheDocument()
            expect(container.querySelector(skipLinkLandscapeClassName)).toBeInTheDocument()
        })
        test('When Screen is landscape stepper is vertical, and content is inside the stepper and stepContent, Skip_Link align center, it should redirect to URL_CONSUMPTION', async () => {
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation((query) => ({
                    // INDICATES THE RESULT OF THE matchMedia("portrait")
                    // true means it's portrait and thus Stepper vertical
                    matches: true,
                    media: query,
                    onchange: null,
                    addListener: jest.fn(), // Deprecated
                    removeListener: jest.fn(), // Deprecated
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn(),
                })),
            })
            const { getByText, container } = reduxedRender(<NrLinkConnectionStepsRouter />)

            expect(container.querySelector(verticalStepperClassName)).toBeInTheDocument()
            expect(container.querySelector(stepContentClassName)).toBeInTheDocument()
            await waitFor(() => {
                expect(getByText(SKIP_LINK_TEXT)).toBeTruthy()
            })
            expect(getByText(SKIP_LINK_TEXT).closest('a')).toHaveAttribute('href', URL_CONSUMPTION)
            expect(container.querySelector(skipLinkPortraitClassName)).toBeInTheDocument()
            expect(container.querySelector(skipLinkLandscapeClassName)).not.toBeInTheDocument()
        })
    })
    describe('test stateChanges', () => {
        test('handleNext and handleBack changes the activeStep', async () => {
            let mockPortraitOrientation = true
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation((mediaParam) => ({
                    // INDICATES THE RESULT OF THE matchMedia("portrait")
                    // true means it's portrait and thus Stepper vertical
                    matches: mockPortraitOrientation,
                    media: mediaParam,
                    onchange: null,
                    addListener: jest.fn(), // Deprecated
                    removeListener: jest.fn(), // Deprecated
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn(),
                })),
            })

            const { getByText } = reduxedRender(<NrLinkConnectionStepsRouter />)
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
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation((media) => ({
                    // INDICATES THE RESULT OF THE matchMedia("portrait")
                    matches: mockPortraitOrientation,
                    media: media,
                    onchange: null,
                    addListener: jest.fn(), // Deprecated
                    removeListener: jest.fn(), // Deprecated
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn(),
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
    })

    describe('test ActionsNrLinkConnectionSteps', () => {
        test('When activeStep equals first index, Back boutton should be hidden, and when clicking on next handleNext should be called', async () => {
            const handleNext = jest.fn()
            actionsNrLinkConnectionStepsProps.handleNext = handleNext
            const { getByText } = reduxedRender(<ActionsNrLinkConnectionSteps {...actionsNrLinkConnectionStepsProps} />)

            expect(() => getByText(BACK_BUTTON_TEXT)).toThrow()
            expect(getByText(NEXT_BUTTON_TEXT)).toBeTruthy()
            userEvent.click(getByText(NEXT_BUTTON_TEXT))

            await waitFor(() => {
                expect(handleNext).toHaveBeenCalled()
            })
        })
        test('When activeStep equals last index, Finish boutton should be hidden, and when clicking on previous handleBack should be called, and when clicking on finish nothing is called', async () => {
            const handleNext = jest.fn()
            const handleBack = jest.fn()
            actionsNrLinkConnectionStepsProps.handleNext = handleNext
            actionsNrLinkConnectionStepsProps.activeStep = 2
            actionsNrLinkConnectionStepsProps.handleBack = handleBack
            const { getByText } = reduxedRender(<ActionsNrLinkConnectionSteps {...actionsNrLinkConnectionStepsProps} />)

            expect(() => getByText(NEXT_BUTTON_TEXT)).toThrow()
            expect(getByText(BACK_BUTTON_TEXT)).toBeTruthy()
            expect(getByText(FINISH_BUTTON_TEXT)).toBeTruthy()
            userEvent.click(getByText(FINISH_BUTTON_TEXT))
            userEvent.click(getByText(BACK_BUTTON_TEXT))

            await waitFor(() => {
                expect(handleBack).toHaveBeenCalled()
            })
            expect(handleNext).not.toHaveBeenCalled()
        })

        test('When inProgress props, spinner should be shown', async () => {
            actionsNrLinkConnectionStepsProps.inProgress = true
            // When it's not mobile ActionButton have different styling
            mockUseMediaQuery = false
            const { container } = reduxedRender(<ActionsNrLinkConnectionSteps {...actionsNrLinkConnectionStepsProps} />)
            expect(container.querySelector(loadingButtonClassName)).toBeInTheDocument()
            expect(container.querySelector(actionsClassName)?.classList.contains('landscape:flex')).toBeFalsy()
        })
    })
})
