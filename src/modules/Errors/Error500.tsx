import 'src/modules/User/Register/register.scss'
import { Typography } from 'src/common/ui-kit'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import { motion } from 'framer-motion'
import electricityRepairImg from 'src/assets/images/errors/electricity-repair.png'
import { URL_CONSUMPTION } from 'src/modules/MyConsumption'
import { linksColor } from 'src/modules/utils/muiThemeVariables'

/**
 * Error500 Component.
 *
 * @returns Modify form component.
 */
const Error500 = () => {
    const { formatMessage } = useIntl()

    return (
        <div
            className="p-24 h-full flex flex-col items-center md:justify-start justify-center relative"
            style={{ flexGrow: 1 }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center"
            >
                <img src={electricityRepairImg} alt="logo" />
            </motion.div>
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
                    {formatMessage({ id: "Revenir vers l'acceuil", defaultMessage: "Revenir vers l'acceuil" })}
                </MuiLink>
            </div>
        </div>
    )
}

export default Error500
