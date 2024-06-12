import { useCallback, useState } from 'react'
import {
    CurrentDayConsumptionType,
    CurrentDayEuroConsumptionType,
    metricTargetsEnum,
} from 'src/modules/Metrics/Metrics.d'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'
import { utcToZonedTime } from 'date-fns-tz'
import {
    formatMetricFilter,
    getDateWithoutTimezoneOffset,
} from 'src/modules/MyConsumption/utils/MyConsumptionFunctions'
import { startOfDay } from 'date-fns'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { computeWidgetAssets } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { consumptionValueUnitType, euroValueUnitType } from 'src/modules/MyConsumption/components/Widget/Widget'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'

/**
 * Function to get the current day consumption API.
 *
 * @param housingId The housing id.
 * @returns The current day consumption API.
 */
export const GET_CURRENT_DAY_CONSUMPTION_API = (housingId: number) =>
    `${API_RESOURCES_URL}/current-day-consumption/${housingId}`

/**
 * Function to get the current day euro consumption API.
 *
 * @param housingId The housing id.
 * @returns The current day euro consumption API.
 */
export const GET_CURRENT_DAY_EURO_CONSUMPTION_API = (housingId: number) =>
    `${API_RESOURCES_URL}/current-day-euro-consumption/${housingId}`

/**
 * Hook used to get the current day consumption.
 *
 * @param housingId Housing id.
 * @returns Current day consumption hook.
 */
