import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { EnergyStatusWidget } from 'src/modules/Dashboard/EnergyStatusWidget/Index'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { getRangeV2, formatMetricFilter } from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { arePlugsUsedBasedOnProductionStatus } from 'src/modules/MyHouse/MyHouseConfig'
import { RootState } from 'src/redux'

/**
 * Dashboard container.
 *
 * @returns Dashboard container.
 */
export const DashboardContainer = () => {
    const { currentHousing, currentHousingScopes } = useSelector(({ housingModel }: RootState) => housingModel)
    const { getConsents, nrlinkConsent, enphaseConsent, consentsLoading } = useConsents()

    const isSolarProductionConsentOff =
        enphaseConsent?.enphaseConsentState !== 'ACTIVE' || arePlugsUsedBasedOnProductionStatus(currentHousingScopes)

    const { data, isMetricsLoading, setFilters } = useMetrics(
        {
            interval: '1m',
            range: getRangeV2(PeriodEnum.DAILY),
            targets: [
                {
                    target: metricTargetsEnum.consumption,
                    type: 'timeserie',
                },
            ],
            filters: formatMetricFilter(currentHousing!.id) ?? [],
        },
        true,
    )

    useEffect(() => {
        if (!currentHousing?.id) return
        getConsents(currentHousing.id)
    }, [setFilters, getConsents, currentHousing?.id])

    return (
        <div className="p-16 h-full">
            <TypographyFormatMessage className="mb-12 font-500 text-24">Acceuil</TypographyFormatMessage>

            <EnergyStatusWidget
                data={data}
                nrlinkConsent={nrlinkConsent?.nrlinkConsentState}
                type={isSolarProductionConsentOff ? 'consumption' : 'production'}
                isLoading={consentsLoading || isMetricsLoading}
            />
        </div>
    )
}
