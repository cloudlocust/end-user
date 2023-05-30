import 'src/modules/User/Register/register.scss'
import { Typography } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'
import { linksColor } from 'src/modules/utils/muiThemeVariables'
import { ReactSVG } from 'react-svg'
import ServerDownSvg from 'src/assets/images/errors/server-down.svg'
import { useTheme } from '@mui/material'

/**
 * Error500 Component.
 *
 * @returns Modify form component.
 */
const Error500 = () => {
    const { formatMessage } = useIntl()
    const theme = useTheme()

    return (
        <div
            className="p-24 h-full flex flex-col items-center md:justify-start justify-center relative"
            style={{ flexGrow: 1 }}
        >
            <div className="flex justify-center">
                <ReactSVG
                    src={ServerDownSvg}
                    beforeInjection={(svg) => {
                        const paths = svg.querySelectorAll('path')
                        paths.forEach((p) => {
                            p.style.fill = theme.palette.primary.main
                        })
                    }}
                />
            </div>
            <div className="flex justify-center items-center">
                <Typography
                    variant="h1"
                    className="mt-12 sm:mt-20 text-3xl md:text-4xl font-extrabold tracking-tight leading-tight md:leading-none text-center"
                >
                    {formatMessage({
                        id: 'Oops ! Une erreur est survenue !',
                        defaultMessage: 'Oops ! Une erreur est survenue !',
                    })}
                </Typography>
            </div>
            <div className="flex justify-center items-center">
                <Typography
                    variant="h5"
                    className="mt-12 text-lg tracking-tight leading-tight md:leading-none text-center"
                >
                    {formatMessage({
                        id: 'Nous rencontrons actuellement une erreur. Veuillez réessayer plus tard',
                        defaultMessage: 'Nous rencontrons actuellement une erreur. Veuillez réessayer plus tard',
                    })}
                </Typography>
            </div>
            <div className="flex justify-center items-center mt-32">
                <MuiLink
                    component={Link}
                    sx={{
                        color:
                            // eslint-disable-next-line jsdoc/require-jsdoc
                            (theme) => linksColor || theme.palette.primary.main,
                    }}
                    to={URL_CONSUMPTION}
                    underline="none"
                    className="text-lg"
                >
                    {formatMessage({
                        id: 'Revenir vers la page principale',
                        defaultMessage: 'Revenir vers la page principale',
                    })}
                </MuiLink>
            </div>
        </div>
    )
}

export default Error500
