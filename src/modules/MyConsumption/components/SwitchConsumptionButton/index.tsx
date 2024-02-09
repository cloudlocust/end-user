import { MouseEvent } from 'react'
import { ToggleButtonGroup, ToggleButton, capitalize, useTheme, useMediaQuery } from '@mui/material'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import {
    SwitchConsumptionButtonElement,
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
 * @returns Switch Conssumption button.
 */
export const SwitchConsumptionButton = (props: SwitchConsumptionButtonProps): JSX.Element => {
    const {
        isIdleConsumptionButtonDisabled,
        onClickIdleConsumptionDisabledInfoIcon,
        isSolarProductionConsentOff,
        consumptionToggleButton,
        onSwitchConsumptionButton,
    } = props
    const theme = useTheme()
    const smDown = useMediaQuery(theme.breakpoints.down('sm'))

    const { setConsumptionToggleButton } = useMyConsumptionStore()

    /**
     * Function handling switch of idleConsumptionButton.
     *
     * @param _event Event handler.
     * @param value SwitchConsumptionButtonProps.
     */
    const onChange = (_event: MouseEvent<HTMLElement>, value: SwitchConsumptionButtonTypeEnum) => {
        if (isIdleConsumptionButtonDisabled && value === SwitchConsumptionButtonTypeEnum.Idle) {
            onClickIdleConsumptionDisabledInfoIcon()
            return
        }
        onSwitchConsumptionButton(value)
        setConsumptionToggleButton(value)
    }

    /**
     * Returns the button style based on the provided element and optional flag.
     *
     * @param element - The element type of the button.
     * @param isIdleConsumptionButtonDisabled - Optional flag indicating whether the idle consumption button is disabled.
     * @returns The button style object.
     */
    const getButtonStyle = (element: SwitchConsumptionButtonElement, isIdleConsumptionButtonDisabled?: boolean) => {
        if (element.type === SwitchConsumptionButtonTypeEnum.Idle && isIdleConsumptionButtonDisabled) {
            return {
                '&, &:hover': {
                    fontWeight: 500,
                    backgroundColor: 'grey.600',
                    color: 'common.white',
                },
            }
        }

        return {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 500,
            '&.Mui-selected': {
                backgroundColor: 'secondary.main',
                color: 'secondary.contrastText',
            },
        }
    }

    return (
        <>
            <ToggleButtonGroup
                color="secondary"
                exclusive
                size="small"
                value={consumptionToggleButton}
                onChange={onChange}
                aria-label="toggle-consumption-button-group"
                style={{
                    height: smDown ? '40px' : 'auto',
                }}
            >
                {switchButtons.map((element, index) => {
                    // Hide the solar production button if the period is daily and the solar production consent is off.
                    if (
                        element.type === SwitchConsumptionButtonTypeEnum.AutoconsmptionProduction &&
                        isSolarProductionConsentOff
                    ) {
                        return null
                    }
                    return (
                        <ToggleButton
                            key={index}
                            className="rounded-2xl"
                            aria-label="toggle-consumption-button"
                            value={element.type}
                            sx={getButtonStyle(element, isIdleConsumptionButtonDisabled)}
                        >
                            <>
                                {capitalize(element.label)}
                                {element.type === SwitchConsumptionButtonTypeEnum.Idle &&
                                    isIdleConsumptionButtonDisabled && (
                                        <ErrorOutlineIcon
                                            sx={{
                                                color: linksColor || warningMainHashColor,
                                                width: '20px',
                                                height: '20px',
                                                marginLeft: '4px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                    )}
                            </>
                        </ToggleButton>
                    )
                })}
            </ToggleButtonGroup>
        </>
    )
}
