import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ActionsNrLinkConnectionSteps } from 'src/modules/nrLinkConnection'
import { ActionsNrLinkConnectionStepsProps } from 'src/modules/nrLinkConnection/components/ActionsNrLinkConnectionSteps/ActionsNrLinkConnectionSteps'

const BACK_BUTTON_TEXT = 'Précédent'
const NEXT_BUTTON_TEXT = 'Suivant'
const DONE_BUTTON_TEXT = 'Terminer'
const loadingButtonClassName = '.MuiCircularProgress-root '

const actionsNrLinkConnectionStepsProps: ActionsNrLinkConnectionStepsProps = {
    handleNext: jest.fn(),
    handleBack: jest.fn(),
    activeStep: 0,
}

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

    test('When activeStep is in the middle steps, Précédent & Suivant buttons should be shown, and when clicking on them, their callbacks should be called', async () => {
        const handleNext = jest.fn()
        const handleBack = jest.fn()
        actionsNrLinkConnectionStepsProps.handleNext = handleNext
        actionsNrLinkConnectionStepsProps.activeStep = 2
        actionsNrLinkConnectionStepsProps.handleBack = handleBack
        const { getByText } = reduxedRender(<ActionsNrLinkConnectionSteps {...actionsNrLinkConnectionStepsProps} />)

        expect(getByText(NEXT_BUTTON_TEXT)).toBeTruthy()
        expect(getByText(BACK_BUTTON_TEXT)).toBeTruthy()
        userEvent.click(getByText(BACK_BUTTON_TEXT))
        userEvent.click(getByText(NEXT_BUTTON_TEXT))

        await waitFor(() => {
            expect(handleBack).toHaveBeenCalled()
        })
        expect(handleNext).toHaveBeenCalled()
    })
    test("when activeStep is the last step, Aller vers l'accueil message isn't shown, Terminer button should be shown", async () => {
        const handleNext = jest.fn()
        actionsNrLinkConnectionStepsProps.handleNext = handleNext
        actionsNrLinkConnectionStepsProps.activeStep = 3
        const { getByText } = reduxedRender(<ActionsNrLinkConnectionSteps {...actionsNrLinkConnectionStepsProps} />)

        expect(() => getByText("Aller vers l'accueil")).toThrow()

        expect(getByText(DONE_BUTTON_TEXT)).toBeTruthy()
        userEvent.click(getByText(DONE_BUTTON_TEXT))
        expect(handleNext).not.toHaveBeenCalled()
    })
    test('When inProgress props, spinner should be shown', async () => {
        actionsNrLinkConnectionStepsProps.inProgress = true
        const { container } = reduxedRender(<ActionsNrLinkConnectionSteps {...actionsNrLinkConnectionStepsProps} />)
        expect(container.querySelector(loadingButtonClassName)).toBeInTheDocument()

        actionsNrLinkConnectionStepsProps.inProgress = false
    })
})
