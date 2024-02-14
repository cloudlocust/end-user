import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { INrlinkConsent } from 'src/modules/Consents/Consents'
import { EnergyStatusWidget } from 'src/modules/Dashboard/StatusWrapper/components/EnergyStatusWidget/Index'
import { WeatherWidget } from 'src/modules/Dashboard/StatusWrapper/components/WeatherWidget'
import { useNrlinkMetrics } from 'src/modules/Dashboard/StatusWrapper/nrlinkPowerHook'
import { RootState } from 'src/redux'
import { useInstantPricePerKwh } from 'src/modules/Dashboard/StatusWrapper/statusWrapperHooks'

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
    const { instantPricePerKwh } = useInstantPricePerKwh(currentHousing!.id!)

    const { lastPower: lastPowerData, lastTemperature: lastTemperatureData } =
        useMemo(() => nrlinkPowerData, [nrlinkPowerData]) || {}

    return (
        <div className="flex space-x-10 md:flex-col md:justify-between md:space-x-0 md:space-y-32">
            <EnergyStatusWidget
                isNrlinkPowerLoading={isNrlinkPowerLoading}
                lastPowerData={lastPowerData}
                pricePerKwh={instantPricePerKwh}
                nrlinkConsent={nrlinkConsent}
            />
            <WeatherWidget lastTemperatureData={lastTemperatureData} isNrlinkPowerLoading={isNrlinkPowerLoading} />
        </div>
    )
}
