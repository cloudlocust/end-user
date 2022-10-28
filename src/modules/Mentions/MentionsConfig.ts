import { Mentions } from 'src/modules/Mentions/Mentions'
import { authTypes, IRoute } from 'src/common/react-platform-components/utils/mm'

const URL_MENTIONS = '/mentions'

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
