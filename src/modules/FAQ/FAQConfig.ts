import { IRoute } from 'src/common/react-platform-components/utils/mm'
import { authTypes } from 'src/common/react-platform-components'
import FAQContainer from 'src/modules/FAQ/FAQContainer'

const URL_FAQ = '/FAQ'

const FAQConfig = [
    {
        path: URL_FAQ,
        component: FAQContainer,
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
]

export { FAQConfig, URL_FAQ }
