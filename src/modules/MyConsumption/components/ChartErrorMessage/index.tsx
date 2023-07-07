import { useTheme, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { ChartErrorMessageProps } from 'src/modules/MyConsumption/components/ChartErrorMessage/ChartErrorMessage'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

/**
 * ConsumptionErrorMessage component shows an error message depending on the received parameters nrLinkEnedisOff and enphaseOff.
 *
 * @param root0 N/A.
 * @param root0.nrLinkEnedisOff Nrlink and enedis are off.
 * @param root0.enphaseOff Enphase is off.
 * @param root0.linkTo Redirect link.
 * @param root0.nrlinkEnedisOffMessage Message for nrlinkEnedisOff error.
 * @param root0.enphaseOffMessage Message for enphaseOff error.
 * @returns ConsumptionErrorMessage component.
 */
export const ChartErrorMessage = ({
    nrLinkEnedisOff,
    nrlinkEnedisOffMessage,
    enphaseOff,
    enphaseOffMessage,
    linkTo,
}: ChartErrorMessageProps) => {
    const theme = useTheme()

    return (
        <div style={{ background: theme.palette.primary.dark }}>
            <div className="container relative p-16 sm:p-24 text-center flex items-center justify-center gap-8">
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
                {enphaseOff && (
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
                            {enphaseOffMessage}
                        </Typography>
                    </Link>
                )}
            </div>
        </div>
    )
}
