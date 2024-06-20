import { useContext, useEffect, useMemo } from 'react'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import {
    checkIfItIsCurrentDayRange,
    computeTotalEuros,
    computeTotalEurosWithSubscriptionPrice,
    getWidgetRange,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { useCurrentDayConsumption } from 'src/modules/MyConsumption/components/Widget/currentDayConsumptionHook'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

const emptyValueUnit = { value: 0, unit: '' }

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

    const { data, setData, getMetricsWithParams } = useMetrics(undefined, {
        isUsingHistoryTargets: [PeriodEnum.WEEKLY, PeriodEnum.MONTHLY, PeriodEnum.YEARLY].includes(
            period as PeriodEnum,
        ),
    })

    const isCurrentDayRange = useMemo(() => checkIfItIsCurrentDayRange(period, range.from), [period, range.from])

    useEffect(() => {
        if (
            (period === PeriodEnum.DAILY && !isCurrentDayRange) ||
            period === PeriodEnum.MONTHLY ||
            period === PeriodEnum.WEEKLY
        ) {
            getMetricsWithParams({
                interval: ['1m', '30m'].includes(metricsInterval) ? '1d' : metricsInterval,
                range: getWidgetRange(range, period),
                targets: [metricTargetsEnum.subscriptionPrices],
                filters: filters,
            })
        } else {
            setData([])
        }
    }, [filters, getMetricsWithParams, isCurrentDayRange, metricsInterval, period, range, setData])

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
            if (isCurrentDayRange && typeof currentDayEuroConsumption === 'number') {
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
