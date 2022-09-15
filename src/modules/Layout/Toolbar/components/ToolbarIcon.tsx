import Hidden from '@mui/material/Hidden'

/**
 * Component displays the icon.
 *
 * @returns Returns icon.
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
