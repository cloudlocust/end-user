import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Mentions } from 'src/modules/Mentions/Mentions'

const mockGeneralTermsOfUse = 'mockGeneralTermsOfUse'
const mockPrivacyPolicy = 'mockPrivacyPolicy'

// testing for Mentions as default
jest.mock('src/modules/Mentions/MentionsConfig', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    generalTermsOfUse: () => mockGeneralTermsOfUse,
    // eslint-disable-next-line jsdoc/require-jsdoc
    privacyPolicy: () => mockPrivacyPolicy,
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

        expect(getByText('Politique de Confidentialité')).toBeTruthy()
        expect(container.getElementsByTagName('a')[1].href).toContain(mockPrivacyPolicy)

        expect(getByText('Préférences des cookies')).toBeTruthy()
        // eslint-disable-next-line no-script-url
        expect(container.getElementsByTagName('a')[2].href).toContain(`javascript:openAxeptioCookies()`)

        expect(getByText('Consentement à la récolte des données de consommation')).toBeTruthy()
        expect(container.getElementsByTagName('a')[3].href).toContain(
            'https://drive.google.com/uc?export=download&id=15QHX14AWoKepWuEJBxscijK5IIHPnCbl',
        )
    })
})
