import './navbarLogo.style.scss'

import { CLIENT_ICON_FOLDER, CLIENT_LOGO_REDIRECT_LINK } from 'src/configs'
import { useMediaQuery, useTheme } from '@mui/material'

/**
 * Component for Navbar Logo (Mobile & Desktop).
 *
 * @returns Navbar Logo Component.
 */
const NavbarLogo = () => {
    const theme = useTheme()
    const lgUp = useMediaQuery(theme.breakpoints.up('lg'))

    const clientApplicationURL: string = CLIENT_LOGO_REDIRECT_LINK

    const isValidRedirectLink = clientApplicationURL && clientApplicationURL.startsWith('http')

    const logoPath = lgUp
        ? `./clients-icons/${CLIENT_ICON_FOLDER}/${CLIENT_ICON_FOLDER}-on-primary.svg`
        : `./clients-icons/${CLIENT_ICON_FOLDER}/${CLIENT_ICON_FOLDER}.svg`

    if (!isValidRedirectLink) {
        return <img className={lgUp ? 'my-32' : 'ml-8'} src={logoPath} width={lgUp ? '60' : '45'} alt="logo" />
    }

    return (
        <a
            className={isValidRedirectLink ? 'hoverableLogoLink' : ''}
            href={isValidRedirectLink ? clientApplicationURL : ''}
        >
            <img className={lgUp ? 'my-32' : 'ml-8'} src={logoPath} width={lgUp ? '60' : '45'} alt="logo" />
        </a>
    )
}

export default NavbarLogo
