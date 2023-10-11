import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import { measurementStatusEnum } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress/MeasurementProgress.d'
import {
    MeasurementProcessStepProps,
    ResponseMessageProps,
} from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProcessStep/MeasurementProcessStep'
import { MeasurementProgress } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementProgress'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * Component for showing the response message of the measurement.
 *
 * @param root0 N/A.
 * @param root0.theme The MUI Theme object.
 * @param root0.title The title of the message.
 * @param root0.content The content of the message.
 * @param root0.success True if it's a success response.
 * @returns The ResponseMessage component.
 */
export const ResponseMessage = ({ theme, title, content, success }: ResponseMessageProps) => (
    <div className="text-center">
        <TypographyFormatMessage
            fontWeight="500"
            fontSize="15px"
            marginBottom="5px"
            color={success ? theme.palette.success.main : theme.palette.error.main}
        >
            {title}
        </TypographyFormatMessage>
        <TypographyFormatMessage fontSize="14px">{content}</TypographyFormatMessage>
    </div>
)

/**
 * MeasurementProcessStep component.
 *
 * @param root0 N/A.
 * @param root0.microwave The microwave to mesure.
 * @param root0.measurementMode The measurement mode.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @returns The MeasurementProcessStep component.
 */
export const MeasurementProcessStep = ({ microwave, measurementMode, stepSetter }: MeasurementProcessStepProps) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()
    const [measurementStatus, setMeasurementStatus] = useState<measurementStatusEnum>(measurementStatusEnum.pending)
    const measurementMaxDuration = 10
    const headerText = {
        [measurementStatusEnum.pending]: 'Mesure en cours',
        [measurementStatusEnum.inProgress]: 'Mesure en cours',
        [measurementStatusEnum.success]: 'Mesure terminée avec succès',
        [measurementStatusEnum.failed]: 'Mesure terminée avec échec',
    }

    /**
     * Click handler for the button "Terminer".
     */
    const handleFinishBtnClick = () => {
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
    }, [])

    return (
        <>
            {/* Header */}
            <div className="text-center mb-20">
                <Typography component="h2" fontWeight="500" fontSize="18px" data-testid="headerElement">
                    {formatMessage({
                        id: headerText[measurementStatus],
                        defaultMessage: headerText[measurementStatus],
                    })}
                </Typography>
            </div>

            {/* Content */}
            <div>
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
                            onClick={handleFinishBtnClick}
                            disabled={measurementStatus !== measurementStatusEnum.success}
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
                            onClick={restartTest}
                        >
                            {formatMessage({
                                id: 'Relancer le test',
                                defaultMessage: 'Relancer le test',
                            })}
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}
