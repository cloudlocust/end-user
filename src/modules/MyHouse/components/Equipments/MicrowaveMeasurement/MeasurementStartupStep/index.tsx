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
                        id: 'Choisissez le réglage',
                        defaultMessage: 'Choisissez le réglage',
                    })}
                </Typography>{' '}
                <Typography display="inline" component="h2" fontWeight="500" fontSize="18px" color="primary">
                    {measurementMode}
                </Typography>{' '}
                <Typography display="inline" component="h2" fontWeight="500" fontSize="18px">
                    {formatMessage({
                        id: 'puis mettez en marche votre appareil',
                        defaultMessage: 'puis mettez en marche votre appareil',
                    })}
                </Typography>{' '}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
                {/* Descriptive image */}
                <div className="mb-20">
                    <SvgIcon component={ConnectEquipmentIcon} sx={{ width: '100%', height: '160px' }} inheritViewBox />
                </div>

                {/* Description */}
                <TypographyFormatMessage textAlign="center" marginBottom="20px">
                    Une fois votre appareil en marche, vous pouvez lancer la mesure.
                </TypographyFormatMessage>
            </div>

            {/* The measurement starting button */}
            <div className="flex justify-center">
                <Button
                    variant="contained"
                    sx={{ padding: '10px auto', textAlign: 'center', minWidth: '210px' }}
                    onClick={handleBtnClick}
                >
                    {formatMessage({
                        id: 'Commencer la mesure',
                        defaultMessage: 'Commencer la mesure',
                    })}
                </Button>
            </div>
        </>
    )
}
