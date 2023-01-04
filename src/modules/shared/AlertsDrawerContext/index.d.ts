/**
 * Alerts Drawer Context type.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export type AlertsDrawerContextType = {
    /**
     * Boolean state of drawer open or not.
     */
    isAlertsDrawerOpen: boolean
    /**
     * Callback function to open alerts drawer.
     */
    handleOpenAlertsDrawer?: () => void
    /**
     * Callback function to close alerts drawer.
     */
    handleCloseAlertsDrawer?: () => void
}
