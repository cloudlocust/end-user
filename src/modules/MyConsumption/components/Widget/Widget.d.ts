import { metricTargetType, metricRangeType, metricIntervalType, metricFiltersType } from 'src/modules/Metrics/Metrics.d'
import { periodType } from 'src/modules/MyConsumption/myConsumptionTypes'

/**
 * Widget Title type.
 */
export type widgetTitleType =
    | 'Consommation Totale'
    | 'Puissance Maximale'
    | 'Coût Total'
    | 'Production Totale'
    | 'Injectée'
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
    infoIcons?: Record<string, JSX.Element | null>
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
     * Targets of the Widget.
     */
    targets: metricTargetType[]
    /**
     * Period of the Widget.
     */
    period: periodType
    /**
     * Boolean for Enphase Consent is inactive.
     */
    enphaseOff?: boolean
    /**
     * Children of the Widget.
     */
    children?: ReactNode | ReactElement
    /**
     * Position of the children.
     */
    childrenPosition?: 'top' | 'bottom'
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
        enphaseOff?: boolean
        /**
         * EnedisSgeConsent is inactive.
         */
        enedisSgeOff?: boolean
    }

/**
 * Object containing data and informations about the targets of the widget.
 */
export type targetsInfosType = Record<
    /**
     * The target name.
     */
    string,
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * The unit of the target.
         */
        unit: string
        /**
         * The target value.
         */
        value: string | number
        /**
         * The target old value.
         */
        oldValue: string | number
        /**
         * The percentage of change in target value.
         */
        percentageChange: number
    }
>
