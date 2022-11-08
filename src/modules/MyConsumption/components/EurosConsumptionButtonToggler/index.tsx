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
 * @returns EurosConsumptionButtonToggler Component.
 */
const EurosConsumptionButtonToggler = ({
    removeTarget,
    addTarget,
    showEurosConsumption,
}: EurosConsumptionButtonTogglerProps) => {
    const theme = useTheme()
    return (
        <>
            {showEurosConsumption ? (
                <IconButton
                    sx={{
                        color: 'white',
                        backgroundColor: getChartColor(metricTargetsEnum.eurosConsumption, theme),
                    }}
                    onClick={() => {
                        removeTarget(metricTargetsEnum.autoconsumption)
                        addTarget(metricTargetsEnum.eurosConsumption)
                    }}
                >
                    <EuroIcon sx={{ width: 20, height: 20 }} />
                </IconButton>
            ) : (
                <IconButton
                    sx={{
                        color: 'primary.contrastText',
                        backgroundColor: 'primary.light',
                    }}
                    onClick={() => {
                        removeTarget(metricTargetsEnum.eurosConsumption)
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
