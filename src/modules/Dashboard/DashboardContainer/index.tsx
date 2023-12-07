import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { DashboardConsumptionWidget } from 'src/modules/Dashboard/DashboardConsumptionWidget'
import { StatusWrapper } from 'src/modules/Dashboard/StatusWrapper'
import { RootState } from 'src/redux'

/**
 * Dashboard container.
 *
 * @returns Dashboard container.
 */
export const DashboardContainer = () => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { getConsents, nrlinkConsent } = useConsents()

    useEffect(() => {
        if (currentHousing?.id) {
            getConsents(currentHousing.id)
        }
    }, [getConsents, currentHousing?.id])

    return (
        <div className="p-16 h-full">
            <TypographyFormatMessage className="mb-12 font-500 text-24">Accueil</TypographyFormatMessage>

            <div className="flex flex-col gap-20">
                <StatusWrapper nrlinkConsent={nrlinkConsent} />

                <DashboardConsumptionWidget />
            </div>
        </div>
    )
}
