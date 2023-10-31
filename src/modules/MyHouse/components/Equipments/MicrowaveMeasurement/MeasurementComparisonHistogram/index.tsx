import { useMemo } from 'react'
import { TypographyProps } from '@mui/material/Typography'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { HistogramBar } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementComparisonHistogram/HistogramBar'
import { MeasurementComparisonHistogramProps } from './MeasurementComparisonHistogram.d'

/**
 * Component MeasurementComparisonHistogram.
 *
 * @param root0 N/A.
 * @param root0.userConsumption The value of the user consumption in Watt.
 * @param root0.averageConsumption The value of the average consumption in Watt.
 * @returns The MeasurementComparisonHistogram component.
 */
export const MeasurementComparisonHistogram = ({
    userConsumption,
    averageConsumption,
}: MeasurementComparisonHistogramProps) => {
    const labelTextPropsValues: TypographyProps = {
        className: 'flex-1 mx-20 mt-5',
        style: { overflowWrap: 'anywhere' },
    }

    /**
     * This useMemo hook calculate the heights of the userConsumption bar and the averageConsumption bar
     * for the comparaison histogram.
     *
     * - The height of a bar is 100 if there consumption value is >= to the other bar consumption value.
     * - Else, the height of the bar is the percentage of there consumption value relative to the other
     *   bar consumption value.
     *
     * The hook return an array of two value, the first one is the userConsumption height value, and
     * the second one is the averageConsumption height value.
     */
    const [userConsumptionBarHeight, averageConsumptionBarHeight] = useMemo(
        () =>
            userConsumption >= averageConsumption
                ? [100, (100 * averageConsumption) / userConsumption]
                : [(100 * userConsumption) / averageConsumption, 100],
        [averageConsumption, userConsumption],
    )

    return (
        <div className="w-full max-w-288 mx-auto">
            <div className="h-160 flex border-b-2 border-grey-500">
                <HistogramBar consumptionValue={userConsumption} height={userConsumptionBarHeight} />
                <HistogramBar
                    consumptionValue={averageConsumption}
                    height={averageConsumptionBarHeight}
                    isAverageConsumption
                />
            </div>
            <div className="flex text-center">
                <TypographyFormatMessage {...labelTextPropsValues}>
                    Consommation de votre micro onde
                </TypographyFormatMessage>
                <TypographyFormatMessage {...labelTextPropsValues}>
                    Consommation moyenne d'un micro onde
                </TypographyFormatMessage>
            </div>
        </div>
    )
}
