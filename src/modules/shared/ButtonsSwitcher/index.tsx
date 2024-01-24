import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
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
 * @returns JSX.Element.
 */
export const ButtonsSwitcher = ({ buttonsSwitcherParams }: ButtonsSwitcherProps) => {
    const [indexOfSelectedButton, setIndexOfSelectedButton] = useState(0)

    return (
        <div className="w-full flex justify-center">
            {buttonsSwitcherParams.map((buttonSwitcherParam, index) => (
                <StyledButton
                    sx={(theme) =>
                        index === indexOfSelectedButton
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
                    className="text-13 sm:text-16"
                    aria-label={index === indexOfSelectedButton ? 'active-cell' : 'clickable-cell'}
                    onClick={() => {
                        setIndexOfSelectedButton(index)
                        buttonSwitcherParam.clickHandler()
                    }}
                >
                    {buttonSwitcherParam.buttonText}
                </StyledButton>
            ))}
        </div>
    )
}
