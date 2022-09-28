import { authTypes } from 'src/common/react-platform-components'
import { InstallationRequests } from 'src/modules/InstallatinRequests'
import { IRoute } from 'src/common/react-platform-components/utils/mm'

const URL_INSTALLATIONS_REQUESTS = '/installation-requests'

const InstallationsRequestsConfig = [
    {
        path: URL_INSTALLATIONS_REQUESTS,
        component: InstallationRequests,
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
]

export { InstallationsRequestsConfig, URL_INSTALLATIONS_REQUESTS }
