import { useState } from 'react'
import { ToggleButtonGroup, ToggleButton, useTheme } from '@mui/material'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'

/**
 * Component for consumption switch button.
 *
 * @returns Conssumption switch buttons.
 */
export const ConsumptionSwitchButton = (): JSX.Element => {
    const [activeConsumptionType, setActiveConsumptionType] = useState<'consumption' | 'idle'>('consumption')

    const theme = useTheme()
    const toggleButtons = [
        {
            label: 'Général',
            target: metricTargetsEnum.consumption,
            type: 'consumption' as const,
        },
        {
            label: 'Veille',
            target: metricTargetsEnum.idleConsumption,
            type: 'idle' as const,
        },
    ]

    /**
     * Function handing consumption type switch.
     *
     * @param _event Event handler.
     * @param newConsumptionType New consumption type.
     */
    const handleConsumptionType = (
        _event: React.MouseEvent<HTMLElement>,
        newConsumptionType: 'consumption' | 'idle' | null,
    ) => {
        if (newConsumptionType !== null) {
            setActiveConsumptionType(newConsumptionType)
        }
    }

    /**
     * Function that generate  style according  to active button type.
     *
     * @param buttonType Button type: consumption or idle.
     * @returns Style for active button.
     */
    const getButtonStyle = (buttonType: 'consumption' | 'idle') => ({
        background: buttonType === activeConsumptionType ? theme.palette.secondary.main : theme.palette.primary.main,
        color: buttonType === activeConsumptionType ? theme.palette.common.black : theme.palette.common.white,
    })

    return (
        <ToggleButtonGroup
            color="secondary"
            exclusive
            size="small"
            value={activeConsumptionType}
            onChange={handleConsumptionType}
            aria-label="toggle-consumption-button-group"
        >
            {toggleButtons.map((element, index) => (
                <ToggleButton
                    key={index}
                    className="rounded-2xl"
                    aria-label="toggle-consumption-button"
                    value={element.type}
                    style={getButtonStyle(element.type)}
                >
                    {element.label}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    )
}
