import { FC } from 'react'
import { styled, alpha } from '@mui/material/styles'
import { Button, ButtonProps } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { useIntl } from 'src/common/react-platform-translation'
import { URL_CONSUMPTION_LABELIZATION } from 'src/modules/MyConsumption/MyConsumptionConfig'

const StyledButton = styled(Button)(({ theme }) => ({
    padding: '8px 16px',
    borderRadius: 8,
    backgroundColor: alpha(theme.palette.primary.main, 0.3),
    color: alpha(theme.palette.primary.main, 0.75),
    height: 24,
    '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
    border: '1px solid',
    borderColor: alpha(theme.palette.primary.main, 0.1),
    fontFamily: 'Poppins',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
}))

/**
 * Button component to redirect to consumption labeliation page.
 *
 * @param {ButtonProps} props - The props for the button component.
 * @returns React component.
 */
export const ConsumptionIdentifierButton: FC<ButtonProps> = (props) => {
    const history = useHistory()
    const { formatMessage } = useIntl()

    /**
     * Redirect to consumption labeliation page.
     */
    const handleClick = () => {
        history.push(URL_CONSUMPTION_LABELIZATION)
    }

    return (
        <StyledButton onClick={handleClick} variant="contained" disableElevation disableRipple {...props}>
            {formatMessage({ id: 'Identifier un pic de conso', defaultMessage: 'Identifier un pic de conso' })}
        </StyledButton>
    )
}
