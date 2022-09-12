import Hidden from '@mui/material/Hidden'

/**
 * Component displays a menu with items.
 *
 * @returns Returns menu with items.
 */
const ToolbarIcon = () => {
    return (
        <Hidden lgUp>
            <img
                className="w-32 m-8"
                src={`/assets/images/logos/${window._env_.REACT_APP_CLIENT_ICON_FOLDER}.svg`}
                alt="logo"
            />
        </Hidden>
    )
}
export default ToolbarIcon
