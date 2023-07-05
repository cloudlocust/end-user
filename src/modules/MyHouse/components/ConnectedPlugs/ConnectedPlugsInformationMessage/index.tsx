import { useToggle } from 'react-use'
import { Typography, Box, IconButton } from '@mui/material'
import { useIntl } from 'react-intl'
import { motion } from 'framer-motion'
import { primaryContrastTextColor, primaryMainColor } from 'src/modules/utils/muiThemeVariables'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { linksColor, warningMainHashColor } from 'src/modules/utils/muiThemeVariables'

/**
 * Connected Plugs Information Component.
 *
 * @returns Connected Plugs Information Component.
 */
const ConnectedPlugsInformationMessage = () => {
    const { formatMessage } = useIntl()
    const [isShowConnectedPlugsInformationMessage, setIsShowConnectedPlugsInformationMessage] = useToggle(false)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            className="p-16 pb-0 md:p-16"
        >
            {isShowConnectedPlugsInformationMessage && (
                <Box
                    sx={{
                        textAlign: 'center',
                        backgroundColor: primaryMainColor,
                        color: primaryContrastTextColor,
                        padding: { xs: 0, md: '8px' },
                        marginBottom: '8px',
                    }}
                >
                    <Typography
                        component={motion.span}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.1 } }}
                        className="text-13 md:text-16 font-semibold"
                    >
                        {formatMessage({
                            id: "Renseignez vos prises connectées pour visualiser votre production. Pour ajouter, supprimer des prises et gérer les consentements, cliquez sur le bouton d'ajout.",
                            defaultMessage:
                                "Renseignez vos prises connectées pour visualiser votre production. Pour ajouter, supprimer des prises et gérer les consentements, cliquez sur le bouton d'ajout.",
                        })}
                    </Typography>
                </Box>
            )}

            <div className="flex justify-end items-center">
                <IconButton sx={{ p: 0 }} onClick={setIsShowConnectedPlugsInformationMessage}>
                    <ErrorOutlineIcon
                        sx={{
                            color: linksColor || warningMainHashColor,
                            width: '24px',
                            height: '24px',
                        }}
                    />
                </IconButton>
            </div>
        </motion.div>
    )
}

export default ConnectedPlugsInformationMessage
