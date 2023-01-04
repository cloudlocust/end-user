import { createContext, ReactChildren, ReactElement, ReactNode } from 'react'
import { AlertsDrawerContextType } from 'src/modules/shared/AlertsDrawerContext/index.d'
import { useToggle } from 'react-use'

/**
 * Alerts Drawer Context.
 */
export const AlertsDrawerContext = createContext<AlertsDrawerContextType>({
    isAlertsDrawerOpen: false,
})

/**
 * AlertsDrawer Provider.
 *
 * @param param0 N/A.
 * @param param0.children Children.
 * @returns Context values/functions.
 */
// eslint-disable-next-line jsdoc/require-jsdoc
export const AlertsDrawerProvider = ({ children }: { children: ReactNode | ReactChildren | ReactElement }) => {
    const [isAlertsDrawerOpen, setIsOpenDrawerOpen] = useToggle(false)

    /**
     * Callback function to open alerts drawer.
     */
    const handleOpenAlertsDrawer = () => {
        setIsOpenDrawerOpen(true)
    }

    /**
     * Callback function to close alerts drawer.
     */
    const handleCloseAlertsDrawer = () => {
        setIsOpenDrawerOpen(false)
    }

    return (
        <AlertsDrawerContext.Provider value={{ isAlertsDrawerOpen, handleOpenAlertsDrawer, handleCloseAlertsDrawer }}>
            {children}
        </AlertsDrawerContext.Provider>
    )
}
