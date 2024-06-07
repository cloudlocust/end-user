import { useContext, useEffect, useMemo, useRef } from 'react'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import {
    computeTotalEuros,
    computeTotalEurosWithSubscriptionPrice,
    getWidgetRange,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'
import { utcToZonedTime } from 'date-fns-tz'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useCurrentDayConsumption } from 'src/modules/MyConsumption/components/Widget/currentDayConsumptionHook'

const emptyValueUnit = { value: 0, unit: '' }
const parisTimeZone = 'Europe/Paris'

/**
 * WidgetCost Component.
 *
 * @param props Same Props as Widget Component.
 * @returns WidgetCost Component.
 */
export const WidgetCost = (props: IWidgetProps) => {
    const { metricsInterval, range, period, filters } = props
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { currentDayEuroConsumption, getCurrentDayEuroConsumption } = useCurrentDayConsumption(currentHousing?.id)

    const { getMetricsWidgetsData } = useContext(ConsumptionWidgetsMetricsContext)
    const { isPartiallyYearlyDataExist } = useMyConsumptionStore()

    const euroConsumptionData = useMemo(
        () => getMetricsWidgetsData([props.targets[0]]),
        [getMetricsWidgetsData, props.targets],
    )

    const { data, setData, setMetricsInterval, setRange } = useMetrics({
        interval: metricsInterval,
        range: getWidgetRange(range, period),
        targets: [
            {
                target: metricTargetsEnum.subscriptionPrices,
                type: 'timeserie',
            },
        ],
        filters: filters,
    })

    const isRangeChanged = useRef(false)

    // When range change, set isRangedChanged
    useEffect(() => {
        isRangeChanged.current = true
    }, [range])

    const isCurrentDayRange = useMemo(
        () =>
            period === 'daily' &&
            utcToZonedTime(new Date(range.from), parisTimeZone).getDate() ===
                utcToZonedTime(new Date(), parisTimeZone).getDate(),
        [period, range.from],
    )

    // get metrics when metricsInterval change.
    useEffect(() => {
        if (!isCurrentDayRange || period === 'monthly' || period === 'yearly') {
            setMetricsInterval(period === 'daily' ? '1d' : metricsInterval)
        } else {
            setData([])
        }
    }, [isCurrentDayRange, metricsInterval, period, range.from, setData, setMetricsInterval])

    // When period or range changes
    useEffect(() => {
        // If period just changed block the call of getMetrics, because period and range changes at the same time, so to avoid two call of getMetrics
        // 1 call when range change and the other when period change, then only focus on when range changes.
        if (isRangeChanged.current && (!isCurrentDayRange || period === 'monthly' || period === 'yearly')) {
            const widgetRange = getWidgetRange(range, period)
            setRange(widgetRange)
            // reset isRangeChanged
            isRangeChanged.current = false
        }
    }, [isCurrentDayRange, period, range, setRange])

    useEffect(() => {
        if (isCurrentDayRange) {
            getCurrentDayEuroConsumption()
        }
    }, [getCurrentDayEuroConsumption, isCurrentDayRange])

    const { unit, value: totalEurosWithSubscription } = useMemo(
        // we should wait for all metrics needed to be loaded, in this case, 2 (euroconsumption and subscriptionPrices)
        () => {
            if (!euroConsumptionData.length || !data.length) {
                return emptyValueUnit
            }
            if (isCurrentDayRange && currentDayEuroConsumption !== null && currentDayEuroConsumption !== undefined) {
                const { value: totalSubscriptionPrice } = computeTotalEuros(data, metricTargetsEnum.subscriptionPrices)
                return {
                    value: Number((currentDayEuroConsumption + totalSubscriptionPrice).toFixed(2)),
                    unit: '€',
                }
            }
            return computeTotalEurosWithSubscriptionPrice([...euroConsumptionData, ...data])
        },
        [currentDayEuroConsumption, data, euroConsumptionData, isCurrentDayRange],
    )

    return (
        <Widget {...props}>
            {totalEurosWithSubscription ? (
                <div className="px-16 pb-10 font-semibold text-sm text-grey-600">
                    {`Coût total abonnement compris ${totalEurosWithSubscription} ${unit}`}
                    {isPartiallyYearlyDataExist && (
                        <span>
                            <br /> sur la base des données disponibles
                        </span>
                    )}
                </div>
            ) : (
                <></>
            )}
        </Widget>
    )
}
