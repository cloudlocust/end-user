import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useConsumptionAlerts } from 'src/modules/Alerts/components/ConsumptionAlert/consumptionAlertHooks'
import { INrlinkConsent } from 'src/modules/Consents/Consents'
import { EnergyStatusWidget } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/Index'
import { WeatherWidget } from 'src/modules/Dashboard/StatusWrapper/components/WeatherWidget'
import { useNrlinkMetrics } from 'src/modules/Dashboard/StatusWrapper/nrlinkPowerHook'
import { RootState } from 'src/redux'

/**
 * Wrapper for the status widgets.
 *
 * @param root0 N/A.
 * @param root0.nrlinkConsent Nrlink consent.
 * @returns EnergyStatusWidget & TemperatureStatusWidget JSX.
 */
export const StatusWrapper = ({
    nrlinkConsent,
}: /**
 *
 */
{
    /**
     * Nrlink consent.
     */
    nrlinkConsent?: INrlinkConsent
}) => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { data: nrlinkPowerData, isFetching: isNrlinkPowerLoading } = useNrlinkMetrics(currentHousing?.id)
    const { pricePerKwh } = useConsumptionAlerts(currentHousing!.id!)

    const { lastPower: lastPowerData, lastTemperature: lastTemperatureData } =
        useMemo(() => nrlinkPowerData, [nrlinkPowerData]) || {}

    return (
        <div className="flex justify-between items-center w-full space-x-10">
            <EnergyStatusWidget
                isNrlinkPowerLoading={isNrlinkPowerLoading}
                lastPowerData={lastPowerData}
                pricePerKwh={pricePerKwh}
                nrlinkConsent={nrlinkConsent}
            />
            <WeatherWidget lastTemperatureData={lastTemperatureData} isNrlinkPowerLoading={isNrlinkPowerLoading} />
        </div>
    )
}
