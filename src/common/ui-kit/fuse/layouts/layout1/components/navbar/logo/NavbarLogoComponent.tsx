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
    const lgUp = useMediaQuery(theme.breakpoints.up('lg'))

    const clientApplicationURL: string | undefined = CLIENT_WEBSITE_URL

    const logoPath = lgUp
        ? `./clients-icons/${CLIENT_ICON_FOLDER}/${CLIENT_ICON_FOLDER}-on-primary.svg`
        : `./clients-icons/${CLIENT_ICON_FOLDER}/${CLIENT_ICON_FOLDER}.svg`

    return (
        <a
            className={clientApplicationURL ? 'hoverableLogoLink' : ''}
            href={clientApplicationURL ? clientApplicationURL : undefined}
        >
            <img className={lgUp ? 'my-32' : 'ml-8'} src={logoPath} width={lgUp ? '60' : '45'} alt="logo" />
        </a>
    )
}

export default NavbarLogoComponent
