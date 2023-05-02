import { Icon, Typography } from 'src/common/ui-kit'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useIntl } from 'src/common/react-platform-translation'
import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { ProfileManagementForm } from 'src/modules/User/ProfileManagement/ProfileManagementForm'
import DeleteProfile from 'src/modules/User/DeleteProfile/DeleteProfile'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import { deleteAcountFeatureState } from 'src/modules/User/ProfileManagement/ProfileManagementConfig'

/**
 * Modify Profile component with the possibility to modify the profile.
 *
 * @returns Modify Profile component.
 */
const ProfileManagement = () => {
    const { formatMessage } = useIntl()
    const history = useHistory()
    const theme = useTheme()

    return (
        <PageSimple
            header={
                <ThemeProvider theme={theme}>
                    <div className="w-full h-full px-10" style={{ backgroundColor: theme.palette.primary.dark }}>
                        <Button
                            sx={{ color: 'primary.contrastText' }}
                            onClick={history.goBack}
                            className="text-12 md:text-16 mt-10"
                            color="inherit"
                        >
                            <Icon
                                component={motion.span}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, transition: { delay: 0.2 } }}
                                className="text-16 md:text-24 mr-2"
                            >
                                arrow_back
                            </Icon>
                            {formatMessage({ id: 'retour', defaultMessage: 'Retour' })}
                        </Button>
                        <div className="flex pl-16 mt-6 md:mt-0 justify-between w-full">
                            <div className="flex">
                                <Icon
                                    component={motion.span}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1, transition: { delay: 0.2 } }}
                                    className="text-24 md:text-32"
                                >
                                    account_box
                                </Icon>
                                <Typography
                                    component={motion.span}
                                    initial={{ x: -20 }}
                                    animate={{ x: 0, transition: { delay: 0.2 } }}
                                    className="sm:flex text-18 sm:text-20 md:text-24 mx-12 font-semibold"
                                >
                                    {formatMessage({
                                        id: 'Mes Informations',
                                        defaultMessage: 'Mes Informations',
                                    })}
                                </Typography>
                            </div>
                            {!deleteAcountFeatureState && <DeleteProfile />}
                        </div>
                    </div>
                </ThemeProvider>
            }
            content={<ProfileManagementForm />}
        />
    )
}

export default ProfileManagement
