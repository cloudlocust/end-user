import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as ConnectEquipmentIcon } from 'src/assets/images/content/housing/ConnectEquipment.svg'
import { useIntl } from 'src/common/react-platform-translation'
import { MeasurementStartupStepProps } from 'src/modules/MyHouse/components/Equipments/MicrowaveMeasurement/MeasurementStartupStep/MeasurementStartupStep'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

/**
 * MeasurementStartupStep component.
 *
 * @param root0 N/A.
 * @param root0.measurementMode The mode of the measurement test.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @returns The MeasurementStartupStep component.
 */
export const MeasurementStartupStep = ({ measurementMode, stepSetter }: MeasurementStartupStepProps) => {
    const { formatMessage } = useIntl()

    /**
     * Click handler for the button Commencer la mesure.
     */
    const handleBtnClick = () => {
        stepSetter(3)
    }

    return (
        <>
            {/* Header */}
            <div className="text-center mb-20">
                <Typography display="inline" component="h2" fontWeight="500" fontSize="18px">
                    {formatMessage({
                        id: "Mettez en marche l'appareil sur le mode",
                        defaultMessage: "Mettez en marche l'appareil sur le mode",
                    })}
                    &nbsp;:
                </Typography>{' '}
                <Typography display="inline" component="h2" fontWeight="500" fontSize="18px" color="primary">
                    {measurementMode}
                </Typography>
            </div>

            {/* Content */}
            <div>
                {/* Descriptive image */}
                <div className="mb-20">
                    <SvgIcon component={ConnectEquipmentIcon} sx={{ width: '100%', height: '160px' }} inheritViewBox />
                </div>

                {/* Description */}
                <TypographyFormatMessage textAlign="center" marginBottom="20px">
                    Une fois l’appareil mis en marche, appuyez sur “Commencer la mesure” pour débuter le test
                </TypographyFormatMessage>

                {/* The measurement starting button */}
                <div className="flex justify-center">
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '190px' }}
                        onClick={handleBtnClick}
                    >
                        {formatMessage({
                            id: 'Commencer la mesure',
                            defaultMessage: 'Commencer la mesure',
                        })}
                    </Button>
                </div>
            </div>
        </>
    )
}
