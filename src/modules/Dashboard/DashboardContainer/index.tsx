import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { AlertWidgetsContainer } from 'src/modules/Dashboard/AlertWidgetsContainer'
import { AdviceContainer } from 'src/modules/Dashboard/AdviceContainer'
import { DashboardConsumptionWidget } from 'src/modules/Dashboard/DashboardConsumptionWidget'
import { StatusWrapper } from 'src/modules/Dashboard/StatusWrapper'
import { RootState } from 'src/redux'
import { Container } from '@mui/material'

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
        <Container maxWidth="xl" component="div" className="p-16 h-full">
            <TypographyFormatMessage className="mb-12 font-500 text-24">Accueil</TypographyFormatMessage>
            <div className="grid grid-cols-1 gap-y-10 md:gap-y-40 justify-items-stretch">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-x-40">
                    <StatusWrapper nrlinkConsent={nrlinkConsent} />
                    <DashboardConsumptionWidget />
                    <AlertWidgetsContainer />
                </div>
                <AdviceContainer />
            </div>
        </Container>
    )
}
