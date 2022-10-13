import { IMetric } from 'src/modules/Metrics/Metrics.d'

/**
 * Widget Title type.
 */
export type widgetTitleType =
    | 'Consommation Totale'
    | 'Puissance Maximale'
    | 'Température Intérieure'
    | 'Température Extérieure'
    | 'Coût Total'

/**
 * Total Consumption Units types.
 */
export type totalConsumptionUnits = 'Wh' | 'kWh' | 'MWh'

/**
 * Widget Props.
 */
export interface IWidgetProps {
    /**
     * Metrics loading state.
     */
    isMetricsLoading: boolean
    /**
     * Widget unit.
     */
    unit: 'Wh' | 'kWh' | 'MWh' | 'VA' | 'kVa' | '°C' | '€'
    /**
     * Widget value.
     */
    value: number
    /**
     * Widget title.
     */
    title: widgetTitleType
    /**
     * Widget infoIcon.
     */
    infoIcon?: JSX.Element
}

/**
 * WidgetList Props.
 */
export interface IWidgetListProps {
    /**
     * Metrics data.
     */
    data: IMetric[]
    /**
     * Loading state from useMetrics hook.
     */
    isMetricsLoading: boolean
    /**
     * HasMissingHousingContracts come from metrics when euroConsumption, responsible for showing an info icon in EuroWidget.
     */
    hasMissingHousingContracts: boolean | null
}
