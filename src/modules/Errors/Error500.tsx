import 'src/modules/User/Register/register.scss'
import { Typography } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
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
        <div className="p-24 h-full flex flex-col items-center justify-center relative" style={{ flexGrow: 1 }}>
            <div className="flex justify-center w-full h-auto">
                <ReactSVG
                    data-testid="react-svg"
                    src={ServerDownSvg}
                    beforeInjection={(svg) => {
                        const paths = svg.querySelectorAll('path')
                        paths.forEach((p) => {
                            p.style.fill = theme.palette.primary.main
                        })
                        svg.setAttribute('style', 'width: 100%; height: 100%')
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
        </div>
    )
}

export default Error500
