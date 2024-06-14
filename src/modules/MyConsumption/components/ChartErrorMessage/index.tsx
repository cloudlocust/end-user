import { useTheme, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { ChartErrorMessageProps } from 'src/modules/MyConsumption/components/ChartErrorMessage/ChartErrorMessage'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

/**
 * ConsumptionErrorMessage component shows an error message depending on the received parameters nrLinkEnedisOff and productionConsentOff.
 *
 * @param root0 N/A.
 * @param root0.nrLinkEnedisOff Nrlink and enedis are off.
 * @param root0.productionConsentOff Enphase is off.
 * @param root0.linkTo Redirect link.
 * @param root0.nrlinkEnedisOffMessage Message for nrlinkEnedisOff error.
 * @param root0.productionConsentOffMessage Message for productionConsentOff error.
 * @param root0.style Custom style.
 * @returns ConsumptionErrorMessage component.
 */
export const ChartErrorMessage = ({
    nrLinkEnedisOff,
    nrlinkEnedisOffMessage,
    productionConsentOff,
    productionConsentOffMessage,
    linkTo,
    style,
}: ChartErrorMessageProps) => {
    const theme = useTheme()

    return (
        <div style={{ background: theme.palette.primary.dark, ...style }}>
            <div className="container relative p-16 sm:p-24 text-center flex items-start justify-center gap-8">
                <ErrorOutlineIcon
                    sx={{
                        color: linksColor || warningMainHashColor,
                        width: { xs: '24px', md: '32px' },
                        height: { xs: '24px', md: '32px' },
                    }}
                />
                {nrLinkEnedisOff && (
                    <Link to={linkTo!}>
                        <Typography
                            className="underline"
                            sx={{
                                color: linksColor || warningMainHashColor,
                                cursor: 'pointer',
                                fontWeight: '400',
                                textAlign: 'center',
                                fontSize: { xs: '13px', md: '16px' },
                            }}
                        >
                            {nrlinkEnedisOffMessage}
                        </Typography>
                    </Link>
                )}
                {productionConsentOff && (
                    <Link to={linkTo!}>
                        <Typography
                            className="underline"
                            sx={{
                                color: linksColor || warningMainHashColor,
                                cursor: 'pointer',
                                fontWeight: '400',
                                textAlign: 'center',
                                fontSize: { xs: '13px', md: '16px' },
                            }}
                        >
                            {productionConsentOffMessage}
                        </Typography>
                    </Link>
                )}
            </div>
        </div>
    )
}
