import { fireEvent } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { applyCamelCase } from 'src/common/react-platform-components'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { DEFAULT_LOCALE } from 'src/configs'
import { IUser } from 'src/modules/User'
import { Introduction } from 'src/modules/Onboarding/steps/Introduction'

/**
 * Mock user model state.
 */
const mockUser: IUser = applyCamelCase(TEST_SUCCESS_USER)

/**
 * Mock all state.
 */
const mockReduxState = {
    userModel: {
        user: mockUser,
    },
    translationModel: {
        locale: DEFAULT_LOCALE,
        translations: null,
    },
}

/**
 * Mocked Lottie component.
 *
 * @returns Mocked Lottie component.
 */
function MockedLottie() {
    return <div />
}
// Mock Lottie.
jest.mock('react-lottie', () => MockedLottie)

describe('Introduction test', () => {
    test('renders welcome message with user first name', () => {
        const { getByText } = reduxedRender(<Introduction onNext={() => {}} />, {
            initialState: mockReduxState,
        })
        expect(getByText(`Bienvenue ${TEST_SUCCESS_USER.first_name}`)).toBeInTheDocument()
    })

    test('renders introductory text', () => {
        const { getByText } = reduxedRender(<Introduction onNext={() => {}} />, {
            initialState: mockReduxState,
        })
        expect(getByText('Nous sommes ravis de vous compter parmi les utitisateurs du nrLINK!')).toBeInTheDocument()
        expect(
            getByText(
                "C'est le début d'une grande aventure pour comprendre & maîtriser votre consommation d'électricité chez vous !",
            ),
        ).toBeInTheDocument()
    })

    test('calls onNext when "Je me lance!" button is clicked', () => {
        const onNext = jest.fn()
        const { getByText } = reduxedRender(<Introduction onNext={onNext} />, {
            initialState: mockReduxState,
        })
        fireEvent.click(getByText('Je me lance!'))
        expect(onNext).toHaveBeenCalled()
    })
})
