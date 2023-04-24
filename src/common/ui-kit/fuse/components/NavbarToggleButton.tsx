import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'

/**
 *
 */
type TypeNavbarToggleButtonProps =
    /**
     *
     */
    /**
     *
     */ /**
     *
     */
    {
        /**
         *
         */
        className?: string
        /**
         *
         */
        children: JSX.Element
        /**
         *
         */
        toggleMobileNavbarOpen?: () => void
        /**
         *
         */
        toggleNavbarOpen?: () => void
    }

/**.
 * Navbar Icon JSX Component to toggl navbar between folded and unfolded
 *
 * @param props Props.
 * @param props.className Additional Styling ClassName to be applied.
 * @param props.children JSX Element wrapped by NavbarToggleButton component, children are the icon (as in defaultProps).
 * @param props.toggleMobileNavbarOpen Handler when clicking on the navbar toggle button (mobile devices).
 * @param props.toggleNavbarOpen Handler when clicking on the navbar toggle button (for other devices not mobile).
 * @returns IconButton of the navbarToggler Icon
 */
function NavbarToggleButton(props: TypeNavbarToggleButtonProps) {
    const theme = useTheme()
    const mdDown = useMediaQuery(theme.breakpoints.down('lg'))

    return (
        <IconButton
            className={props.className}
            color="inherit"
            size="small"
            onClick={() => {
                if (mdDown) {
                    if (props.toggleMobileNavbarOpen) props.toggleMobileNavbarOpen()
                } else {
                    if (props.toggleNavbarOpen) props.toggleNavbarOpen()
                }
            }}
        >
            {props.children}
        </IconButton>
    )
}

NavbarToggleButton.defaultProps = {
    children: (
        <Icon fontSize="inherit" className="text-16">
            menu_open
        </Icon>
    ),
}

export default NavbarToggleButton
