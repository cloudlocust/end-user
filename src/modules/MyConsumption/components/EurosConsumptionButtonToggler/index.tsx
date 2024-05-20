import { useMemo, useEffect, useRef } from 'react'
import { useTheme, alpha } from '@mui/material'
import { ButtonsSwitcher } from 'src/modules/shared/ButtonsSwitcher'
import { useCurrentDayConsumption } from 'src/modules/MyConsumption/components/Widget/currentDayConsumptionHook'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { utcToZonedTime } from 'date-fns-tz'
import {
    computeTotalEuros,
    getWidgetRange,
    computeTotalConsumption,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { EurosConsumptionButtonTogglerProps } from 'src/modules/MyConsumption/components/EurosConsumptionButtonToggler/EurosConsumptionButtonToggler.types'

const emptyValueUnit = { value: 0, unit: '' }
const parisTimeZone = 'Europe/Paris'

/**
 * EurosConsumptionButtonToggler Component.
 *
 * @param root0 N/A.
 * @param root0.onChange Callback function called when the value changes.
 * @param root0.value The current value.
 * @param root0.period The period for the consumption data.
 * @param root0.range The range for the consumption data.
 * @param root0.filters The filters for the consumption data.
 * @param root0.metricsInterval The interval for the metrics.
 * @param root0.dataMetrics The metrics data.
 * @returns EurosConsumptionButtonToggler Component.
 */
export const EurosConsumptionButtonToggler = ({
    onChange,
    value,
    period,
    range,
    filters,
    metricsInterval,
    dataMetrics,
}: EurosConsumptionButtonTogglerProps) => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { currentDayConsumption, currentDayEuroConsumption, getCurrentDayConsumption, getCurrentDayEuroConsumption } =
        useCurrentDayConsumption(currentHousing?.id)
    const theme = useTheme()

    const { data, setData, setMetricsInterval, setRange } = useMetrics({
        interval: metricsInterval,
        range: getWidgetRange(range, period),
        targets: [
            {
                target: metricTargetsEnum.subscriptionPrices,
                type: 'timeserie',
            },
        ],
        filters: filters,
    })

    const isRangeChanged = useRef(false)

    // When range change, set isRangedChanged
    useEffect(() => {
        isRangeChanged.current = true
    }, [range])

    const isCurrentDayRange = useMemo(
        () =>
            period === 'daily' &&
            utcToZonedTime(new Date(range.from), parisTimeZone).getDate() ===
                utcToZonedTime(new Date(), parisTimeZone).getDate(),
        [period, range.from],
    )

    // get metrics when metricsInterval change.
    useEffect(() => {
        if (!isCurrentDayRange || period === 'monthly' || period === 'yearly') {
            setMetricsInterval(period === 'daily' ? '1d' : metricsInterval)
        } else {
            setData([])
        }
    }, [isCurrentDayRange, metricsInterval, period, range.from, setData, setMetricsInterval])

    // When period or range changes
    useEffect(() => {
        // If period just changed block the call of getMetrics, because period and range changes at the same time, so to avoid two call of getMetrics
        // 1 call when range change and the other when period change, then only focus on when range changes.
        if (isRangeChanged.current && (!isCurrentDayRange || period === 'monthly' || period === 'yearly')) {
            const widgetRange = getWidgetRange(range, period)
            setRange(widgetRange)
            // reset isRangeChanged
            isRangeChanged.current = false
        }
    }, [isCurrentDayRange, period, range, setRange])

    useEffect(() => {
        if (isCurrentDayRange) {
            getCurrentDayConsumption()
            getCurrentDayEuroConsumption()
        }
    }, [getCurrentDayConsumption, getCurrentDayEuroConsumption, isCurrentDayRange])

    /**
     * Calculates the total consumption based on the additional metrics data.
     * If `isTotalsOnChartTooltipDisplayed` is true and `dataMetrics` has items,
     * the total consumption is computed using the `computeTotalConsumption` function.
     * Otherwise, it returns undefined.
     *
     * @param dataMetrics - The additional metrics data used to calculate the total consumption.
     * @param isTotalsOnChartTooltipDisplayed - A flag indicating whether to display the total consumption on the chart tooltip.
     * @returns The total consumption or undefined.
     */
    const totalConsumption = useMemo(() => {
        if (currentDayConsumption !== null) {
            return consumptionWattUnitConversion(currentDayConsumption)
        }
        if (dataMetrics.length) return computeTotalConsumption(dataMetrics)
    }, [dataMetrics, currentDayConsumption])

    /**
     * Calculates the total cost in euros based on the additional metrics data.
     * If isTotalsOnChartTooltipDisplayed is true and dataMetrics has at least one item,
     * the total cost is computed using the computeTotalEuros function.
     * Otherwise, the total cost is undefined.
     *
     * @param dataMetrics - The additional metrics data used to calculate the total cost.
     * @param isTotalsOnChartTooltipDisplayed - A flag indicating whether to display the total cost on the chart tooltip.
     * @returns The total cost in euros or undefined.
     */
    const totalEuroCost: any = useMemo(() => {
        if (currentDayEuroConsumption === null && !dataMetrics.length) return undefined
        const totalSubscription = data.length
            ? computeTotalEuros(data, metricTargetsEnum.subscriptionPrices)
            : emptyValueUnit

        if (currentDayEuroConsumption !== null)
            return {
                ...totalSubscription,
                value: Number((currentDayEuroConsumption + totalSubscription.value).toFixed(2)),
            }
        const totalEuros = computeTotalEuros(dataMetrics)
        return {
            ...totalEuros,
            value: Number((totalEuros.value + totalSubscription.value).toFixed(2)),
        }
    }, [dataMetrics, currentDayEuroConsumption, data])

    const items = [
        {
            label: totalConsumption ? `${totalConsumption.value} ${totalConsumption.unit}` : 'N/A',
            value: 'consumption',
        },
        {
            label: totalEuroCost ? `${totalEuroCost.value} ${totalEuroCost.unit}` : 'N/A',
            value: 'eurosConsumption',
        },
    ]
    const activeButtonStyle = {
        color: theme.palette.common.white,
        backgroundColor: '#039DE0',
        boxShadow: `0px 2px 4px 0px ${alpha(theme.palette.primary.dark, 0.2)}, 0px 1px 10px 0px ${alpha(
            theme.palette.primary.dark,
            0.12,
        )}, 0px 4px 5px 0px ${alpha(theme.palette.primary.dark, 0.14)}`,
        zIndex: 2,
        cursor: 'default',
        borderRadius: '1px',
        '&:hover': {
            backgroundColor: '#039DE0',
        },
    }

    const disabledButtonStyle = {
        cursor: 'not-allowed !important',
        pointerEvents: 'initial !important',
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    }
    if (!totalConsumption || !totalEuroCost) return null
    return (
        <ButtonsSwitcher
            buttonsSwitcherParams={items.map((item) => ({
                buttonText: item.label,
                /**
                 * Handle click event.
                 *
                 * @returns Void.
                 */
                clickHandler: () => onChange(item.value === 'consumption'),
                isSelected: (!value && item.value === 'consumption') || (value && item.value === 'eurosConsumption'),
                isDisabled: item.value === 'eurosConsumption' && period === 'daily',
            }))}
            buttonProps={(isSelected, isDisabled) => ({
                sx: {
                    boxShadow: 'none',
                    padding: '8px 16px',
                    color: theme.palette.grey['500'],
                    fontSize: '12px !important',
                    fontWeight: 400,
                    fontHeight: 'normal',
                    fontStyle: 'normal',
                    fontFamily: 'Poppins',
                    zIndex: 1,
                    height: 24,
                    maxWidth: '110px',
                    '&:hover': {
                        backgroundColor: theme.palette.grey[200],
                    },
                    ...(isSelected && activeButtonStyle),
                    ...(isDisabled && disabledButtonStyle),
                },
            })}
            containerProps={{
                style: { height: 'inherit', borderRadius: 3 },
            }}
        />
    )
}

export default EurosConsumptionButtonToggler
