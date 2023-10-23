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
 * @param root0.setMeasurementStatus The setter linked to the measurementStatus state.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @returns The MeasurementProcessStep component.
 */
export const MeasurementProcessStep = ({
    measurementStatus,
    setMeasurementStatus,
    stepSetter,
}: MeasurementProcessStepProps) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const measurementMaxDuration = 10
    const headerText = useMemo(() => {
        switch (measurementStatus) {
            case measurementStatusEnum.pending:
                return 'Démarrage de la mesure'
            case measurementStatusEnum.inProgress:
                return 'Mesure en cours'
            case measurementStatusEnum.success:
                return 'Mesure terminée avec succès'
            case measurementStatusEnum.failed:
                return 'Mesure terminée avec échec'
        }
        return 'Démarrage de la mesure'
    }, [measurementStatus])

    /**
     * Click handler for the button "Terminer".
     */
    const handleFinishButtonClick = () => {
        stepSetter(4)
    }

    /**
     * The following code is just for testing before creating the hook that manage
     * the measurement requests.
     */
    const test = () => {
        // Starting the measurement
        setTimeout(() => {
            setMeasurementStatus(measurementStatusEnum.inProgress)
        }, 4000)

        // Ending the measurement
        setTimeout(() => {
            setMeasurementStatus(Math.random() < 0.3 ? measurementStatusEnum.success : measurementStatusEnum.failed)
        }, 4000 + measurementMaxDuration * 1000)
    }

    /**
     * Function for restart the measurement test.
     */
    const restartTest = () => {
        setMeasurementStatus(measurementStatusEnum.pending)
        test()
    }

    useEffect(() => {
        test()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                    <MeasurementProgress status={measurementStatus} maxDuration={measurementMaxDuration} />
                </div>

                {/* Success message */}
                {measurementStatus === measurementStatusEnum.success && (
                    <ResponseMessage
                        title="Félicitations !"
                        content="Le test s'est terminé avec succès, vous pouvez désormais analyser vos résultats"
                        theme={theme}
                        success
                    />
                )}

                {/* Failure message */}
                {measurementStatus === measurementStatusEnum.failed && (
                    <ResponseMessage
                        title="La mesure a échoué"
                        content="Le test s'est terminé par un échec, vous pouvez le lancer à nouveau"
                        theme={theme}
                    />
                )}
            </div>

            {/* The test ending button */}
            <div className="flex justify-center mt-20">
                {measurementStatus !== measurementStatusEnum.failed ? (
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '160px' }}
                        onClick={handleFinishButtonClick}
                        disabled={measurementStatus !== measurementStatusEnum.success}
                        children={formatMessage({
                            id: 'Terminer',
                            defaultMessage: 'Terminer',
                        })}
                    />
                ) : (
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '160px' }}
                        onClick={restartTest}
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
