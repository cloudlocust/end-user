import { SyntheticEvent } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, RootState } from 'src/redux'
import { useHistory } from 'react-router-dom'
import ToolbarMenuItem from './ToolbarMenuItem'
import { installationRequestsFeatureState } from 'src/modules/InstallationRequests/InstallationRequestsConfig'
import { equipmentFeatureState, URL_SOLAR_EQUIPMENTS } from 'src/modules/SolarEquipments/solarEquipmentsConfig'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import { REACT_FAQ_REDIRECT_LINK } from 'src/configs'
import { URL_ALERTS } from 'src/modules/Alerts/AlertsConfig'

// TODO This is not a generic component to share with medialem, to update.
/**
 * UserMenu UI Component placed usually in Toolbar.
 *
 * @returns UserMenu UI Component.
 */
function UserMenu() {
    /**
     * Fake UserData (which will be in the future got from the rematch state).
     */
    const { user } = useSelector(({ userModel }: RootState) => userModel)
    const [userMenu, setUserMenu] = useState<Element | null>(null)
    const dispatch = useDispatch<Dispatch>()
    const history = useHistory()

    /**
     * Handler for opening the UserMenu when clicking on UserProfile.
     *
     * @param event Event.
     */
    const userMenuClick = (
        event: SyntheticEvent & /**
         *
         */ /**
         *
         */ /**
         *
         */ {
            /**
             *
             */
            currentTarget: Element
        },
    ) => {
        setUserMenu(event.currentTarget)
    }

    /**
     * Handler for closing the userMenu.
     */
    const userMenuClose = () => {
        setUserMenu(null)
    }
    return (
        <>
            <Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={userMenuClick} color="inherit">
                <div className="hidden md:flex flex-col mx-4 items-end">
                    <Typography component="span" className="font-semibold flex">
                        {`${user?.firstName} ${user?.lastName}`}
                    </Typography>
                    {user?.role === 'enduser' && (
                        <TypographyFormatMessage className="text-11 font-medium capitalize" color="textSecondary">
                            Utilisateur
                        </TypographyFormatMessage>
                    )}
                </div>

                <Avatar className="md:mx-4">{user?.firstName !== undefined ? user?.firstName[0] : 'W'}</Avatar>
            </Button>

            <Popover
                open={Boolean(userMenu)}
                anchorEl={userMenu}
                onClose={userMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                classes={{
                    paper: 'py-8',
                }}
            >
                <>
                    <ToolbarMenuItem
                        onMenuItemClick={() => {
                            history.push('/profile-management')
                        }}
                        iconLabel="account_box"
                        idLabel="Gestion de Profil"
                        defaultMessageLabel="Gestion de Profil"
                    />
                    <ToolbarMenuItem
                        onMenuItemClick={() => {
                            history.push(URL_ALERTS)
                        }}
                        iconLabel="edit_notifications"
                        idLabel="Gestion des alertes"
                        defaultMessageLabel="Gestion des alertes"
                    />{' '}
                    <ToolbarMenuItem
                        onMenuItemClick={() => {
                            history.push('/mentions')
                        }}
                        iconLabel="gavel"
                        idLabel="Mentions"
                        defaultMessageLabel="Mentions"
                    />
                    {!installationRequestsFeatureState && (
                        <ToolbarMenuItem
                            onMenuItemClick={() => {
                                history.replace('/installation-requests')
                            }}
                            iconLabel="solar_power"
                            idLabel="Installation"
                            defaultMessageLabel="Installation"
                        />
                    )}
                    {equipmentFeatureState && (
                        <ToolbarMenuItem
                            onMenuItemClick={() => {
                                history.replace(URL_SOLAR_EQUIPMENTS)
                            }}
                            iconLabel="construction"
                            idLabel="Equipement"
                            defaultMessageLabel="Equipement"
                        />
                    )}
                    {REACT_FAQ_REDIRECT_LINK && (
                        <ToolbarMenuItem
                            onMenuItemClick={() => {
                                window.open(REACT_FAQ_REDIRECT_LINK, '_blank', 'noopener noreferrer')
                            }}
                            iconLabel="help_center"
                            idLabel="FAQ"
                            defaultMessageLabel="FAQ"
                        />
                    )}
                    <ToolbarMenuItem
                        onMenuItemClick={() => {
                            dispatch.userModel.logout()
                            history.replace('/login')
                        }}
                        iconLabel="exit_to_app"
                        idLabel="Déconnexion"
                        defaultMessageLabel="Déconnexion"
                    />
                </>
            </Popover>
        </>
    )
}

export default UserMenu
