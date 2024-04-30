import { reduxedRender } from 'src/common/react-platform-components/test'
import { screen, fireEvent } from '@testing-library/react'
import { EnedisDistributorClientDialog } from 'src/modules/Onboarding/steps/MeterConnectionStep/components/EnedisDistributorClientDialog'
import { EnedisDistributorClientDialogProps } from 'src/modules/Onboarding/steps/MeterConnectionStep/components/EnedisDistributorClientDialog/EnedisDistributorClientDialog.types'

const mockOnConfirmationOfUsageOfEnedisDistributor = jest.fn()
const mockOnCancel = jest.fn()
const enedisDistributorClientDialogProps: EnedisDistributorClientDialogProps = {
    isOpening: true,
    onCancel: mockOnCancel,
    onConfirmationOfUsageOfEnedisDistributor: mockOnConfirmationOfUsageOfEnedisDistributor,
}

describe('EnedisDistributorClientDialog', () => {
    test('should render the dialog with the correct messages', () => {
        reduxedRender(<EnedisDistributorClientDialog {...enedisDistributorClientDialogProps} />)

        expect(screen.getByText("Nous constatons que votre numéro de PDL n'est pas reconnu.")).toBeInTheDocument()
        expect(screen.getByText('Pourriez-vous confirmer si votre distributeur est ENEDIS ?')).toBeInTheDocument()
    })

    test('should call onConfirmationOfUsageOfEnedisDistributor with false when "Non" button is clicked', () => {
        reduxedRender(<EnedisDistributorClientDialog {...enedisDistributorClientDialogProps} />)

        fireEvent.click(screen.getByText('Non'))

        expect(mockOnConfirmationOfUsageOfEnedisDistributor).toHaveBeenCalledWith(false)
    })

    test('should call onConfirmationOfUsageOfEnedisDistributor with true when "Oui" button is clicked', () => {
        reduxedRender(<EnedisDistributorClientDialog {...enedisDistributorClientDialogProps} />)

        fireEvent.click(screen.getByText('Oui'))

        expect(mockOnConfirmationOfUsageOfEnedisDistributor).toHaveBeenCalledWith(true)
    })

    test('should call onCancel when "Utiliser un autre numéro" button is clicked', () => {
        reduxedRender(<EnedisDistributorClientDialog {...enedisDistributorClientDialogProps} />)

        fireEvent.click(screen.getByText('Utiliser un autre numéro'))

        expect(mockOnCancel).toHaveBeenCalled()
    })
})
