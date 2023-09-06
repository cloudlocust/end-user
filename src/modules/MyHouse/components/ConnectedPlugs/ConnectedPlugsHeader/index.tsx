import { Button, Icon, ThemeProvider, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import { selectTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { motion } from 'framer-motion'
import { useHistory } from 'react-router'
import { ButtonLoader } from 'src/common/ui-kit'
import { ConnectedPlugsHeaderPropsType } from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'

/**
 * ConnectedPlugs header element.
 *
 * @param props N/A.
 * @param props.onAddClick Callback after closing shelly connected plugs window.
 * @param props.isConnectedPlugListLoading Loading of connected plugs list.
 * @returns ConnectedPlugsHeader component.
 */
const ConnectedPlugsHeader = ({ onAddClick, isConnectedPlugListLoading }: ConnectedPlugsHeaderPropsType) => {
    const mainTheme = selectTheme()
    const { formatMessage } = useIntl()
    const history = useHistory()

    return (
        <ThemeProvider theme={mainTheme}>
            <div className="flex flex-1 w-full items-center justify-between">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                    >
                        <Button
                            sx={{ color: 'primary.contrastText' }}
                            onClick={history.goBack}
                            className="text-16 ml-12"
                        >
                            <Icon
                                component={motion.span}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, transition: { delay: 0.2 } }}
                                className="text-16 md:text-24 mr-2 text"
                            >
                                arrow_back
                            </Icon>
                            {formatMessage({ id: 'Retour', defaultMessage: 'Retour' })}
                        </Button>
                    </motion.div>
                    <div className="flex items-center gap-4 my-4 md:my-8">
                        <Icon className="text-24 md:text-32">electrical_services</Icon>
                        <Typography
                            component={motion.span}
                            initial={{ x: -20 }}
                            animate={{ x: 0, transition: { delay: 0.2 } }}
                            className="text-16 md:text-24 font-semibold"
                        >
                            {formatMessage({
                                id: 'Prises connectées Shelly',
                                defaultMessage: 'Prises connectées Shelly',
                            })}
                        </Typography>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-end px-12">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                    >
                        <ButtonLoader
                            className="whitespace-nowrap"
                            variant="contained"
                            color="secondary"
                            inProgress={isConnectedPlugListLoading}
                            onClick={onAddClick}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'secondary.main',
                                    opacity: '.7',
                                },
                            }}
                        >
                            <span className="hidden sm:flex">
                                {formatMessage({
                                    id: 'Ajouter une prise',
                                    defaultMessage: 'Ajouter une prise',
                                })}
                            </span>
                            <span className="flex sm:hidden">
                                <Icon>add</Icon>
                            </span>
                        </ButtonLoader>
                    </motion.div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default ConnectedPlugsHeader
