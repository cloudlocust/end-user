import { IEnedisSgeConsent, IEnphaseConsent } from 'src/modules/Consents/Consents.d'

/**
 * Interface MyConsumptionPeriod.
 */
export interface IMyConsumptionPeriod {
    /**
     * SetMetricInterval function.
     */
    setMetricsInterval: (interval: metricIntervals) => void
    /**
     * SetRange function.
     */
    setRange: (range: metricRangeType) => void
    /**
     * SetPeriodValue function.
     */
    setPeriod: (period: periodValue) => void
    /**
     * Period to range.
     */
    range: metricRangeType
}
/**
 * Range value type.
 *
 */
export type periodType = 'daily' | 'weekly' | 'monthly' | 'yearly'
/**
 * Interface ISelectMeters.
 */
interface ISelectMeters {
    /**
     * List of meters.
     */
    metersList: IMeter[]
    /**
     * Handling function when we change values.
     */
    handleOnChange: (event: SelectChangeEvent, setSelectedMeter: (value: string) => void) => void
    /**
     * Color for input: borders and svg.
     */
    inputColor?: string
    /**
     * Text color.
     */
    inputTextColor?: string
}
/**
 * Interface IMyConsumptionCalendar.
 */
export interface IMyConsumptionDatePicker {
    /**
     * Period range.
     */
    period: periodValueType
    /**
     * SetRange function.
     */
    setRange: (range: metricRangeType) => void
    /**
     * Period for range.
     */
    range: metricRangeType
    /**
     * Callback function that overwrites the default handleDateChange for DatePicker used in MyConsumption modules.
     * Date represents the new Date picked on the DatePicker.
     */
    onDatePickerChange?: (newDate: Date) => void
    /**
     * Represent the maximum date in the DatePicker.
     */
    maxDate?: Date
}

/**
 * Period type for dateFns library when using sub, add for a certain period.
 */
export type dateFnsPeriod = 'seconds' | 'hours' | 'minutes' | 'days' | 'weeks' | 'months' | 'years'
/**
 * Type for views in MobileDatePicker.
 */
export type ViewsType = 'day' | 'month' | 'year'
/**
 * Interface for TargetButtonGroup.
 */
interface ITargetMenuGroup {
    /**
     * RemoveTarget.
     */
    removeTarget: (target: metricTarget) => void
    /**
     * AddTarget.
     */
    addTarget: (target: metricTarget) => void
    /**
     * If hidePmax exists Pmax button will be disabled.
     */
    hidePmax: boolean
}

/**
 * Interface for EurosConsumptionButtonTogglerProps.
 */
export type EurosConsumptionButtonTogglerProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * RemoveTarget.
         */
        removeTarget: (target: metricTarget) => void
        /**
         * AddTarget.
         */
        addTarget: (target: metricTarget) => void
        /**
         * Indicate eurosConsumption or consumption IconButton to be shown.
         */
        showEurosConsumption?: boolean
        /**
         * Indicate if EurosConsumptionButton is disabled.
         */
        disabled?: boolean
    }

/**
 * Represent the type return by apexChartsDataConverter.
 */
export type ApexChartsAxisValuesType =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Represent the yAxisValues for each target, as ApexChartSerie.
         */
        yAxisSeries: ApexAxisChartSeries
        /**
         * Represent the xAxisValues for each target.
         */
        xAxisSeries: number[][]
    }

/**
 * Response Type of request Get hasMissingHousingContract.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type getHasMissingHousingContractsResponse = { hasMissingHousingContracts: boolean }

/**
 * MyConsumptionChart Props.
 */
export interface MyConsumptionChartProps {
    // eslint-disable-next-line jsdoc/require-jsdoc
    data: IMetric[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodType
    // eslint-disable-next-line jsdoc/require-jsdoc
    range: metricRangeType
    // eslint-disable-next-line jsdoc/require-jsdoc
    isStackedEnabled?: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    chartType: 'consumption' | 'production'
    // eslint-disable-next-line jsdoc/require-jsdoc
    chartLabel?: 'Consommation totale' | 'Electricité achetée sur le réseau'
    // eslint-disable-next-line jsdoc/require-jsdoc
    metricsInterval?: metricIntervalType
}

/**
 * ConsumptionChartContainer Props.
 */
export interface ConsumptionChartContainerProps {
    // eslint-disable-next-line jsdoc/require-jsdoc
    period: periodType
    // eslint-disable-next-line jsdoc/require-jsdoc
    range: metricRangeType
    // eslint-disable-next-line jsdoc/require-jsdoc
    metricsInterval: metricIntervalType
    // eslint-disable-next-line jsdoc/require-jsdoc
    filters: metricFiltersType
    // eslint-disable-next-line jsdoc/require-jsdoc
    hasMissingHousingContracts: boolean | null
    // eslint-disable-next-line jsdoc/require-jsdoc
    enphaseConsent?: IEnphaseConsent
    // eslint-disable-next-line jsdoc/require-jsdoc
    enedisSgeConsent?: IEnedisSgeConsent
}

/**
 * Component rendering default contract warning message, when consumption data comes from default contract.
 */
export type DefaultContractWarningProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Indicates if the warning should be shown.
         */
        isShowWarning: Boolean
    }

/**
 * ProductionChartContainer Props.
 */
export type ProductionChartContainerProps = Omit<
    ConsumptionChartContainerProps,
    'enedisSgeConsent' | 'hasMissingHousingContracts'
>

/**
 * Type for getChartSpecifities function return.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type getChartSpecifitiesType = ApexYAxis & { label?: string }
