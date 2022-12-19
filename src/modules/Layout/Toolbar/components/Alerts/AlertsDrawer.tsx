import { SwipeableDrawer, IconButton, Icon } from '@mui/material/'
import { styled } from '@mui/material/styles'

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        backgroundColor: theme.palette.background.default,
        width: 320,
    },
}))

/**
 * Alerts Drawer component contains all the alerts.
 *
 * @param param0 N/A.
 * @param param0.closeAlertsDrawer CloseAlertDrawer callback function to close the drawer.
 * @returns Alerts Drawer JSX.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const AlertsDrawer = ({ closeAlertsDrawer }: { closeAlertsDrawer: () => void }) => {
    return (
        <StyledSwipeableDrawer
            open={true}
            anchor="right"
            // onOpen is a required prop to add in SwipeableDrawer even if it's empty.
            onOpen={(ev) => {}}
            onClose={closeAlertsDrawer}
            disableSwipeToOpen
        >
            <IconButton className="m-4 absolute top-0 right-0 z-999" onClick={closeAlertsDrawer} size="large">
                <Icon color="action">close</Icon>
            </IconButton>
        </StyledSwipeableDrawer>
    )
}
