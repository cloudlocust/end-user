import { useTheme, Icon, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { ChartErrorMessageProps } from 'src/modules/MyConsumption/components/ChartErrorMessage/ChartErrorMessage'

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
        <div style={{ background: theme.palette.primary.main }} className="p-16">
            <div className="container relative  p-16 sm:p-24 flex-col text-center flex items-center justify-center">
                <Icon style={{ fontSize: '4rem', marginBottom: '1rem', color: theme.palette.warning.light }}>
                    error_outline_outlined
                </Icon>
                {nrLinkEnedisOff && (
                    <Link to={linkTo!}>
                        <Typography
                            style={{ color: theme.palette.warning.light }}
                            fontWeight={600}
                            className="underline"
                        >
                            {nrlinkEnedisOffMessage}
                        </Typography>
                    </Link>
                )}
                {enphaseOff && (
                    <Link to={linkTo!}>
                        <Typography
                            style={{ color: theme.palette.warning.light }}
                            fontWeight={600}
                            className="underline"
                        >
                            {enphaseOffMessage}
                        </Typography>
                    </Link>
                )}
            </div>
        </div>
    )
}
