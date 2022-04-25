import { SyntheticEvent } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useIntl } from 'react-intl'

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
    // const { user } = useSelector(({ userModel }: RootState) => userModel)
    const user = {
        id: '1',
        firstName: 'Orlando',
        lastName: 'Jackson',
        email: 'succes@gmail.com',
        phone: '+33 1 23 45 67 89',
        address: {
            name: 'Apt. 556, Gwenborough. 92998-3874',
            city: 'Gwenborough',
            zip_code: '92998-3874',
            address_addition: 'testFDF',
            country: 'France',
            lat: 45.706877,
            lng: 5.011265,
            extra_data: {},
        },
        is_active: true,
        is_verified: true,
        is_super_user: false,
    }
    const [userMenu, setUserMenu] = useState<Element | null>(null)
    // const dispatch = useDispatch<Dispatch>()
    const { formatMessage } = useIntl()

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
                    <MenuItem
                        onClick={() => {
                            // dispatch.userModel.logout()
                            // history.replace('/login')
                        }}
                        role="button"
                    >
                        <ListItemIcon className="min-w-40">
                            <Icon>exit_to_app</Icon>
                        </ListItemIcon>
                        <ListItemText
                            primary={formatMessage({
                                id: 'Déconnexion',
                                defaultMessage: 'Déconnexion',
                            })}
                        />
                    </MenuItem>
                </>
            </Popover>
        </>
    )
}

export default UserMenu
