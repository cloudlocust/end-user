import { MouseEvent } from 'react'
import { ToggleButtonGroup, ToggleButton, capitalize } from '@mui/material'
import {
    SwitchConsumptionButtonLabelEnum,
    SwitchConsumptionButtonProps,
    SwitchConsumptionButtonTypeEnum,
    SwitchConsumpytionButtonType,
} from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { useMyConsumptionStore } from 'src/modules/MyConsumption/store/myConsumptionStore'

const switchButtons: SwitchConsumpytionButtonType = [
    {
        type: SwitchConsumptionButtonTypeEnum.Consumption,
        label: SwitchConsumptionButtonLabelEnum.General,
    },
    {
        type: SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction,
        label: SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction,
    },
    {
        type: SwitchConsumptionButtonTypeEnum.Idle,
        label: SwitchConsumptionButtonLabelEnum.Idle,
    },
]

/**
 * Component for idle consumption switch button.
 *
 * @param props N/A.
 * @param props.onSwitchConsumptionButton Function handling switch of ConsumptionButton.
 * @param props.isIdleShown Boolean indicate if the veille element is shown.
 * @param props.isAutoConsumptionProductionShown Boolean indicate if the autoconsumption-prod element is shown.
 * @returns Switch Consumption button.
 */
export const SwitchConsumptionButton = ({
    onSwitchConsumptionButton,
    isIdleShown,
    isAutoConsumptionProductionShown,
}: SwitchConsumptionButtonProps): JSX.Element => {
    const { consumptionToggleButton, setConsumptionToggleButton } = useMyConsumptionStore()

    /**
     * Function handling switch of idleConsumptionButton.
     *
     * @param _event Event handler.
     * @param value SwitchConsumptionButtonProps.
     */
    const onChange = (_event: MouseEvent<HTMLElement>, value: SwitchConsumptionButtonTypeEnum) => {
        if (value === null) return
        setConsumptionToggleButton(value)
        onSwitchConsumptionButton(value)
    }

    return (
        <ToggleButtonGroup
            color="secondary"
            exclusive
            size="small"
            value={consumptionToggleButton}
            onChange={onChange}
            aria-label="toggle-consumption-button-group"
        >
            {switchButtons.map((element) => {
                const isIdleElementDisabled = !isIdleShown && element.type === SwitchConsumptionButtonTypeEnum.Idle
                const isProductionElementDisabled =
                    !isAutoConsumptionProductionShown &&
                    element.type === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction
                const isElementExcluded = isIdleElementDisabled || isProductionElementDisabled

                if (isElementExcluded) return null

                return (
                    <ToggleButton
                        key={element.label}
                        className="rounded-full text-12 md:text-13"
                        aria-label="toggle-consumption-button"
                        value={element.type}
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            fontWeight: 500,
                            '&.Mui-selected': {
                                backgroundColor: 'secondary.main',
                                color: 'secondary.contrastText',
                            },
                        }}
                    >
                        {capitalize(element.label)}
                    </ToggleButton>
                )
            })}
        </ToggleButtonGroup>
    )
}
