import { reduxedRender } from 'src/common/react-platform-components/test'
import { FirstStepNrLinkConnection } from 'src/modules/nrLinkConnection'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { applyCamelCase } from 'src/common/react-platform-components'

const userData = applyCamelCase(TEST_SUCCESS_USER)

const FIRST_STEP_TEXT =
    'Allumez votre afficheur déporté et suivez les instructions pour connecter votre capteur à votre compteur Linky et suivre votre consommation.'
const mockHandleBack = jest.fn()
const mockHandleNext = jest.fn()

describe('Test NrLinkConnection Page', () => {
    test('When clicking on CTA button connect nrLINK, it should redirect to nrLinkConnectionStep', async () => {
        userData.firstLogin = true
        const { getByText } = reduxedRender(
            <FirstStepNrLinkConnection handleBack={mockHandleBack} handleNext={mockHandleNext} />,
            {
                initialState: { userModel: { user: userData } },
            },
        )
        expect(getByText(FIRST_STEP_TEXT)).toBeTruthy()
    })
})
