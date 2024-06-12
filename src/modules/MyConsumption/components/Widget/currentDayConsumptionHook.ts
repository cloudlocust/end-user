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
            // eslint-disable-next-line sonarjs/cognitive-complexity
        }) => {
            if (!housingId) return
            const isCalculateTotalConsumption = targetsToCalculateTotalValuesFor[metricTargetsEnum.consumption]
            const isCalculateTotalAutoConsumption = targetsToCalculateTotalValuesFor[metricTargetsEnum.autoconsumption]
            const isCalculateTotalEuroConsumption = targetsToCalculateTotalValuesFor[metricTargetsEnum.eurosConsumption]

            setIsGetCurrentDayTotalValuesLoading(true)

            let currentDayTotalValues: Partial<Record<metricTargetsEnum, number | null>> = {
                [metricTargetsEnum.consumption]: null,
                [metricTargetsEnum.autoconsumption]: null,
                [metricTargetsEnum.eurosConsumption]: null,
            }

            // 1) get currentDayConsumption and autoconsumption with specific endpoint.
            if (isCalculateTotalConsumption || isCalculateTotalAutoConsumption) {
                try {
                    const { data: consumption, status } = await axios.get<CurrentDayConsumptionType>(
                        GET_CURRENT_DAY_CONSUMPTION_API(housingId),
                    )
                    if (status === 200) {
                        if (isCalculateTotalConsumption) {
                            currentDayTotalValues[metricTargetsEnum.consumption] = consumption.consumption
                        }
                        if (isCalculateTotalAutoConsumption) {
                            currentDayTotalValues[metricTargetsEnum.autoconsumption] = consumption.autoConsumption
                        }
                    }
                } catch (error) {}
            }

            // 2) get currentDayEuroConsumption with specific endpoint.
            if (isCalculateTotalEuroConsumption) {
                try {
                    const { data: euroConsumption, status } = await axios.get<CurrentDayEuroConsumptionType>(
                        GET_CURRENT_DAY_EURO_CONSUMPTION_API(housingId),
                    )
                    if (status === 200) {
                        currentDayTotalValues[metricTargetsEnum.eurosConsumption] = euroConsumption.euroConsumption
                    }
                } catch (error) {}
            }

            // 3) get currentDayvalues with query.
            let targetsToGetDataFor: metricTargetsEnum[] = []

            if (isCalculateTotalConsumption) {
                if (typeof currentDayTotalValues[metricTargetsEnum.consumption] === 'number') {
                    setCurrentDayConsumption(
                        consumptionWattUnitConversion(currentDayTotalValues[metricTargetsEnum.consumption]!),
                    )
                } else {
                    targetsToGetDataFor.push(metricTargetsEnum.consumption)
                }
            }

            if (isCalculateTotalAutoConsumption) {
                if (typeof currentDayTotalValues[metricTargetsEnum.autoconsumption] === 'number') {
                    setCurrentDayAutoConsumption(
                        consumptionWattUnitConversion(currentDayTotalValues[metricTargetsEnum.autoconsumption]!),
                    )
                } else {
                    targetsToGetDataFor.push(metricTargetsEnum.autoconsumption)
                }
            }

            if (isCalculateTotalEuroConsumption) {
                if (typeof currentDayTotalValues[metricTargetsEnum.eurosConsumption] === 'number') {
                    setCurrentDayEuroConsumption({
                        value: currentDayTotalValues[metricTargetsEnum.eurosConsumption]!,
                        unit: '€',
                    })
                } else {
                    targetsToGetDataFor.push(metricTargetsEnum.eurosConsumption)
                }
            }

            if (targetsToGetDataFor.length) {
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
                                    computeWidgetAssets(
                                        data,
                                        metricTargetsEnum.consumption,
                                    ) as consumptionValueUnitType,
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
            }

            setIsGetCurrentDayTotalValuesLoading(false)
        },
        [getMetricsWithParams, housingId],
    )

    return {
        currentDayConsumption,
        currentDayAutoConsumption,
        currentDayEuroConsumption,
        isGetCurrentDayTotalValuesLoading,
        getCurrentDayTotalValues,
    }
}
