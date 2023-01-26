import { IEnphaseConsent } from 'src/modules/Consents/Consents.d'
import { metricTargetType, metricRangeType, metricIntervalType, metricFiltersType } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

/**
 * Widget Title type.
 */
export type widgetTitleType =
    | 'Consommation Totale'
    | 'Puissance Maximale'
    | 'Température Intérieure'
    | 'Température Extérieure'
    | 'Coût Total'
    | 'Production Totale'

/**
 * Total Consumption Units types.
 */
export type totalConsumptionUnits = 'Wh' | 'kWh' | 'MWh'

/**
 * WidgetList Props.
 */
export interface IWidgetProps {
    /**
     * HasMissingHousingContracts come from metrics when euroConsumption, responsible for showing an info icon in EuroWidget.
     */
    hasMissingHousingContracts: boolean | null
    /**
     * Metrics range.
     */
    range: metricRangeType
    /**
     * Metrics interval.
     */
    metricsInterval: metricIntervalType
    /**
     * Metrics filters.
     */
    filters: metricFiltersType
    /**
     * Target of the Widget.
     */
    target: metricTargetType
    /**
     * Period of the Widget.
     */
    period: periodType
    /**
     * Enphhase consent.
     */
    enphaseConsent?: IEnphaseConsent | null
}
