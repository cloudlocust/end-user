import './navbarLogo.style.scss'

import { CLIENT_ICON_FOLDER, CLIENT_WEBSITE_URL } from 'src/configs'
import { useMediaQuery, useTheme } from '@mui/material'

/**
 * Component for Navbar Logo (Mobile & Desktop).
 *
 * @returns Navbar Logo Component.
 */
const NavbarLogoComponent = () => {
    const theme = useTheme()
    const mdUp = useMediaQuery(theme.breakpoints.up('md'))

    const clientApplicationURL: string | undefined = CLIENT_WEBSITE_URL

    const logoPath = mdUp
        ? `./clients-icons/${CLIENT_ICON_FOLDER}/${CLIENT_ICON_FOLDER}-on-primary.svg`
        : `./clients-icons/${CLIENT_ICON_FOLDER}/${CLIENT_ICON_FOLDER}.svg`

    return (
        <a
            className={clientApplicationURL ? 'hoverableLogoLink' : ''}
            href={clientApplicationURL ? clientApplicationURL : undefined}
        >
            <img className={mdUp ? 'my-32' : 'ml-8'} src={logoPath} width={mdUp ? '60' : '45'} alt="logo" />
        </a>
    )
}

export default NavbarLogoComponent
