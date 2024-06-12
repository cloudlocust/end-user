import { useMemo, useEffect, useRef } from 'react'
import { useTheme, alpha } from '@mui/material'
import { ButtonsSwitcher } from 'src/modules/shared/ButtonsSwitcher'
import { useCurrentDayConsumption } from 'src/modules/MyConsumption/components/Widget/currentDayConsumptionHook'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import {
    getWidgetRange,
    checkIfItIsCurrentDayRange,
    computeWidgetAssets,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { useMetrics } from 'src/modules/Metrics/metricsHook'
import { EurosConsumptionButtonTogglerProps } from 'src/modules/MyConsumption/components/EurosConsumptionButtonToggler/EurosConsumptionButtonToggler.types'
import { PeriodEnum } from 'src/modules/MyConsumption/myConsumptionTypes.d'

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
 * @returns EurosConsumptionButtonToggler Component.
 */
export const EurosConsumptionButtonToggler = ({
    onChange,
    value,
    period,
    range,
    filters,
    metricsInterval,
}: EurosConsumptionButtonTogglerProps) => {
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const { currentDayConsumption, currentDayEuroConsumption, getCurrentDayTotalValues } = useCurrentDayConsumption(
        currentHousing?.id,
    )
    const theme = useTheme()

    const { data, setData, setMetricsInterval, setRange } = useMetrics(
        {
            interval: metricsInterval,
            range: getWidgetRange(range, period),
            targets: [
                {
                    target: metricTargetsEnum.subscriptionPrices,
                    type: 'timeserie',
                },
            ],
            filters: filters,
        },
        { immediate: true },
    )

    const isRangeChanged = useRef(false)

    // When range change, set isRangedChanged
    useEffect(() => {
        isRangeChanged.current = true
    }, [range])

    const isCurrentDayRange = useMemo(() => checkIfItIsCurrentDayRange(period, range.from), [period, range.from])

    // get metrics when metricsInterval change.
    useEffect(() => {
        if (!isCurrentDayRange) {
            setMetricsInterval(period === 'daily' ? '1d' : metricsInterval)
        } else {
            setData([])
        }
    }, [isCurrentDayRange, metricsInterval, period, setData, setMetricsInterval])

    // When period or range changes
    useEffect(() => {
        // If period just changed block the call of getMetrics, because period and range changes at the same time, so to avoid two call of getMetrics
        // 1 call when range change and the other when period change, then only focus on when range changes.
        if (isRangeChanged.current && !isCurrentDayRange) {
            const widgetRange = getWidgetRange(range, period)
            setRange(widgetRange)
            // reset isRangeChanged
            isRangeChanged.current = false
        }
    }, [isCurrentDayRange, period, range, setRange])

    useEffect(() => {
        if (isCurrentDayRange) {
            getCurrentDayTotalValues({
                [metricTargetsEnum.consumption]: true,
                [metricTargetsEnum.eurosConsumption]: true,
            })
        }
    }, [getCurrentDayTotalValues, isCurrentDayRange])

    const items = useMemo(() => {
        let totalEuroCost = currentDayEuroConsumption.value

        if (period !== PeriodEnum.DAILY && data?.length) {
            const { value: subscriptionEuroValue } = computeWidgetAssets(data, metricTargetsEnum.subscriptionPrices)
            totalEuroCost += subscriptionEuroValue
        }

        return [
            {
                label: `${Number(currentDayConsumption.value.toFixed(2))} ${currentDayConsumption.unit}`,
                value: 'consumption',
            },
            {
                label: `${Number(totalEuroCost.toFixed(2))} €`,
                value: 'eurosConsumption',
            },
        ]
    }, [currentDayConsumption.unit, currentDayConsumption.value, currentDayEuroConsumption.value, data, period])

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

    if (!currentDayConsumption || !currentDayEuroConsumption) return null

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
