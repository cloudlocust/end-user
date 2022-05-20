import React from 'react'
import { waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ActionsNrLinkConnectionSteps, NrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import userEvent from '@testing-library/user-event'

const BACK_BUTTON_TEXT = 'Précédent'
const NEXT_BUTTON_TEXT = 'Suivant'
const FINISH_BUTTON_TEXT = 'Terminer'
const loadingButtonClassName = '.MuiCircularProgress-root '
const horizontalStepperClassName = '.MuiStep-horizontal'
const verticalStepperClassName = '.MuiStep-vertical'
const stepContentClassName = '.MuiStepContent-root'
const mockHistoryPush = jest.fn()

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
    useMediaQuery: () => true,
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
            const { container } = reduxedRender(<NrLinkConnectionSteps />)
            expect(container.querySelector(horizontalStepperClassName)).toBeInTheDocument()
            expect(container.querySelector(stepContentClassName)).not.toBeInTheDocument()
        })
        test('When Screen is landscape stepper is vertical, and content is inside the stepper and stepContent', async () => {
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation((query) => ({
                    // INDICATES THE RESULT OF THE matchMedia("portrait")
                    // true means it's portrait and thus Stepper horizontal
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
            const { container } = reduxedRender(<NrLinkConnectionSteps />)

            expect(container.querySelector(verticalStepperClassName)).toBeInTheDocument()
            expect(container.querySelector(stepContentClassName)).toBeInTheDocument()
        })
    })
    // test('When clicking on Skip nrLinkConnection Link, it should redirect to URL_CONSUMPTION', async () => {
    //     const { getByText } = reduxedRender(<NrLinkConnectionRouter />, {
    //         initialState: { userModel: { user: userData } },
    //     })
    //     await waitFor(() => {
    //         expect(getByText(SKIP_LINK_TEXT)).toBeTruthy()
    //     })
    //     expect(getByText(SKIP_LINK_TEXT).closest('a')).toHaveAttribute('href', URL_CONSUMPTION)
    // })

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
            const { container } = reduxedRender(<ActionsNrLinkConnectionSteps {...actionsNrLinkConnectionStepsProps} />)
            expect(container.querySelector(loadingButtonClassName)).toBeInTheDocument()
        })
    })
})
