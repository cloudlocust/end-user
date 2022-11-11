import Hidden from '@mui/material/Hidden'
import { CLIENT_ICON_FOLDER } from 'src/configs'

/**
 * Component displays the icon.
 *
 * @returns Returns icon.
 */
const ToolbarIcon = () => {
    return (
        <Hidden lgUp>
            <img className="ml-8" src={`/assets/images/logos/${CLIENT_ICON_FOLDER}.svg`} alt="logo" width="45" />
        </Hidden>
    )
}
export default ToolbarIcon
