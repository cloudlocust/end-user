import { FC } from 'react'
import { styled, alpha } from '@mui/material/styles'
import { Button, ButtonProps } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'

/**
 * The URL for the solar installation recommendation.
 */
export const URL_SOLAR_INSTALLATION_RECOMMENDATION = 'https://e0vzc8h9q32.typeform.com/to/pNFEjfzU'

const StyledButton = styled(Button)(() => ({
    borderRadius: 8,
    backgroundColor: '#F9E1E1',
    color: '#818A91',
    height: 25,
    '&:hover': {
        backgroundColor: alpha('#F9E1E1', 0.8),
    },
    fontFamily: 'Poppins',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
}))

/**
 * Button component to open the solar installation recommendation page on the new tab.
 *
 * @param {ButtonProps} props - The props for the button component.
 * @returns React component.
 */
export const SolarInstallationRecommendationButton: FC<ButtonProps> = (props) => {
    const { formatMessage } = useIntl()

    /**
     * Open the solar installation recommendation page on the new tab.
     */
    const handleClick = () => {
        window.open(URL_SOLAR_INSTALLATION_RECOMMENDATION, '_blank', 'noopener noreferrer')
    }

    return (
        <StyledButton
            onClick={handleClick}
            variant="contained"
            disableElevation
            disableRipple
            data-testid="solarInstallationRecommendationButton"
            {...props}
        >
            {formatMessage({
                id: '💖 Recommander mon installateur',
                defaultMessage: '💖 Recommander mon installateur',
            })}
        </StyledButton>
    )
}
