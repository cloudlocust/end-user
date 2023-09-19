import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as ConnectEquipmentIcon } from 'src/assets/images/content/housing/ConnectEquipment.svg'
import { EquipmentStartupStepProps } from 'src/modules/MyHouse/components/MicrowaveMeasurement/MicrowaveMeasurement'

/**
 * ConfigurationStep component.
 *
 * @param root0 N/A.
 * @param root0.stepSetter The setter linked to the state responsible for storing the current step.
 * @param root0.testMode The mode of the measurement test.
 * @returns The ConfigurationStep component.
 */
const EquipmentStartupStep = ({ testMode, stepSetter }: EquipmentStartupStepProps) => {
    /**
     * Click handler for the button Commencer la mesure.
     */
    const handleBtnClick = () => {
        stepSetter(3)
    }

    return (
        <Box>
            {/* Header */}
            <Box textAlign="center" marginBottom="20px">
                <Typography display="inline" component="h2" fontWeight="500" fontSize="18px">
                    Mettez en marche l'appareil sur le mode&nbsp;:
                </Typography>{' '}
                <Typography display="inline" component="h2" fontWeight="500" fontSize="18px" color="primary">
                    {testMode}
                </Typography>
            </Box>

            {/* Content */}
            <Box>
                {/* Descriptive image */}
                <Box marginBottom="20px">
                    <SvgIcon component={ConnectEquipmentIcon} sx={{ width: '100%', height: '160px' }} inheritViewBox />
                </Box>

                {/* Description */}
                <Typography textAlign="center" marginBottom="20px">
                    Une fois l’appreil mis en marche, appuyez sur “Commencer la mesure” pour débuter le test
                </Typography>

                {/* The measurement starting button */}
                <Box display="flex" justifyContent="center">
                    <Button
                        variant="contained"
                        sx={{ padding: '10px auto', textAlign: 'center', width: '60%', minWidth: '190px' }}
                        onClick={handleBtnClick}
                    >
                        Commencer la mesure
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default EquipmentStartupStep
