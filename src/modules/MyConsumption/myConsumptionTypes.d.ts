import { IEnedisSgeConsent, IEnphaseConsent } from 'src/modules/Consents/Consents.d'
import { metricTargetType } from 'src/modules/Metrics/Metrics'

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
 * Period type enum.
 */
export enum PeriodEnum {
    /**
     * Daily period.
     */
    DAILY = 'daily',
    /**
     * Weekly period.
     */
    WEEKLY = 'weekly',
    /**
     * Monthly period.
     */
    MONTHLY = 'monthly',
    /**
     * Yearly period.
     */
    YEARLY = 'yearly',
}

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
    period: PeriodEnum
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
    removeTargets: () => void
    /**
     * AddTarget.
     */
    addTargets: (targets: metricTargetType[]) => void
    /**
     * If hidePmax exists Pmax button will be disabled.
     */
    hidePmax: boolean
    /**
     * Indicates which button is active.
     */
    activeButton: string
}

/**
 * Interface for EurosConsumptionButtonTogglerProps.
 */
export type EurosConsumptionButtonTogglerProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * Handler when clicking on EuroButton.
         */
        onEuroClick: () => void
        /**
         * Handler when clicking on ConsumptionButton.
         */
        onConsumptionClick: () => void
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
 * Interface for SwitchIdleConsumptionProps.
 */
export type SwitchIdleConsumptionProps =
    // eslint-disable-next-line jsdoc/require-jsdoc
    {
        /**
         * RemoveIdleTarget.
         */
        removeIdleTarget: () => void
        /**
         * AddIdleTarget.
         */
        addIdleTarget: () => void
        /**
         * Value of idleConsumptionButton.
         */
        isIdleConsumptionButtonSelected: boolean
        /**
         * Indicate if IdleConsumptionTogglButton is disabled.
         */
        isIdleConsumptionButtonDisabled?: boolean
        /**
         * Callback when clicking the infoIcon on disabled idleConsumption button.
         */
        onClickIdleConsumptionDisabledInfoIcon: () => void
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
    // eslint-disable-next-line jsdoc/require-jsdoc
    enphaseOff?: boolean
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
    'enedisSgeConsent' | 'hasMissingHousingContracts' | 'enphaseConsent'
    // eslint-disable-next-line jsdoc/require-jsdoc
> & {
    /**
     * Boolean indicating if proudction consent is off.
     */
    isProductionConsentOff?: boolean
    /**
     * Boolean indicating if production consent is in-progress.
     */
    isProductionConsentLoadingInProgress?: boolean
}

/**
 * Type for getChartSpecifities function return.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type getChartSpecifitiesType = ApexYAxis & { label?: string }
