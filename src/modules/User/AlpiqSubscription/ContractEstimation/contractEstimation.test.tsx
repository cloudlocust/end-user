import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import ContractEstimation from 'src/modules/User/AlpiqSubscription/ContractEstimation'
import { waitFor } from '@testing-library/react'

const mockHandleNext = jest.fn()
const mockGetMonthlySubscriptionEstimation = jest.fn()
const contractEstimationProps = {
    handleNext: mockHandleNext,
}
const REQUIRED_ERROR_TEXT = 'Champ obligatoire non renseigné'

const ESTIMATE_MONTHLY_SUBSCRIPTION_BUTTON_TEXT = 'Estimer ma mensualité'
// Mock Alpiq hook
jest.mock('src/modules/User/AlpiqSubscription/alpiqSubscriptionHooks', () => ({
    ...jest.requireActual('src/modules/User/AlpiqSubscription/alpiqSubscriptionHooks'),
    //eslint-disable-next-line jsdoc/require-jsdoc
    useAlpiqProvider: () => ({
        getMonthlySubscriptionEstimation: mockGetMonthlySubscriptionEstimation,
    }),
}))

describe('Test ContractEstimation', () => {
    test('component shows correctly', async () => {
        const { getByText } = reduxedRender(<ContractEstimation {...contractEstimationProps} />)
        expect(getByText('Mon contrat BôWatts par Alpiq')).toBeInTheDocument()
        expect(getByText("L'électricité verte de beaujolais")).toBeInTheDocument()
        expect(getByText('Paramétrez votre contrat Bôwatts :')).toBeInTheDocument()
        expect(getByText(ESTIMATE_MONTHLY_SUBSCRIPTION_BUTTON_TEXT)).toBeInTheDocument()
        expect(getByText('Mensualité calculée à partir de vos consommations passées.')).toBeInTheDocument()
        expect(getByText('Type de contrat')).toBeInTheDocument()
        expect(getByText('Puissance')).toBeInTheDocument()
    })
    test('Required filleds', async () => {
        const { getByText, getAllByText } = reduxedRender(<ContractEstimation {...contractEstimationProps} />)
        userEvent.click(getByText(ESTIMATE_MONTHLY_SUBSCRIPTION_BUTTON_TEXT))
        await waitFor(() => {
            expect(getAllByText(REQUIRED_ERROR_TEXT).length).toBe(2)
        })
    })
    test('When selecting values and clicking on estimate, hook is called', async () => {
        const { getByText, getByLabelText } = reduxedRender(<ContractEstimation {...contractEstimationProps} />)
        userEvent.click(getByLabelText('Puissance', { exact: false }))
        userEvent.click(getByText('3 kva'))
        userEvent.click(getByLabelText('Type de contrat', { exact: false }))
        userEvent.click(getByText('Base'))
        userEvent.click(getByText(ESTIMATE_MONTHLY_SUBSCRIPTION_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockGetMonthlySubscriptionEstimation).toHaveBeenCalled()
        })
    })
})
