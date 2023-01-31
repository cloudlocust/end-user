import { Badge, IconButton, SvgIcon } from '@mui/material'
import { useContext } from 'react'
import { AlertsDrawer } from 'src/modules/Layout/Toolbar/components/Alerts/AlertsDrawer'
import { AlertsDrawerContext } from 'src/modules/shared/AlertsDrawerContext'
import { ReactComponent as AlertsIcon } from 'src/assets/images/alerts/alertIcon.svg'

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
                    <SvgIcon>
                        <AlertsIcon data-testid="alerts-icon" />
                    </SvgIcon>
                </Badge>
            </IconButton>
            {isAlertsDrawerOpen && <AlertsDrawer closeAlertsDrawer={handleCloseAlertsDrawer!} />}
        </>
    )
}
