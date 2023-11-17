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
 * @param root0.restartMeasurementFromBeginning The function that restart the measurement from the beginning.
 * @returns The MeasurementProcessStep component.
 */
export const MeasurementProcessStep = ({
    measurementStatus,
    measurementMaxDuration,
    getTimeFromStatusLastUpdate,
    startMeasurement,
    restartMeasurementFromBeginning,
    stepSetter,
}: MeasurementProcessStepProps) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()

    const headerText = useMemo(() => {
        switch (measurementStatus?.status) {
            case measurementStatusEnum.SUCCESS:
                return 'Mesure effectuée avec succès'
            case measurementStatusEnum.FAILED:
                return ''
        }
        return 'Mesure en cours ...'
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
            {headerText && (
                <div className="text-center mb-20">
                    <Typography component="h2" fontWeight="500" fontSize="18px" data-testid="headerElement">
                        {formatMessage({
                            id: headerText,
                            defaultMessage: headerText,
                        })}
                    </Typography>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
                {/* The measurement progress component */}
                <div className="flex justify-center mb-32">
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
                        content={measurementStatus.failureMessage!}
                        theme={theme}
                    />
                )}
            </div>

            {/* The test ending and restarting buttons */}
            <div className="flex justify-center">
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
                        onClick={() => restartMeasurementFromBeginning()}
                        children={formatMessage({
                            id: 'Recommencer la mesure',
                            defaultMessage: 'Recommencer la mesure',
                        })}
                    />
                )}
            </div>
        </>
    )
}
