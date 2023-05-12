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
    | 'Autoconsommation'
    | 'Achetée'
    | 'Consommation de Veille'

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
    infoIcon?: JSX.Element | null
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
     * Children of the Widget.
     */
    children?: ReactNode | ReactElement
}

/**
 * Params of getWidgetInfoIcon Function that returns the Icon element used in the widget.
 */
export type getWidgetInfoIconParamsType =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * WidgetTarget Target of the widget.
         */
        widgetTarget: metricTargetType
        /**
         * HasMissingContracts Flag HasMissingContracts, that'll influence which widget icon will be shown.
         */
        hasMissingContracts: boolean | null
        /**
         * Enphase Consent is inactive.
         */
        enphaseOff?: boolean | null
        /**
         * EnedisSgeConsent is inactive.
         */
        enedisSgeOff?: boolean | null
    }
