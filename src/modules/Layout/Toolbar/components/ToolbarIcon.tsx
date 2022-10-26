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
            <img className="w-32 m-8" src={`/assets/images/logos/${CLIENT_ICON_FOLDER}.svg`} alt="logo" />
        </Hidden>
    )
}
export default ToolbarIcon
