import { IRoute } from 'src/common/react-platform-components/utils/mm'
import { authTypes } from 'src/common/react-platform-components'
import ProfileManagement from './ProfileManagement'

const URL_PROFILE_MANAGEMENT = '/profile-management'

/**
 * State for delete user feature. (Concerns only NED).
 */
export const deleteAcountFeatureState = window._env_.REACT_APP_DELETE_ACCOUNT_FEATURE_STATE === 'enabled'

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
