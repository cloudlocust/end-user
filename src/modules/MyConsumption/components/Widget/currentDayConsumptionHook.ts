import { useCallback, useState } from 'react'
import { CurrentDayConsumptionType, CurrentDayEuroConsumptionType } from 'src/modules/Metrics/Metrics'
import { axios } from 'src/common/react-platform-components'
import { API_RESOURCES_URL } from 'src/configs'

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
    const [currentDayConsumption, setCurrentDayConsumption] = useState<number | null | undefined>(undefined)
    const [currentDayAutoConsumption, setCurrentDayAutoConsumption] = useState<number | null | undefined>(undefined)
    const [currentDayEuroConsumption, setCurrentDayEuroConsumption] = useState<number | null | undefined>(undefined)
    const [isGetCurrentDayConsumptionLoading, setIsGetCurrentDayConsumptionLoading] = useState(false)
    const [isGetCurrentDayEuroConsumptionLoading, setIsGetCurrentDayEuroConsumptionLoading] = useState(false)

    const getCurrentDayConsumption = useCallback(async () => {
        if (!housingId) return
        setIsGetCurrentDayConsumptionLoading(true)
        try {
            const { data: consumption, status } = await axios.get<CurrentDayConsumptionType>(
                GET_CURRENT_DAY_CONSUMPTION_API(housingId),
            )
            if (status === 200) {
                setCurrentDayConsumption(consumption.consumption)
                setCurrentDayAutoConsumption(consumption.autoConsumption)
            }
        } catch (error) {
        } finally {
            setIsGetCurrentDayConsumptionLoading(false)
        }
    }, [housingId])

    const getCurrentDayEuroConsumption = useCallback(async () => {
        if (!housingId) return
        setIsGetCurrentDayEuroConsumptionLoading(true)
        try {
            const { data: euroConsumption, status } = await axios.get<CurrentDayEuroConsumptionType>(
                GET_CURRENT_DAY_EURO_CONSUMPTION_API(housingId),
            )
            if (status === 200) {
                setCurrentDayEuroConsumption(euroConsumption.euroConsumption)
            }
        } catch (error) {
        } finally {
            setIsGetCurrentDayEuroConsumptionLoading(false)
        }
    }, [housingId])

    return {
        currentDayConsumption,
        currentDayAutoConsumption,
        currentDayEuroConsumption,
        isGetCurrentDayConsumptionLoading,
        isGetCurrentDayEuroConsumptionLoading,
        getCurrentDayConsumption,
        getCurrentDayEuroConsumption,
    }
}
