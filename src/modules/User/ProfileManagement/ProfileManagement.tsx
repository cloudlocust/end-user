import React, { useState } from 'react'
import { Icon, Typography } from 'src/common/ui-kit'
import PageSimple from 'src/common/ui-kit/fuse/components/PageSimple'
import { useIntl } from 'src/common/react-platform-translation'
import { useHistory } from 'react-router-dom'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { ProfileManagementForm } from './ProfileManagementForm'
import { ChangePassword } from '../ChangePassword/ChangePassword'

/**
 * Modify Profile component with the posibility to modify the profile.
 *
 * @returns Modify Profile component.
 */
const ProfileManagement = () => {
    const { formatMessage } = useIntl()
    const history = useHistory()
    const [activeChangePassword, setActiveChangePassword] = useState(false)
    /**
     * The toggleChangeForm function changes the value to open the change password window.
     */
    const toggleChangeForm = () => {
        setActiveChangePassword((isActive) => !isActive)
    }

    return (
        <PageSimple
            header={
                <div>
                    <Button onClick={history.goBack} className="text-12 md:text-16 ml-10 mt-8" color="inherit">
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
                    <div className="flex pl-16 mt-10 md:mt-0">
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
                </div>
            }
            content={
                <>
                    <ProfileManagementForm />
                    <div className="pl-16 sm:pl-24 md:pl-32">
                        <Button
                            variant="contained"
                            className="w-256 mx-auto mb-16"
                            onClick={() => {
                                history.push('/profile-management/change-password')
                                toggleChangeForm()
                            }}
                        >
                            {formatMessage({
                                id: 'Changer mon mot de passe',
                                defaultMessage: 'Changer mon mot de passe',
                            })}
                            <Icon className="ml-10">mode_edit</Icon>
                        </Button>
                    </div>
                    {activeChangePassword && <ChangePassword toggleChangeForm={toggleChangeForm} />}
                </>
            }
        />
    )
}

export default ProfileManagement
