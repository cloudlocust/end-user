import { reduxedRender } from 'src/common/react-platform-components/test'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ContractStep } from 'src/modules/Onboarding/steps/ContractStep'
import { ContractStepProps } from 'src/modules/Onboarding/steps/ContractStep/ContractStep.types'
import { ContractFormProps } from 'src/modules/Contracts/contractsTypes'
import { IContract } from 'src/modules/Contracts/contractsTypes'

let mockReloadContractList = jest.fn()
const mockHandleNext = jest.fn()
let mockIsContractsLoading = false
let mockContractsList: IContract[] = []

let mockAddContract = jest.fn()

/**
 * Mocking the useContractList.
 */
jest.mock('src/modules/Contracts/contractsHook', () => ({
    ...jest.requireActual('src/modules/Contracts/contractsHook'),
    /**
     * Mock useContractList hook.
     *
     * @returns Mocked contract list.
     */
    useContractList: () => ({
        elementList: mockContractsList,
        loadingInProgress: mockIsContractsLoading,
        reloadElements: mockReloadContractList,
        addElement: mockAddContract,
    }),
}))

// Mocking ContractForm, so that we don't have to do the selection to test the onSubmit.
jest.mock('src/modules/Contracts/components/ContractForm', () => (props: ContractFormProps) => {
    return (
        <form
            id="contract-form"
            onSubmit={() =>
                props.onSubmit({
                    contractTypeId: '' as unknown as number,
                    endSubscription: '',
                    offerId: '' as unknown as number,
                    power: '' as unknown as number,
                    startSubscription: '',
                    tariffTypeId: '' as unknown as number,
                })
            }
        >
            <input name="test" value="test" />
        </form>
    )
})

let mockIsHideOnboardingInProgress = false
const mockContractProps: ContractStepProps = {
    housingId: 123,
    onNext: mockHandleNext,
    isHideOnboardingInProgress: mockIsHideOnboardingInProgress,
}

describe('Contract', () => {
    test('should render the component', () => {
        const { getByText, getByRole } = reduxedRender(
            <Router>
                <ContractStep {...mockContractProps} />
            </Router>,
        )
        expect(getByText('4/4: L’électricité... c’est de l’argent !')).toBeInTheDocument()
        expect(getByText('Pour afficher votre consommation en € choisissez votre contrat :')).toBeInTheDocument()
        expect(
            getByText(
                'Toutes les informations nécessaires sont disponibles sur votre facture ou votre contrat d’électricité.',
            ),
        ).toBeInTheDocument()
        expect(getByRole('button', { name: 'Suivant' })).toBeInTheDocument()
        // todo: to enable later when the button is enabled
        // expect(getByRole('button', { name: 'Mon contrat n’est pas dans la liste' })).toBeInTheDocument()
    })

    test('When we click on "Suivant", addContract and loadContract hook functions should be called, and onNext should be called', async () => {
        const { getByRole, container } = reduxedRender(
            <Router>
                <ContractStep {...mockContractProps} />
            </Router>,
        )

        fireEvent.click(getByRole('button', { name: 'Suivant' }))

        screen.debug(container)
        await waitFor(() => {
            expect(mockAddContract).toHaveBeenCalled()
            expect(mockHandleNext).toHaveBeenCalled()
        })
    })

    test('should the next button be in progress when isHideOnboardingInProgress is true', () => {
        mockContractProps.isHideOnboardingInProgress = true
        const { getByTestId } = reduxedRender(
            <Router>
                <ContractStep {...mockContractProps} />
            </Router>,
        )
        const nextButton = getByTestId('next-button')
        screen.debug(nextButton)
        expect(nextButton).toHaveClass('MuiLoadingButton-loading')
    })
})
