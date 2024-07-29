import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { ICreateCustomProvider, IProvider } from 'src/hooks/CommercialOffer/CommercialOffers'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import ContractOtherField from 'src/modules/Contracts/components/ContractOtherField'
import { ContractOtherFieldProps } from 'src/modules/Contracts/components/ContractOtherField/ContractOtherField.types'

let mockContractOtherFieldProps: ContractOtherFieldProps<ICreateCustomProvider, IProvider>

let mockHouse = TEST_HOUSES[0]

jest.mock('src/hooks/CurrentHousing', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useCurrentHousing: () => mockHouse,
}))

describe('ContractOtherField', () => {
    beforeEach(() => {
        mockContractOtherFieldProps = {
            name: 'mockName',
            label: 'mockLabel',
            buttonLabel: 'mockButtonLabel',
            onButtonClick: jest.fn(),
            isButtonLoading: false,
            isOtherFieldSubmitted: false,
        }
    })

    test('should render correctly', () => {
        const { getByText, getByLabelText } = reduxedRender(<ContractOtherField {...mockContractOtherFieldProps} />)

        expect(getByLabelText('mockLabel')).toBeInTheDocument()
        expect(getByText('mockButtonLabel')).toBeInTheDocument()
        expect(mockContractOtherFieldProps.isButtonLoading).toBeFalsy()
    })

    test('should call buttonAction when button is clicked', () => {
        const { getByText } = reduxedRender(<ContractOtherField {...mockContractOtherFieldProps} />)

        userEvent.click(getByText('mockButtonLabel'))

        expect(mockContractOtherFieldProps.onButtonClick).toHaveBeenCalled()
    })
    test('should not show button when isOtherFieldSubmitted is true', () => {
        mockContractOtherFieldProps.isOtherFieldSubmitted = true
        const { queryByText } = reduxedRender(<ContractOtherField {...mockContractOtherFieldProps} />)

        expect(queryByText('mockButtonLabel')).not.toBeInTheDocument()
    })

    test('should show loading when isButtonLoading is true', () => {
        mockContractOtherFieldProps.isButtonLoading = true
        const { queryByRole } = reduxedRender(<ContractOtherField {...mockContractOtherFieldProps} />)

        expect(queryByRole('progressbar')).toBeInTheDocument()
    })
})