export const useCurrentDayConsumption = (housingId?: number) => {
    const [currentDayConsumption, setCurrentDayConsumption] = useState<consumptionValueUnitType>({
        value: 0,
        unit: 'Wh',
    })
    const [currentDayAutoConsumption, setCurrentDayAutoConsumption] = useState<consumptionValueUnitType>({
        value: 0,
        unit: 'Wh',
    })
    const [currentDayEuroConsumption, setCurrentDayEuroConsumption] = useState<euroValueUnitType>({
        value: 0,
        unit: '€',
    })
    const [isGetCurrentDayTotalValuesLoading, setIsGetCurrentDayTotalValuesLoading] = useState(false)
    const { getMetricsWithParams } = useMetrics()

    const getCurrentDayConsumptionAndAutoConsumption = useCallback(async () => {
        if (!housingId)
            return {
                consumption: null,
                autoConsumption: null,
            }
        try {
            const { data: consumption, status } = await axios.get<CurrentDayConsumptionType>(
                GET_CURRENT_DAY_CONSUMPTION_API(housingId),
            )
            if (status === 200) {
                return {
                    consumption: consumption.consumption,
                    autoConsumption: consumption.autoConsumption,
                }
            }
        } catch (error) {
        } finally {
            return {
                consumption: null,
                autoConsumption: null,
            }
        }
    }, [housingId])

    const getCurrentDayEuroConsumption = useCallback(async () => {
        if (!housingId)
            return {
                euroConsumption: null,
            }
        try {
            const { data: euroConsumption, status } = await axios.get<CurrentDayEuroConsumptionType>(
                GET_CURRENT_DAY_EURO_CONSUMPTION_API(housingId),
            )
            if (status === 200) {
                return {
                    euroConsumption: euroConsumption.euroConsumption,
                }
            }
        } catch (error) {
        } finally {
            return {
                euroConsumption: null,
            }
        }
    }, [housingId])

    const getCurrentDayTotalValuesFromMetricsData = useCallback(
        async (targetsToGetDataFor: metricTargetsEnum[]) => {
            if (!housingId) return
            try {
                const currentTime = utcToZonedTime(new Date(), 'Europe/Paris')
                const todayRange = {
                    from: getDateWithoutTimezoneOffset(startOfDay(currentTime)),
                    to: getDateWithoutTimezoneOffset(currentTime),
                }
                const data = await getMetricsWithParams(
                    {
                        interval: '1m',
                        range: todayRange,
                        targets: targetsToGetDataFor,
                        filters: formatMetricFilter(housingId) ?? [],
                    },
                    false,
                )

                targetsToGetDataFor.forEach((target) => {
                    switch (target) {
                        case metricTargetsEnum.consumption:
                            setCurrentDayConsumption(
                                computeWidgetAssets(data, metricTargetsEnum.consumption) as consumptionValueUnitType,
                            )
                            break
                        case metricTargetsEnum.autoconsumption:
                            setCurrentDayAutoConsumption(
                                computeWidgetAssets(
                                    data,
                                    metricTargetsEnum.autoconsumption,
                                ) as consumptionValueUnitType,
                            )
                            break
                        case metricTargetsEnum.eurosConsumption:
                            setCurrentDayEuroConsumption(
                                computeWidgetAssets(data, metricTargetsEnum.eurosConsumption) as euroValueUnitType,
                            )
                            break
                    }
                })
            } catch (error) {}
        },
        [getMetricsWithParams, housingId],
    )

    const getCurrentDayTotalValues = useCallback(
        async (targetsToCalculateTotalValuesFor: /**
         * The targets to get the current day total values for.
         */
        {
            /**
             * If true, get the current consumption value.
             */
            [metricTargetsEnum.consumption]?: boolean
            /**
             * If true, get the current autoconsumption value.
             */
            [metricTargetsEnum.autoconsumption]?: boolean
            /**
             * If true, get the current eurosConsumption value.
             */
            [metricTargetsEnum.eurosConsumption]?: boolean
        }) => {
            if (!housingId) return
            setIsGetCurrentDayTotalValuesLoading(true)
            const isCalculateTotalConsumption = targetsToCalculateTotalValuesFor[metricTargetsEnum.consumption]
            const isCalculateTotalAutoConsumption = targetsToCalculateTotalValuesFor[metricTargetsEnum.autoconsumption]
            const isCalculateTotalEuroConsumption = targetsToCalculateTotalValuesFor[metricTargetsEnum.eurosConsumption]
            let targetsToGetDataFor: metricTargetsEnum[] = []

            // 1) get currentDayConsumption and autoconsumption with specific endpoint.
            if (isCalculateTotalConsumption || isCalculateTotalAutoConsumption) {
                const { consumption, autoConsumption } = await getCurrentDayConsumptionAndAutoConsumption()
                if (typeof consumption === 'number') {
                    setCurrentDayConsumption(consumptionWattUnitConversion(consumption))
                } else {
                    targetsToGetDataFor.push(metricTargetsEnum.consumption)
                }
                if (typeof autoConsumption === 'number') {
                    setCurrentDayAutoConsumption(consumptionWattUnitConversion(autoConsumption))
                } else {
                    targetsToGetDataFor.push(metricTargetsEnum.autoconsumption)
                }
            }

            // 2) get currentDayEuroConsumption with specific endpoint.
            if (isCalculateTotalEuroConsumption) {
                const { euroConsumption } = await getCurrentDayEuroConsumption()
                if (typeof euroConsumption === 'number') {
                    setCurrentDayEuroConsumption({
                        value: euroConsumption,
                        unit: '€',
                    })
                } else {
                    targetsToGetDataFor.push(metricTargetsEnum.eurosConsumption)
                }
            }

            // 3) get currentDayvalues with query.
            if (targetsToGetDataFor.length) {
                await getCurrentDayTotalValuesFromMetricsData(targetsToGetDataFor)
            }

            setIsGetCurrentDayTotalValuesLoading(false)
        },
        [
            getCurrentDayConsumptionAndAutoConsumption,
            getCurrentDayEuroConsumption,
            getCurrentDayTotalValuesFromMetricsData,
            housingId,
        ],
    )

    return {
        currentDayConsumption,
        currentDayAutoConsumption,
        currentDayEuroConsumption,
        isGetCurrentDayTotalValuesLoading,
        getCurrentDayTotalValues,
    }
}
