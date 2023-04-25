import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Mentions } from 'src/modules/Mentions/Mentions'

const mockGeneralTermsOfUse = 'mockGeneralTermsOfUse'

// testing for Mentions as default
jest.mock('src/modules/Mentions/MentionsConfig', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    generalTermsOfUse: () => mockGeneralTermsOfUse,
    // eslint-disable-next-line jsdoc/require-jsdoc
    privacyPolicy: 'mockPrivacyPolicy',
}))

describe('Test Mentions Page', () => {
    test('Mention Component', async () => {
        const { getByText, container } = reduxedRender(
            <Router>
                <Mentions />
            </Router>,
        )

        expect(getByText('Conditions Générales d’Utilisations')).toBeTruthy()
        expect(container.getElementsByTagName('a')[0].href).toContain(mockGeneralTermsOfUse)
    })
})
