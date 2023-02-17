import convert from 'convert-units'
import React, { useContext, useMemo } from 'react'
import { IMetric, metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { WidgetItem } from 'src/modules/MyConsumption/components/WidgetItem'
import {
    computeTotalConsumption,
    computeTotalAutoconsumption,
} from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'

const emptyValueUnit = { value: 0, unit: '' }

/**
 * WidgetConsumption Component.
 *
 * @param props Same Props as Widget Component.
 * @returns WidgetConsumption Component.
 */
const WidgetConsumption = (props: IWidgetProps) => {
    const { getMetricsWidgetsData } = useContext(ConsumptionWidgetsMetricsContext)

    const currentHelpfulMetrics = useMemo(
        () => getMetricsWidgetsData([props.target, metricTargetsEnum.autoconsumption]),
        [props.target, getMetricsWidgetsData],
    )

    const oldHelpfulMetrics = useMemo(
        () => getMetricsWidgetsData([props.target, metricTargetsEnum.autoconsumption], true),
        [props.target, getMetricsWidgetsData],
    )

    /**
     * Compute the total consumption of the current and old metrics.
     *
     * @param data The current metrics.
     * @returns The total consumption.
     */
    const computeConsumptionTotal = (data: IMetric[]) => {
        const { value: consumptionValue, unit: consumptionUnit } = computeTotalConsumption(data)
        const { value: AutoConsumptionValue, unit: AutoConsumptionUnit } = computeTotalAutoconsumption(data)

        const totalProduction =
            convert(consumptionValue).from(consumptionUnit).to('Wh') +
            convert(AutoConsumptionValue).from(AutoConsumptionUnit).to('Wh')

        return consumptionWattUnitConversion(totalProduction)
    }

    const { unit, value } = useMemo(
        // we should wait for all metrics needed to be loaded, in this case, 2 (consumption and autoconsumption)
        () => (currentHelpfulMetrics.length < 2 ? emptyValueUnit : computeConsumptionTotal(currentHelpfulMetrics)),
        [currentHelpfulMetrics],
    )

    const { value: oldValue } = useMemo(
        // we should wait for all metrics needed to be loaded, in this case, 2 (consumption and autoconsumption)
        () => (oldHelpfulMetrics.length < 2 ? emptyValueUnit : computeConsumptionTotal(oldHelpfulMetrics)),
        [oldHelpfulMetrics],
    )

    const percentageChange = useMemo(
        () => computePercentageChange(oldValue as number, value as number),
        [value, oldValue],
    )

    return (
        <Widget {...props}>
            <WidgetItem
                target={props.target}
                title={'Consommation Totale'}
                value={value}
                unit={unit}
                percentageChange={percentageChange}
            />
        </Widget>
    )
}

export default WidgetConsumption
