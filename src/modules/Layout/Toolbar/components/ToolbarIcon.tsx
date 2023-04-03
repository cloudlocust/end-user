import Hidden from '@mui/material/Hidden'
import NavbarLogo from 'src/common/ui-kit/fuse/layouts/layout1/components/navbar/logo/NavbarLogo'

/**
 * Component displays the icon.
 *
 * @returns Returns icon.
 */
const ToolbarIcon = () => {
    return (
        <Hidden lgUp>
            <NavbarLogo />
        </Hidden>
    )
}
export default ToolbarIcon
