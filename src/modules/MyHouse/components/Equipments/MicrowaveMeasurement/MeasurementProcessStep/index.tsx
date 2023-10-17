import { useEffect, useMemo } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import { MeasurementProcessStepProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep/MeasurementProcessStep'
import { MeasurementProgress } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress'
import { useMicrowaveMeasurement } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MicrowaveMeasurementHook'
import { ResponseMessage } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep/ResponseMessage'

/**
 * MeasurementProcessStep component.
 *
 * @param root0 N/A.
 * @param root0.housingEquipmentId The global equipment id.
 * @param root0.measurementMode The measurement mode.
 * @param root0.microwaveNumber The microwave to mesure.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @returns The MeasurementProcessStep component.
 */
export const MeasurementProcessStep = ({
    housingEquipmentId,
    measurementMode,
    microwaveNumber,
    stepSetter,
}: MeasurementProcessStepProps) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const measurementMaxDuration = 50

    const { measurementStatus, measurementResult, passedTimeFromStatusLastUpdate, startMeasurement } =
        useMicrowaveMeasurement(housingEquipmentId, measurementMode, microwaveNumber, measurementMaxDuration)

    const getHeaderText = useMemo(() => {
        switch (measurementStatus?.status) {
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
    const handleFinishBtnClick = () => {
        stepSetter(4)
    }

    useEffect(() => {
        startMeasurement()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {/* Header */}
            <div className="text-center mb-20">
                <Typography component="h2" fontWeight="500" fontSize="18px" data-testid="headerElement">
                    {formatMessage({
                        id: getHeaderText,
                        defaultMessage: getHeaderText,
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
                        getTimeFromLastUpdate={passedTimeFromStatusLastUpdate}
                    />
                </div>

                {/* Success message */}
                {measurementStatus?.status === measurementStatusEnum.success && (
                    <ResponseMessage
                        title="Félicitations !"
                        content={`Le test s'est terminé avec succès, vous pouvez désormais analyser vos résultats. Le résultat de la mesure est ${measurementResult}`}
                        theme={theme}
                        success
                    />
                )}

                {/* Failure message */}
                {measurementStatus?.status === measurementStatusEnum.failed && (
                    <ResponseMessage
                        title="La mesure a échoué"
                        content="Le test s'est terminé par un échec, vous pouvez le lancer à nouveau"
                        theme={theme}
                    />
                )}
            </div>

            {/* The test ending button */}
            <div className="flex justify-center mt-20">
                {measurementStatus?.status !== measurementStatusEnum.failed ? (
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '160px' }}
                        onClick={handleFinishBtnClick}
                        disabled={measurementStatus?.status !== measurementStatusEnum.success}
                    >
                        {formatMessage({
                            id: 'Terminer',
                            defaultMessage: 'Terminer',
                        })}
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '160px' }}
                        onClick={startMeasurement}
                    >
                        {formatMessage({
                            id: 'Relancer le test',
                            defaultMessage: 'Relancer le test',
                        })}
                    </Button>
                )}
            </div>
        </>
    )
}
