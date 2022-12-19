import { Badge, IconButton } from '@mui/material'
import { useState } from 'react'
import ReportIcon from '@mui/icons-material/Report'
import { AlertsDrawer } from 'src/modules/Layout/Toolbar/components/Alerts/AlertsDrawer'

/**
 * Alerts component. Place in the top navbar. ToolbarWidget.
 *
 * @returns Relevant Alerts components.
 */
export const Alerts = () => {
    const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false)

    /**
     * Close the Alert drawer.
     */
    const closeAlertsDrawer = () => {
        setIsAlertDrawerOpen(false)
    }

    /**
     * Open Alerts drawer.
     */
    const openAlertsDrawer = () => {
        setIsAlertDrawerOpen(true)
    }

    return (
        <>
            <IconButton onClick={openAlertsDrawer} size="large">
                <Badge color="error">
                    <ReportIcon />
                </Badge>
            </IconButton>
            {isAlertDrawerOpen && <AlertsDrawer closeAlertsDrawer={closeAlertsDrawer} />}
        </>
    )
}
