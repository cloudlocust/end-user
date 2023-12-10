import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple/PageSimple'
import { DashboardContainer } from 'src/modules/Dashboard/DashboardContainer'

/**
 * Dashboard page.
 *
 * @returns Dashboard.
 */
export const Dashboard = () => {
    return <PageSimple content={<DashboardContainer />} />
}
