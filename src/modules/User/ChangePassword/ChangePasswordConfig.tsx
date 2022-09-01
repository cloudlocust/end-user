import { IRoute } from 'src/common/react-platform-components/utils/mm'
import { authTypes } from 'src/common/react-platform-components'
import { ChangePassword } from './ChangePassword'

const URL_CHANGE_PASSWORD = '/profile-management/change-password'

const ChangePasswordConfig = [
    {
        path: URL_CHANGE_PASSWORD,
        component: ChangePassword,
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
]

export { ChangePasswordConfig, URL_CHANGE_PASSWORD }
