import { ToggleButtonGroup, ToggleButton, capitalize } from '@mui/material'
import { SwitchIdleConsumptionProps } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

/**
 * Component for idle consumption switch button.
 *
 * @param props N/A.
 * @param props.removeIdleTarget Remove Target Idle prop.
 * @param props.addIdleTarget Add Target Idle prop.
 * @param props.isIdleConsumptionButtonDisabled Indicated if IdleConsumptionButton is disabled.
 * @param props.onClickIdleConsumptionDisabledInfoIcon When Clicking on IdleConsumptionDisabledInfoIcon.
 * @param props.isIdleConsumptionButtonSelected Value of idleConsumptionButton.
 * @returns Idle Conssumption switch button.
 */
export const SwitchIdleConsumption = ({
    addIdleTarget,
    removeIdleTarget,
    isIdleConsumptionButtonDisabled,
    onClickIdleConsumptionDisabledInfoIcon,
    isIdleConsumptionButtonSelected,
}: SwitchIdleConsumptionProps): JSX.Element => {
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
        if (isIdleConsumptionValue) {
            // When clicking on the idleConsumptionButton and it's supposed to be disabled then we callback to onClickIdleConsumptionDisabledInfoIcon and exit the onChange.
            if (isIdleConsumptionButtonDisabled) {
                onClickIdleConsumptionDisabledInfoIcon()
                return
            }
            addIdleTarget()
        } else removeIdleTarget()
    }

    return (
        <>
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
                        sx={
                            // Handle the styling of idleConsumptionButton disable manually, so that we can keep the click on idleConsumptionButton.
                            // Because using the property disabled won't allow the click on the button and thus we can't click on the info icon to show text.
                            element.isIdleConsumptionButton && isIdleConsumptionButtonDisabled
                                ? {
                                      '&, &:hover': {
                                          fontWeight: 500,
                                          backgroundColor: 'grey.600',
                                          color: 'common.white',
                                      },
                                  }
                                : {
                                      backgroundColor: 'primary.main',
                                      color: 'primary.contrastText',
                                      fontWeight: 500,
                                      '&.Mui-selected': {
                                          backgroundColor: 'secondary.main',
                                          color: 'secondary.contrastText',
                                      },
                                  }
                        }
                    >
                        <>
                            {capitalize(element.label)}
                            {element.isIdleConsumptionButton && isIdleConsumptionButtonDisabled && (
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
                ))}
            </ToggleButtonGroup>
        </>
    )
}
