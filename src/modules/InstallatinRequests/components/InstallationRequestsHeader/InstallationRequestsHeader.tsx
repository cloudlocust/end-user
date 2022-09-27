import Icon from '@mui/material/Icon'
import Button from '@mui/material/Button'
import { ThemeProvider } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { motion } from 'framer-motion'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { useIntl } from 'src/common/react-platform-translation'

/**
 * Header component.
 *
 * @returns InstallationsRequestsHeader component.
 */
export const InstallationRequestsHeader = (): JSX.Element => {
    const mainTheme = selectTheme()
    const { formatMessage } = useIntl()

    return (
        <div className="flex flex-1 w-full items-center justify-between">
            <div className="flex items-center">
                <Icon
                    component={motion.span}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, transition: { delay: 0.2 } }}
                    className="text-24 md:text-32"
                >
                    list_alt
                </Icon>
                <Typography
                    component={motion.span}
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.2 } }}
                    className="text-16 md:text-24 mx-12 font-semibold"
                >
                    <span className="hidden sm:flex">
                        {formatMessage({
                            id: "Demandes d'installations",
                            defaultMessage: "Demandes d'installations",
                        })}
                    </span>
                    <span className="flex sm:hidden">
                        {formatMessage({
                            id: 'Demandes',
                            defaultMessage: 'Demandes',
                        })}
                    </span>
                </Typography>
            </div>

            <div className="flex flex-1 items-center justify-end px-12">
                <ThemeProvider theme={mainTheme}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                    >
                        <Button
                            className="whitespace-nowrap"
                            variant="contained"
                            color="secondary"
                            onClick={() => null}
                        >
                            <span className="hidden sm:flex">
                                {formatMessage({
                                    id: 'Ajouter une demande',
                                    defaultMessage: 'Ajouter une demande',
                                })}
                            </span>
                            <span className="flex sm:hidden">
                                <Icon>add</Icon>
                            </span>
                        </Button>
                    </motion.div>
                </ThemeProvider>
            </div>
        </div>
    )
}
