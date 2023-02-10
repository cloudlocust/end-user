import { useContext } from 'react'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'

/**
 * Custom hook to use WidgetsMetricsContext.
 *
 * @returns WidgetsMetricsContext.
 */
export const useWidgetsMetricsContext = () => {
    return useContext(ConsumptionWidgetsMetricsContext)
}
