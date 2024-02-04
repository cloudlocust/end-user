import IconButton from '@mui/material/IconButton'
import BoltIcon from '@mui/icons-material/Bolt'
import EuroIcon from '@mui/icons-material/Euro'
import { useTheme } from '@mui/material'
import { EurosConsumptionButtonTogglerProps } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * Component showing the eurosConsumption IconButton when its consumptionChart, and consumption IconButton when it's eurosConsumption Chart.
 *
 * @param props N/A.
 * @param props.onEurosConsumptionButtonToggle Handler when clicking on EurosConsumptionButton.
 * @param props.isEurosButtonToggled Indicate if euro button is toggled.
 * @returns EurosConsumptionButtonToggler Component.
 */
const EurosConsumptionButtonToggler = ({
    onEurosConsumptionButtonToggle,
    isEurosButtonToggled,
}: EurosConsumptionButtonTogglerProps) => {
    const theme = useTheme()

    return (
        <>
            {!isEurosButtonToggled ? (
                <div>
                    <IconButton
                        sx={{
                            color: 'white',
                            backgroundColor: theme.palette.primary.light,
                            opacity: 1,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.light,
                                opacity: 0.7,
                            },
                        }}
                        onClick={() => onEurosConsumptionButtonToggle(true)}
                    >
                        <EuroIcon sx={{ width: 20, height: 20 }} />
                    </IconButton>
                </div>
            ) : (
                <IconButton
                    sx={{
                        color: 'secondary.contrastText',
                        backgroundColor: 'secondary.main',
                        opacity: 1,
                        '&:hover': {
                            backgroundColor: 'secondary.main',
                            opacity: 0.7,
                        },
                    }}
                    onClick={() => onEurosConsumptionButtonToggle(false)}
                >
                    <BoltIcon sx={{ width: 24, height: 24 }} />
                </IconButton>
            )}
        </>
    )
}

export default EurosConsumptionButtonToggler
