import { useContext, useEffect, useMemo } from 'react'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { Widget } from 'src/modules/MyConsumption/components/Widget'
import { IWidgetProps, totalConsumptionUnits } from 'src/modules/MyConsumption/components/Widget/Widget'
import { WidgetItem } from 'src/modules/MyConsumption/components/WidgetItem'
import { computeTotalOfAllConsumptions } from 'src/modules/MyConsumption/components/Widget/WidgetFunctions'
import { computePercentageChange } from 'src/modules/Analysis/utils/computationFunctions'
import { ConsumptionWidgetsMetricsContext } from 'src/modules/MyConsumption/components/ConsumptionWidgetsContainer/ConsumptionWidgetsMetricsContext'
import convert from 'convert-units'
import { utcToZonedTime } from 'date-fns-tz'
import { useSelector } from 'react-redux'
import { RootState } from 'src/redux'
import { consumptionWattUnitConversion } from 'src/modules/MyConsumption/utils/unitConversionFunction'
import { useCurrentDayConsumption } from 'src/modules/MyConsumption/components/Widget/currentDayConsumptionHook'

const emptyValueUnit = { value: 0, unit: 'Wh' as totalConsumptionUnits }

/**
 * WidgetConsumption Component.
 *
 * @param props Same Props as Widget Component.
 * @returns WidgetConsumption Component.
 */
const WidgetConsumption = (props: IWidgetProps) => {
    const { getMetricsWidgetsData } = useContext(ConsumptionWidgetsMetricsContext)
    const { currentHousing } = useSelector(({ housingModel }: RootState) => housingModel)
    const {
        currentDayConsumption,
        currentDayAutoConsumption,
        isGetCurrentDayConsumptionLoading,
        getCurrentDayConsumption,
    } = useCurrentDayConsumption(currentHousing?.id)

    const currentRangeConsumptionData = useMemo(
        () => getMetricsWidgetsData([props.targets[0], metricTargetsEnum.autoconsumption]),
        [getMetricsWidgetsData, props.targets],
    )

    const oldRangeConsumptionData = useMemo(
        () => getMetricsWidgetsData([props.targets[0], metricTargetsEnum.autoconsumption], true),
        [getMetricsWidgetsData, props.targets],
    )

    const isCurrentDayRange = useMemo(
        () =>
            props.period === 'daily' &&
            utcToZonedTime(new Date(props.range.from), 'Europe/Paris').getDate() ===
                utcToZonedTime(new Date(), 'Europe/Paris').getDate(),
        [props.period, props.range.from],
    )

    useEffect(() => {
        if (isCurrentDayRange && !isGetCurrentDayConsumptionLoading && currentDayConsumption === null) {
            getCurrentDayConsumption()
        }
    }, [currentDayConsumption, getCurrentDayConsumption, isCurrentDayRange, isGetCurrentDayConsumptionLoading])

    const { unit, value } = useMemo(
        // we should wait for all metrics needed to be loaded, in this case, 2 (consumption and autoconsumption)
        () => {
            if (currentRangeConsumptionData.length < 2) {
                return emptyValueUnit
            }
            if (currentDayConsumption !== null && currentDayAutoConsumption !== null) {
                return consumptionWattUnitConversion(currentDayConsumption + currentDayAutoConsumption)
            }
            return computeTotalOfAllConsumptions(currentRangeConsumptionData)
        },
        [currentDayAutoConsumption, currentDayConsumption, currentRangeConsumptionData],
    )

    const { unit: oldUnit, value: oldValue } = useMemo(
        // we should wait for all metrics needed to be loaded, in this case, 2 (consumption and autoconsumption)
        () =>
            oldRangeConsumptionData.length < 2
                ? emptyValueUnit
                : computeTotalOfAllConsumptions(oldRangeConsumptionData),
        [oldRangeConsumptionData],
    )

    const percentageChange = useMemo(
        () =>
            computePercentageChange(
                convert(oldValue).from(oldUnit).to('Wh') as number,
                convert(value).from(unit).to('Wh') as number,
            ),
        [oldUnit, oldValue, unit, value],
    )

    return (
        <Widget {...props}>
            <WidgetItem
                target={props.targets[0]}
                title={'Consommation Totale'}
                value={value}
                unit={unit}
                percentageChange={percentageChange}
            />
        </Widget>
    )
}

export default WidgetConsumption
