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

    return (
        <div className="w-full max-w-288 mx-auto">
            <div className="h-160 flex border-b-2 border-grey-500">
                <HistogramBar consumptionValue={userConsumption} otherConsumptionValue={averageConsumption} />
                <HistogramBar
                    consumptionValue={averageConsumption}
                    otherConsumptionValue={userConsumption}
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
