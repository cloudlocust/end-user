import Icon from '@mui/material/Icon'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import { useIntl } from 'react-intl'

/**
 * Interface for ToolbarMenuItem.
 */
interface IMenuItem {
    /**
     * Action is performed when the menu item is clicked.
     */
    onMenuItemClick: () => void
    /**
     * Menu item icon.
     */
    iconLabel: string
    /**
     * Menu item id.
     */
    idLabel: string
    /**
     * Menu item text.
     */
    defaultMessageLabel: string
}
/**
 * Component displays a menu with items.
 *
 * @param root0 Items menu.
 * @param root0.onMenuItemClick Action is performed when the menu item is clicked.
 * @param root0.iconLabel Menu item icon.
 * @param root0.idLabel Menu item id.
 * @param root0.defaultMessageLabel Menu item text.
 * @returns Returns menu with items.
 */
const ToolbarMenuItem = ({ onMenuItemClick, iconLabel, idLabel, defaultMessageLabel }: IMenuItem) => {
    const { formatMessage } = useIntl()
    return (
        <MenuItem onClick={onMenuItemClick} role="button">
            <ListItemIcon className="min-w-40">
                <Icon>{iconLabel}</Icon>
            </ListItemIcon>
            <ListItemText
                primary={formatMessage({
                    id: idLabel,
                    defaultMessage: defaultMessageLabel,
                })}
            />
        </MenuItem>
    )
}
export default ToolbarMenuItem
