import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { useConsumptionAlerts } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlertHooks'
import { useConsents } from 'src/modules/Consents/consentsHook'
import { EnergyStatusWidget } from 'src/modules/Dashboard/EnergyStatusWidget/Index'
import { EnergyStatusWidgetTypeEnum } from 'src/modules/Dashboard/EnergyStatusWidget/energyStatusWidget.d'
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
    const { pricePerKwh } = useConsumptionAlerts(currentHousing!.id!)

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
        if (currentHousing?.id) {
            getConsents(currentHousing.id)
        }
    }, [setFilters, getConsents, currentHousing?.id])

    return (
        <div className="p-16 h-full">
            <TypographyFormatMessage className="mb-12 font-500 text-24">Accueil</TypographyFormatMessage>

            <EnergyStatusWidget
                data={data}
                nrlinkConsent={nrlinkConsent?.nrlinkConsentState}
                type={
                    isSolarProductionConsentOff
                        ? EnergyStatusWidgetTypeEnum.CONSUMPTION
                        : EnergyStatusWidgetTypeEnum.PRODUCTION
                }
                isLoading={consentsLoading || isMetricsLoading}
                pricePerKwh={pricePerKwh}
            />
        </div>
    )
}
