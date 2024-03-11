import { FC } from 'react'
import { styled, alpha } from '@mui/material/styles'
import { Button, ButtonProps } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { URL_CONSUMPTION_LABELIZATION } from 'src/modules/MyConsumption/MyConsumptionConfig'

const StyledButton = styled(Button)(({ theme }) => ({
    padding: '8px 16px',
    borderRadius: 90,
    boxShadow: `0px 2px 4px 0px ${alpha(theme.palette.primary.dark, 0.2)}, 0px 1px 10px 0px ${alpha(
        theme.palette.primary.dark,
        0.12,
    )}, 0px 4px 5px 0px ${alpha(theme.palette.primary.dark, 0.14)}`,
    '&:hover': {
        boxShadow: `0px 2px 4px 0px ${alpha(theme.palette.primary.dark, 0.2)}, 0px 1px 10px 0px ${alpha(
            theme.palette.primary.dark,
            0.12,
        )}, 0px 4px 5px 0px ${alpha(theme.palette.primary.dark, 0.14)}`,
    },
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    fontFamily: 'Poppins',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    height: 24,
}))

/**
 * Button component to redirect to EcogestCard.
 *
 * @param {ButtonProps} props - The props for the button component.
 * @returns React component.
 */
export const ConsumptionIdentifierButton: FC<ButtonProps> = (props) => {
    const history = useHistory()

    /**
     * Redirect to EcogestCard.
     */
    const handleClick = () => {
        history.push(URL_CONSUMPTION_LABELIZATION)
    }

    return (
        <StyledButton onClick={handleClick} variant="text" disableElevation disableRipple {...props}>
            Identifier une&nbsp;conso
        </StyledButton>
    )
}
