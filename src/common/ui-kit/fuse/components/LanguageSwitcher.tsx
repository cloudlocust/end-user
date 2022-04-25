import Button from '@mui/material/Button'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const languages = [
    { id: 'fr', title: 'Français', flag: 'fr' },
    { id: 'en', title: 'English', flag: 'us' },
    { id: 'tr', title: 'Turkish', flag: 'tr' },
    { id: 'ar', title: 'Arabic', flag: 'sa' },
]

/**
 * React UI component that shows languages menu that can be selected for the application (it is located in the navbar).
 *
 * @returns UI Language Switcher Menu.
 */
function LanguageSwitcher() {
    const currentLanguage = languages[0]
    const [menu, setMenu] = useState<Element | null>(null)

    /**
     * Handler for langMenuClick.
     *
     * @param event Event when clicking on languageSwitcher.
     */
    const langMenuClick = (
        event: React.SyntheticEvent & /**
         *
         */ /**
         *
         */ /**
         *
         */ /**
         *
         */ /**
         *
         */ {
            /**
             * Represent the HTML Element of IconButton.
             */
            currentTarget: Element
        },
    ) => {
        setMenu(event.currentTarget)
    }

    /**
     * Handler for Language Menu Close.
     */
    const langMenuClose = () => {
        setMenu(null)
    }

    return (
        <>
            <Button className="h-40 w-64" onClick={langMenuClick}>
                <img
                    className="mx-4 min-w-20"
                    src={`/assets/images/flags/${currentLanguage.flag}.png`}
                    alt={currentLanguage.title}
                />

                <Typography className="mx-4 font-semibold uppercase" color="textSecondary">
                    {currentLanguage.id}
                </Typography>
            </Button>

            <Popover
                open={Boolean(menu)}
                anchorEl={menu}
                onClose={langMenuClose}
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
                {languages.map((lng) => (
                    <MenuItem key={lng.id} onClick={() => {}}>
                        <ListItemIcon className="min-w-40">
                            <img className="min-w-20" src={`/assets/images/flags/${lng.flag}.png`} alt={lng.title} />
                        </ListItemIcon>
                        <ListItemText primary={lng.title} />
                    </MenuItem>
                ))}

                <MenuItem component={Link} to="/customers" onClick={langMenuClose} role="button">
                    <ListItemText primary="Learn More" />
                </MenuItem>
            </Popover>
        </>
    )
}

export default LanguageSwitcher
