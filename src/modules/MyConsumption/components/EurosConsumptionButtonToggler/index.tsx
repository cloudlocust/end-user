import React from 'react'
import IconButton from '@mui/material/IconButton'
import BoltIcon from '@mui/icons-material/Bolt'
import EuroIcon from '@mui/icons-material/Euro'
import { getChartColor } from 'src/modules/MyConsumption/utils/myConsumptionVariables'
import { useTheme } from '@mui/material'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import { EurosConsumptionButtonTogglerProps } from 'src/modules/MyConsumption/myConsumptionTypes'

/**
 * Component showing the eurosConsumption IconButton when its consumptionChart, and consumption IconButton when it's eurosConsumption Chart.
 *
 * @param props N/A.
 * @param props.removeTarget Remove Target prop.
 * @param props.addTarget Add Target prop.
 * @param props.showEurosConsumption Indicate eurosConsumption or consumption IconButton to be shown.
 * @param props.disabled Indicated if EurosConsumptionButton is disabled.
 * @returns EurosConsumptionButtonToggler Component.
 */
const EurosConsumptionButtonToggler = ({
    removeTarget,
    addTarget,
    showEurosConsumption,
    disabled,
}: EurosConsumptionButtonTogglerProps) => {
    const theme = useTheme()
    return (
        <>
            {showEurosConsumption ? (
                <IconButton
                    sx={{
                        color: 'white',
                        backgroundColor: getChartColor(metricTargetsEnum.eurosConsumption, theme),
                        opacity: 1,
                        '&:hover': {
                            backgroundColor: getChartColor(metricTargetsEnum.eurosConsumption, theme),
                            opacity: 0.7,
                        },
                        '&:disabled': {
                            backgroundColor: 'grey.600',
                            color: 'text.disabled',
                        },
                    }}
                    disabled={disabled}
                    // TODO Remove target should take an array of targets
                    onClick={() => {
                        removeTarget(metricTargetsEnum.consumption)
                        removeTarget(metricTargetsEnum.autoconsumption)
                        addTarget(metricTargetsEnum.eurosConsumption)
                    }}
                >
                    <EuroIcon sx={{ width: 20, height: 20 }} />
                </IconButton>
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
                    onClick={() => {
                        // TODO Remove target should take an array of targets
                        removeTarget(metricTargetsEnum.eurosConsumption)
                        addTarget(metricTargetsEnum.consumption)
                        addTarget(metricTargetsEnum.autoconsumption)
                    }}
                >
                    <BoltIcon sx={{ width: 24, height: 24 }} />
                </IconButton>
            )}
        </>
    )
}

export default EurosConsumptionButtonToggler
