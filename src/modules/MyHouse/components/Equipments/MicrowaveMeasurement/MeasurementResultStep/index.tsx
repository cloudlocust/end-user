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
            <div>
                {/* The comparison histogram */}
                <MeasurementComparisonHistogram userConsumption={measurementResult || 0} averageConsumption={1046} />

                {/* The measurement ending button */}
                <div className="flex justify-center">
                    <Button
                        variant="contained"
                        sx={{
                            padding: '10px auto',
                            textAlign: 'center',
                            width: '60%',
                            minWidth: '190px',
                            marginTop: '17.5px',
                        }}
                        onClick={closeMeasurementModal}
                    >
                        {formatMessage({
                            id: 'Suivant',
                            defaultMessage: 'Suivant',
                        })}
                    </Button>
                </div>
            </div>
        </>
    )
}
