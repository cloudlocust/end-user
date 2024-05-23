import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ResalePriceForm } from 'src/modules/MyConsumption/components/ResalePriceForm'
import { ResalePriceFormProps } from 'src/modules/MyConsumption/components/ResalePriceForm/ResalePriceForm.type'

const mockUpdateResalePriceValue = jest.fn()
const mockSetResaleContractPossessionToFalse = jest.fn()
const updateResalePriceInProgress = false

const props: ResalePriceFormProps = {
    updateResalePriceValue: mockUpdateResalePriceValue,
    setResaleContractPossessionToFalse: mockSetResaleContractPossessionToFalse,
    updateResalePriceInProgress,
}

describe('ResalePriceForm Component', () => {
    test('renders correctly', () => {
        const { getByText, getByRole, getByPlaceholderText } = reduxedRender(<ResalePriceForm {...props} />)

        // Assert that the header is present
        expect(
            getByText((content, _) =>
                content.includes('Pour découvrir les revenus liés à votre surplus, renseignez votre tarif revente'),
            ),
        ).toBeInTheDocument()

        // Assert that the label, text field and button are present
        expect(getByText('Mon tarif de revente')).toBeInTheDocument()
        expect(getByPlaceholderText('0.0000')).toBeInTheDocument()
        expect(getByRole('button', { name: 'OK' })).toBeInTheDocument()

        // Assert that the "Je n’ai pas de contrat de revente" button is present
        expect(getByText('Je n’ai pas de contrat de revente')).toBeInTheDocument()
    })

    test('calls updateResalePriceValue with correct value when OK button is clicked', async () => {
        const { getByRole, getByPlaceholderText } = reduxedRender(<ResalePriceForm {...props} />)

        const input = getByPlaceholderText('0.0000') as HTMLInputElement
        const okButton = getByRole('button', { name: 'OK' })

        // Fill the input with a value and click the OK button
        userEvent.type(input, '1847')
        userEvent.click(okButton)

        // Assert that the function was called with the correct value
        await waitFor(() => {
            expect(mockUpdateResalePriceValue).toHaveBeenCalledWith(1847)
        })
    })

    test('calls setResaleContractPossessionToFalse when "Je n’ai pas de contrat de revente" button is clicked', async () => {
        reduxedRender(<ResalePriceForm {...props} />)

        const noContractButton = screen.getByText('Je n’ai pas de contrat de revente')
        userEvent.click(noContractButton)

        // Assert that the function was called once
        await waitFor(() => {
            expect(mockSetResaleContractPossessionToFalse).toHaveBeenCalledTimes(1)
        })
    })
})
