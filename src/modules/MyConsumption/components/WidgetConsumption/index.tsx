import { useContext, useMemo } from 'react'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps } from 'src/modules/MyConsumption/components/Widget/Widget'
import { WidgetItem } from 'src/modules/MyConsumption/components/WidgetItem'
import { computeTotalOfAllConsumptions } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
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

    const currentRangeConsumptionData = useMemo(
        () => getMetricsWidgetsData([props.targetList[0], metricTargetsEnum.autoconsumption]),
        [getMetricsWidgetsData, props.targetList],
    )

    const oldRangeConsumptionData = useMemo(
        () => getMetricsWidgetsData([props.targetList[0], metricTargetsEnum.autoconsumption], true),
        [getMetricsWidgetsData, props.targetList],
    )

    const { unit, value } = useMemo(
        // we should wait for all metrics needed to be loaded, in this case, 2 (consumption and autoconsumption)
        () =>
            currentRangeConsumptionData.length < 2
                ? emptyValueUnit
                : computeTotalOfAllConsumptions(currentRangeConsumptionData),
        [currentRangeConsumptionData],
    )

    const { value: oldValue } = useMemo(
        // we should wait for all metrics needed to be loaded, in this case, 2 (consumption and autoconsumption)
        () =>
            oldRangeConsumptionData.length < 2
                ? emptyValueUnit
                : computeTotalOfAllConsumptions(oldRangeConsumptionData),
        [oldRangeConsumptionData],
    )

    const percentageChange = useMemo(
        () => computePercentageChange(oldValue as number, value as number),
        [value, oldValue],
    )

    return (
        <Widget {...props}>
            <WidgetItem
                target={props.targetList[0]}
                title={'Consommation Totale'}
                value={value}
                unit={unit}
                percentageChange={percentageChange}
            />
        </Widget>
    )
}

export default WidgetConsumption
