import { styled } from '@mui/material/styles'
import FusePageCarded from 'src/common/ui-kit/fuse/components/FusePageCarded'
import { InstallationRequestsHeader } from 'src/modules/InstallatinRequests/components/InstallationRequestsHeader'

const Root = styled(FusePageCarded)(({ theme }) => ({
    '& .FusePageCarded-header': {
        minHeight: 72,
        height: 72,
        alignItems: 'center',
        [theme.breakpoints.up('sm')]: {
            minHeight: 136,
            height: 136,
        },
    },
    '& .FusePageCarded-content': {
        display: 'flex',
    },
    '& .FusePageCarded-contentCard': {
        overflow: 'hidden',
    },
}))

/**
 * Installation Requests page.
 *
 * @returns Installation Request JSX.
 */
export const InstallationRequests = (): JSX.Element => {
    return <Root header={<InstallationRequestsHeader />} content={<>Content</>} innerScroll />
}
