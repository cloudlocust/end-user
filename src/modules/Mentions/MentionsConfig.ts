import { Mentions } from 'src/modules/Mentions/Mentions'
import { authTypes, IRoute } from 'src/common/react-platform-components/utils/mm'

const URL_MENTIONS = '/mentions'

/**
 * Env var for Conditions Générales d’Utilisations.
 */
export const generalTermsOfUse: string = window._env_.REACT_APP_GENERAL_TERMS_OF_USE

/**
 * Env var for Politique de Confidentialité.
 */
export const privacyPolicy: string = window._env_.REACT_APP_PRIVACY_POLICY

const MentionsConfig = [
    {
        path: URL_MENTIONS,
        component: Mentions,
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
]

export { URL_MENTIONS, MentionsConfig }
