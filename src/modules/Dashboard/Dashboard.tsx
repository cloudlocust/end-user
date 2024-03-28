import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple/PageSimple'
import { DashboardContainer } from 'src/modules/Dashboard/DashboardContainer'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { MissingHousingMeterErrorMessage } from 'src/modules/MyConsumption/utils/ErrorMessages'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { useEffect } from 'react'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading'

/**
 * Dashboard page.
 *
 * @returns Dashboard.
 */
export const Dashboard = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { nrlinkConsent, getConsents, consentsLoading } = useConsents()
    const nrlinkActif = nrlinkConsent?.nrlinkConsentState !== 'NONEXISTENT'
    useEffect(() => {
        if (!currentHousing?.id) return
        getConsents(currentHousing?.id)
    }, [getConsents, currentHousing?.id])

    if (consentsLoading) return <FuseLoading />

    if (!currentHousing?.meter?.guid || !nrlinkActif) return <MissingHousingMeterErrorMessage />
    return <PageSimple content={<DashboardContainer />} />
}
