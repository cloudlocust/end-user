import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useIntl } from 'src/common/react-platform-translation'
import { MeasurementResultStepProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementResultStep/MeasurementResultStep'
import { MeasurementComparisonHistogram } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementComparisonHistogram'

/**
 * MeasurementResultStep component.
 *
 * @param root0 N/A.
 * @param root0.measurementMode The selected measurement mode.
 * @param root0.measurementResult The resut of the measurement process.
 * @param root0.closeMeasurementModal Function that closes the measurement modal and resets the states.
 * @returns The MeasurementResultStep component.
 */
export const MeasurementResultStep = ({
    measurementMode,
    measurementResult,
    closeMeasurementModal,
}: MeasurementResultStepProps) => {
    const { formatMessage } = useIntl()

    /**
     * The average consumption of microwaves according to the LeLynx.fr website (same value in the ADEME
     * website) is estimated to 40 kWh per year for an average use of 5 minutes per day.
     * (https://www.lelynx.fr/energie/comparateur-electricite/consommation-electrique/appareils/).
     */
    const microwaveAverageConsumptionPerYear = 40

    /**
     * The value that we will use in the comparaiseon is the average consumption of the microwave
     * in Watt per hour.
     */
    const microwaveAverageConsumption = Math.round((microwaveAverageConsumptionPerYear * 1000) / (365 * (5 / 60)))

    return (
        <>
            {/* Header */}
            <div className="text-center mb-16">
                <Typography component="h2" fontWeight="500" fontSize="18px" marginBottom="5px">
                    {formatMessage({
                        id: 'Résultats',
                        defaultMessage: 'Résultats',
                    })}
                </Typography>
                <Typography display="inline" component="h3" fontWeight="500" fontSize="16px">
                    {formatMessage({
                        id: 'Mode Sélectionné',
                        defaultMessage: 'Mode Sélectionné',
                    })}
                    &nbsp;:
                </Typography>{' '}
                <Typography display="inline" component="h3" fontWeight="500" fontSize="16px" color="primary">
                    {measurementMode}
                </Typography>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
                {/* The comparison histogram */}
                <MeasurementComparisonHistogram
                    userConsumption={measurementResult || 0}
                    averageConsumption={microwaveAverageConsumption}
                />
            </div>

            {/* The measurement ending button */}
            <div className="flex justify-center">
                <Button
                    variant="contained"
                    sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '160px' }}
                    onClick={closeMeasurementModal}
                >
                    {formatMessage({
                        id: 'Terminer',
                        defaultMessage: 'Terminer',
                    })}
                </Button>
            </div>
        </>
    )
}
