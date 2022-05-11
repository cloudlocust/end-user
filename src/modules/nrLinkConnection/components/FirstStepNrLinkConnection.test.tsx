import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { FirstStepNrLinkConnection } from 'src/modules/nrLinkConnection'
import { TEST_SUCCESS_USER } from 'src/mocks/handlers/user'
import { applyCamelCase } from 'src/common/react-platform-components'
import { MessageDescriptor } from 'react-intl'

const userData = applyCamelCase(TEST_SUCCESS_USER)

const FIRST_STEP_TEXT =
    'Allumez votre afficheur déporté et suivez les instructions pour connecter votre capteur à votre compteur Linky et suivre votre consommation.'
const mockHandleBack = jest.fn()
const mockHandleNext = jest.fn()
const mockFormatMessage = jest.fn((input: MessageDescriptor) => input.defaultMessage)
/**
 * Mocking the useHistory.
 */
jest.mock('react-intl', () => ({
    ...jest.requireActual('react-intl'),

    /**
     * Mock react-router useHistory hook.
     *
     * @returns The react-router useHistory replace function.
     */
    useIntl: () => ({
        formatMessage: mockFormatMessage,
    }),
}))
describe('Test NrLinkConnection Page', () => {
    test('When clicking on CTA button connect nrLink, it should redirect to nrLinkConnectionStep', async () => {
        userData.firstLogin = true
        const { getByText } = reduxedRender(
            <FirstStepNrLinkConnection handleBack={mockHandleBack} handleNext={mockHandleNext} />,
            {
                initialState: { userModel: { user: userData } },
            },
        )
        expect(mockFormatMessage).toHaveBeenCalledWith({ id: FIRST_STEP_TEXT, defaultMessage: FIRST_STEP_TEXT })
        expect(getByText(FIRST_STEP_TEXT)).toBeTruthy()
    })
})
