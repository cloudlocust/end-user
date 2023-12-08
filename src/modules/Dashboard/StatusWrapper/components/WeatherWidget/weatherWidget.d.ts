import { NrlinkMetric } from 'src/modules/Dashboard/StatusWrapper/nrlinkPower'

/**
 * Represents the props for the WeatherWidget component.
 */
export interface WeatherWidgetProps {
    /**
     * Indicates whether the loading is in progress..
     */
    isNrlinkPowerLoading: boolean
    /**
     * Last temperature data.
     */
    lastTemperatureData?: NrlinkMetric
}
