import { IRoute } from 'src/common/react-platform-components/utils/mm'
import { authTypes } from 'src/common/react-platform-components'
import ProfileManagement from './ProfileManagement'

const URL_PROFILE_MANAGEMENT = '/profile-management'

const ProfileManagementConfig = [
    {
        path: URL_PROFILE_MANAGEMENT,
        component: ProfileManagement,
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
]

export { ProfileManagementConfig, URL_PROFILE_MANAGEMENT }
