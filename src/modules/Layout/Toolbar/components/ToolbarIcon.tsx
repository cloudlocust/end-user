import Hidden from '@mui/material/Hidden'
import NavbarLogoComponent from 'src/common/ui-kit/fuse/layouts/layout1/components/navbar/logo/NavbarLogoComponent'

/**
 * Component displays the icon.
 *
 * @returns Returns icon.
 */
const ToolbarIcon = () => {
    return (
        <Hidden lgUp>
            <NavbarLogoComponent />
        </Hidden>
    )
}
export default ToolbarIcon
