import { useEffect, useMemo } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import { MeasurementProcessStepProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep/MeasurementProcessStep'
import { MeasurementProgress } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress'
import { ResponseMessage } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep/ResponseMessage'

/**
 * MeasurementProcessStep component.
 *
 * @param root0 N/A.
 * @param root0.measurementStatus The measurementStatus state.
 * @param root0.measurementMaxDuration Estimated value for the maximum duration of the measurement process (in seconds).
 * @param root0.getTimeFromStatusLastUpdate Function to get the time passed (in seconds) from the last update os measurement status.
 * @param root0.startMeasurement The function that start the measurement process.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @returns The MeasurementProcessStep component.
 */
export const MeasurementProcessStep = ({
    measurementStatus,
    measurementMaxDuration,
    getTimeFromStatusLastUpdate,
    startMeasurement,
    stepSetter,
}: MeasurementProcessStepProps) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()

    const headerText = useMemo(() => {
        switch (measurementStatus?.status) {
            case measurementStatusEnum.PENDING:
                return 'Démarrage de la mesure'
            case measurementStatusEnum.IN_PROGRESS:
                return 'Mesure en cours'
            case measurementStatusEnum.SUCCESS:
                return 'Mesure effectuée avec succès'
            case measurementStatusEnum.FAILED:
                return 'Mesure terminée avec échec'
        }
        return 'Démarrage de la mesure'
    }, [measurementStatus])

    /**
     * Click handler for the button "Voir le résultat".
     */
    const handleFinishButtonClick = () => {
        stepSetter(4)
    }

    useEffect(() => {
        startMeasurement()
    }, [startMeasurement])

    return (
        <>
            {/* Header */}
            <div className="text-center mb-20">
                <Typography component="h2" fontWeight="500" fontSize="18px" data-testid="headerElement">
                    {formatMessage({
                        id: headerText,
                        defaultMessage: headerText,
                    })}
                </Typography>
            </div>

            {/* Content */}
            <div className="min-h-256 flex flex-col justify-around">
                {/* The measurement progress component */}
                <div className="flex justify-center">
                    <MeasurementProgress
                        status={measurementStatus?.status}
                        maxDuration={measurementMaxDuration}
                        getTimeFromStatusLastUpdate={getTimeFromStatusLastUpdate}
                    />
                </div>

                {/* Success message */}
                {measurementStatus?.status === measurementStatusEnum.SUCCESS && (
                    <ResponseMessage
                        title="Félicitations !"
                        content="La mesure a été effectuée avec succès, vous pouvez arrêter votre appareil."
                        theme={theme}
                        success
                    />
                )}

                {/* Failure message */}
                {measurementStatus?.status === measurementStatusEnum.FAILED && (
                    <ResponseMessage
                        title="La mesure a échoué"
                        content="Le test est terminé par un échec, vous pouvez le lancer à nouveau"
                        theme={theme}
                    />
                )}
            </div>

            {/* The test ending button */}
            <div className="flex justify-center mt-20">
                {measurementStatus?.status !== measurementStatusEnum.FAILED ? (
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '160px' }}
                        onClick={handleFinishButtonClick}
                        disabled={measurementStatus?.status !== measurementStatusEnum.SUCCESS}
                        children={formatMessage({
                            id: 'Voir le résultat',
                            defaultMessage: 'Voir le résultat',
                        })}
                    />
                ) : (
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '160px' }}
                        onClick={startMeasurement}
                        children={formatMessage({
                            id: 'Relancer le test',
                            defaultMessage: 'Relancer le test',
                        })}
                    />
                )}
            </div>
        </>
    )
}
