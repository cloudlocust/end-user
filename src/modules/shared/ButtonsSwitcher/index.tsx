import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import { ButtonsSwitcherProps } from 'src/modules/shared/ButtonsSwitcher/ButtonsSwitcher'

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    flex: 1,
    maxWidth: 300,
    color: theme.palette.grey[500],
    backgroundColor: theme.palette.grey[100],
}))

/**
 * ButtonsSwitcher Component.
 *
 * @param root0 N/A.
 * @param root0.buttonsSwitcherParams List of params object of the Buttons.
 * @param root0.containerProps Container props.
 * @param root0.buttonProps Buttons props.
 * @returns JSX.Element.
 */
export const ButtonsSwitcher = ({ buttonsSwitcherParams, buttonProps, containerProps }: ButtonsSwitcherProps) => {
    return (
        <div className="w-full flex justify-center buttons-container" {...containerProps}>
            {buttonsSwitcherParams.map((buttonSwitcherParam) => (
                <StyledButton
                    sx={(theme) =>
                        buttonSwitcherParam.isSelected
                            ? {
                                  color: theme.palette.grey[700],
                                  backgroundColor: theme.palette.common.white,
                                  boxShadow: 3,
                                  zIndex: 2,
                                  '&:hover': {
                                      backgroundColor: theme.palette.common.white,
                                  },
                              }
                            : {
                                  zIndex: 1,
                                  '&:hover': {
                                      backgroundColor: theme.palette.grey[200],
                                  },
                              }
                    }
                    className={clsx('text-13 sm:text-16', { selected: buttonSwitcherParam.isSelected })}
                    aria-label={buttonSwitcherParam.isSelected ? 'active-cell' : 'clickable-cell'}
                    onClick={() => {
                        if (!buttonSwitcherParam.isSelected) {
                            buttonSwitcherParam.clickHandler()
                        }
                    }}
                    {...(buttonProps && buttonProps(buttonSwitcherParam.isSelected, buttonSwitcherParam.isDisabled))}
                    disabled={!!buttonSwitcherParam.isDisabled}
                >
                    {buttonSwitcherParam.buttonText}
                </StyledButton>
            ))}
        </div>
    )
}
