import { useState } from 'react'
import { ToggleButtonGroup, ToggleButton, capitalize } from '@mui/material'
import { SwitchIdleConsumptionProps } from 'src/modules/MyConsumption/myConsumptionTypes.d'

/**
 * Component for idle consumption switch button.
 *
 * @param props N/A.
 * @param props.removeIdleTarget Remove Target Idle prop.
 * @param props.addIdleTarget Add Target Idle prop.
 * @param props.isIdleConsumptionButtonDisabled Indicated if IdleConsumptionButton is disabled.
 * @returns Idle Conssumption switch button.
 */
export const SwitchIdleConsumption = ({
    addIdleTarget,
    removeIdleTarget,
    isIdleConsumptionButtonDisabled,
}: SwitchIdleConsumptionProps): JSX.Element => {
    const [isIdleConsumptionButtonSelected, setIsIdleConsumptionButtonSelected] = useState(false)

    const idleConsumptionSwitchButtons = [
        {
            label: 'Général',
            isIdleConsumptionButton: false,
        },
        {
            label: 'Veille',
            isIdleConsumptionButton: true,
        },
    ]

    /**
     * Function handling switch of idleConsumptionButton.
     *
     * @param _event Event handler.
     * @param isIdleConsumptionValue As .
     */
    const onChange = (_event: React.MouseEvent<HTMLElement>, isIdleConsumptionValue: boolean) => {
        if (isIdleConsumptionValue) addIdleTarget()
        else removeIdleTarget()
        setIsIdleConsumptionButtonSelected(isIdleConsumptionValue)
    }

    return (
        <ToggleButtonGroup
            color="secondary"
            exclusive
            size="small"
            value={isIdleConsumptionButtonSelected}
            onChange={onChange}
            aria-label="toggle-consumption-button-group"
        >
            {idleConsumptionSwitchButtons.map((element, index) => (
                <ToggleButton
                    key={index}
                    className="rounded-2xl"
                    aria-label="toggle-consumption-button"
                    value={element.isIdleConsumptionButton}
                    disabled={element.isIdleConsumptionButton && isIdleConsumptionButtonDisabled}
                    sx={{
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        fontWeight: 500,
                        '&.Mui-disabled': {
                            backgroundColor: 'grey.600',
                            color: 'common.white',
                        },
                        '&.Mui-selected': {
                            backgroundColor: 'secondary.main',
                            color: 'secondary.contrastText',
                        },
                    }}
                >
                    {capitalize(element.label)}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    )
}
