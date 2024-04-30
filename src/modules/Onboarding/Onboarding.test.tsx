import { reduxedRender } from 'src/common/react-platform-components/test'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { URL_DASHBOARD } from 'src/modules/Dashboard/DashboardConfig'
import { Onboarding, STEPS_NAMES } from 'src/modules/Onboarding'

/**
 * StepComponent Props.
 */
type StepComponentProps =
    /**
     * StepComponentProps.
     */
    {
        /**
         *  TestId.
         */
        testId: string
        /**
         * Handle the next click.
         *
         * @returns Void.
         */
        onNext: () => void
    }

/**
 * StepComponent common component between the steps.
 *
 * @param root0 Props.
 * @param root0.testId The data-testid.
 * @param root0.onNext To handle the next click.
 * @returns StepComponent.
 */
const StepComponent = ({ testId, onNext }: StepComponentProps) => {
    return (
        <div data-testid={testId}>
            <button onClick={onNext}>Suivant</button>
        </div>
    )
}

/**
 * Common props of steps.
 */
type StepProps =
    /**
     * Step Props.
     */
    {
        /**
         * To handle the next click.
         */
        onNext: () => void
    }

// Mocking the EnphaseConsentPopup to test the onClose and openEnphaseConsent.
jest.mock('src/modules/Onboarding/steps/IntroductionStep', () => ({
    /**
     * Mock Introduction step.
     *
     * @param props Introduction props.
     * @returns Introduction step.
     */
    IntroductionStep: (props: StepProps) => <StepComponent testId="introduction" {...props} />,
}))

jest.mock('src/modules/Onboarding/steps/NrLinkInstallationInstructionsStep', () => ({
    /**
     * Mock NrLinkInstallationInstructions step.
     *
     * @param props NrLinkInstallationInstructions props.
     * @returns NrLinkInstallationInstructions step.
     */
    NrLinkInstallationInstructionsStep: (props: StepProps) => (
        <StepComponent testId="nrLink-installation-instructions" {...props} />
    ),
}))

jest.mock('src/modules/Onboarding/steps/MeterConnectionStep', () => ({
    /**
     * Mock MeterConnection step.
     *
     * @param props MeterConnection props.
     * @returns MeterConnection step.
     */
    MeterConnectionStep: (props: StepProps) => <StepComponent testId="meter-connection" {...props} />,
}))

jest.mock('src/modules/Onboarding/steps/NRLinkConnectionStep', () => ({
    /**
     * Mock NRLinkConnection step.
     *
     * @param props NRLinkConnection props.
     * @returns NRLinkConnection step.
     */
    NRLinkConnectionStep: (props: StepProps) => <StepComponent testId="nrLink-connection" {...props} />,
}))

jest.mock('src/modules/Onboarding/steps/ContractStep', () => ({
    /**
     * Mock Contract step.
     *
     * @param props Contract props.
     * @returns Contract step.
     */
    ContractStep: (props: StepProps) => <StepComponent testId="contract" {...props} />,
}))

jest.mock('src/modules/Onboarding/steps/SolarProductionConnectionStep', () => ({
    /**
     * Mock SolarProductionConnection step.
     *
     * @param props SolarProductionConnection props.
     * @returns SolarProductionConnection step.
     */
    SolarProductionConnectionStep: (props: StepProps) => (
        <StepComponent testId="solar-production-connection" {...props} />
    ),
}))

let mockIsNrLinkPopupShowing = true

jest.mock('src/modules/nrLinkConnection/NrLinkConnectionHook', () => ({
    ...jest.requireActual('src/modules/nrLinkConnection/NrLinkConnectionHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useGetShowNrLinkPopupHook: () => ({
        isGetShowNrLinkLoading: false,
        isNrLinkPopupShowing: mockIsNrLinkPopupShowing,
    }),
}))

let mockIsProductionActiveAndHousingHasAccessReturnValue = true
jest.mock('src/modules/MyHouse/MyHouseConfig', () => ({
    /**
     * Mock function to check if production is active and housing has access.
     *
     * @returns Boolean.
     */
    isProductionActiveAndHousingHasAccess: () => mockIsProductionActiveAndHousingHasAccessReturnValue,
}))

describe('Onboarding test', () => {
    test.each`
        testCase                            | stepSearchParam                       | nextStepSearchParam
        ${'Introduction'}                   | ${'introduction'}                     | ${'nrLink-installation-instructions'}
        ${'NrLinkInstallationInstructions'} | ${'nrLink-installation-instructions'} | ${'meter-connection'}
        ${'MeterConnection'}                | ${'meter-connection'}                 | ${'nrLink-connection'}
        ${'NRLinkConnection'}               | ${'nrLink-connection'}                | ${'contract'}
        ${'Contract'}                       | ${'contract'}                         | ${'solar-production-connection'}
        ${'SolarProductionConnection'}      | ${'solar-production-connection'}      | ${URL_DASHBOARD}
    `(
        'should $testCase step render correctly and pass to next step when click on next',
        ({ stepSearchParam, nextStepSearchParam }) => {
            const history = createMemoryHistory()
            history.push(`?step=${stepSearchParam}`)
            const { getByTestId } = reduxedRender(
                <Router history={history}>
                    <Onboarding />
                </Router>,
            )
            expect(getByTestId(stepSearchParam)).toBeInTheDocument()
            userEvent.click(screen.getByRole('button', { name: 'Suivant' }))
            const isDashboardPath = nextStepSearchParam === URL_DASHBOARD
            expect(isDashboardPath ? history.location.pathname : history.location.search).toBe(
                isDashboardPath ? nextStepSearchParam : `?step=${nextStepSearchParam}`,
            )
        },
    )

    test('should pass to dashboard instead of SolarProductionConnection step if the user do not have production', async () => {
        const history = createMemoryHistory()
        history.push(`?step=${STEPS_NAMES.CONTRACT}`)
        mockIsProductionActiveAndHousingHasAccessReturnValue = false
        const { getByTestId } = reduxedRender(
            <Router history={history}>
                <Onboarding />
            </Router>,
        )
        expect(getByTestId(STEPS_NAMES.CONTRACT)).toBeInTheDocument()
        userEvent.click(screen.getByRole('button', { name: 'Suivant' }))
        expect(history.location.pathname).toBe(URL_DASHBOARD)
    })
})
