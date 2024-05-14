import { authTypes, IRoute } from 'src/common/react-platform-components/utils/mm'
import { MyContractNrLinkInfo } from 'src/modules/MyContractNrLinkInfo'

const URL_MY_CONTRACT_NRLINK_URL = '/nrlink-contract-management'

const MyContractNrLinkInfoConfig = [
    {
        path: URL_MY_CONTRACT_NRLINK_URL,
        component: MyContractNrLinkInfo,
        auth: { authType: authTypes.loginRequired },
    } as IRoute</**
     *
     */
    {}>,
]

export { URL_MY_CONTRACT_NRLINK_URL, MyContractNrLinkInfoConfig }
