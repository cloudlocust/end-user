import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple/PageSimple'
import { DashboardContainer } from 'src/modules/Dashboard/DashboardContainer'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { MissingHousingMeterErrorMessage } from 'src/modules/MyConsumption/utils/ErrorMessages'
import { useConsents } from 'src/modules/Consents/consentsHook'

/**
 * Dashboard page.
 *
 * @returns Dashboard.
 */
export const Dashboard = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { nrlinkConsent, enedisSgeConsent } = useConsents()
    const nrlinkOff = nrlinkConsent?.nrlinkConsentState === 'NONEXISTENT'
    const enedisOff = enedisSgeConsent?.enedisSgeConsentState !== 'CONNECTED'

    if (!currentHousing?.meter?.guid || (nrlinkOff && enedisOff)) return <MissingHousingMeterErrorMessage />
    return <PageSimple content={<DashboardContainer />} />
}
