import { Badge, IconButton } from '@mui/material'
import { useContext } from 'react'
import ReportIcon from '@mui/icons-material/Report'
import { AlertsDrawer } from 'src/modules/Layout/Toolbar/components/Alerts/AlertsDrawer'
import { AlertsDrawerContext } from 'src/modules/shared/AlertsDrawerContext'

/**
 * Alerts component. Place in the top navbar. ToolbarWidget.
 *
 * @returns Relevant Alerts components.
 */
export const Alerts = () => {
    const { isAlertsDrawerOpen, handleCloseAlertsDrawer, handleOpenAlertsDrawer } = useContext(AlertsDrawerContext)

    return (
        <>
            <IconButton onClick={handleOpenAlertsDrawer} size="large">
                <Badge color="error">
                    <ReportIcon />
                </Badge>
            </IconButton>
            {isAlertsDrawerOpen && <AlertsDrawer closeAlertsDrawer={handleCloseAlertsDrawer!} />}
        </>
    )
}
