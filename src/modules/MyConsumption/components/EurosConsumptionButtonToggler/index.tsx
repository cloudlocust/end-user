import IconButton from '@mui/material/IconButton'
import BoltIcon from '@mui/icons-material/Bolt'
import EuroIcon from '@mui/icons-material/Euro'
import { useTheme } from '@mui/material'
import { EurosConsumptionButtonTogglerProps } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import Tooltip from '@mui/material/Tooltip'
import { useIntl } from 'react-intl'

/**
 * Component showing the eurosConsumption IconButton when its consumptionChart, and consumption IconButton when it's eurosConsumption Chart.
 *
 * @param props N/A.
 * @param props.onEuroClick Handler when clicking on EuroButton.
 * @param props.onConsumptionClick Handler when clicking on ConsumptionButton.
 * @param props.showEurosConsumption Indicate eurosConsumption or consumption IconButton to be shown.
 * @param props.disabled Indicated if EurosConsumptionButton is disabled.
 * @returns EurosConsumptionButtonToggler Component.
 */
const EurosConsumptionButtonToggler = ({
    onEuroClick,
    onConsumptionClick,
    showEurosConsumption,
    disabled,
}: EurosConsumptionButtonTogglerProps) => {
    const { formatMessage } = useIntl()
    const theme = useTheme()

    return (
        <div className="flex items-center">
            {showEurosConsumption ? (
                <Tooltip
                    arrow
                    placement="top"
                    disableHoverListener={!disabled}
                    title={formatMessage({
                        id: 'Cette fonctionnalité n’est pas disponible sur cette période',
                        defaultMessage: 'Cette fonctionnalité n’est pas disponible sur cette période',
                    })}
                >
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
                                '&:disabled': {
                                    backgroundColor: 'grey.600',
                                    color: 'text.disabled',
                                },
                            }}
                            disabled={disabled}
                            onClick={onEuroClick}
                        >
                            <EuroIcon sx={{ width: 20, height: 20 }} />
                        </IconButton>
                    </div>
                </Tooltip>
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
                    disabled={disabled}
                    onClick={onConsumptionClick}
                >
                    <BoltIcon sx={{ width: 24, height: 24 }} />
                </IconButton>
            )}
        </div>
    )
}

export default EurosConsumptionButtonToggler
