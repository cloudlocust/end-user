import AppBar from '@mui/material/AppBar'
import Hidden from '@mui/material/Hidden'
import Toolbar from '@mui/material/Toolbar'
import NavbarToggleButton from 'src/common/ui-kit/fuse/components/NavbarToggleButton'
import clsx from 'clsx'
import { useTheme } from '@mui/material/styles'

/**
 * ToolbarLayout1 UI Component.
 *
 * @param props Props.
 * @param props.className Additional Styling className.
 * @param props.toggleMobileNavbarOpen Handler when clicking on the navbar toggle button (mobile devices).
 * @param props.toggleNavbarOpen Handler when clicking on the navbar toggle button (for other devices not mobile).
 * @param props.toolbarContent Represent the content that's gonna be displayed in the Toolbar.
 * @returns ToolbarLayout1 UI Component.
 */
function ToolbarLayout1(props: /**
 *
 */
{
    /**
     *
     */
    className?: string
    /**
     *
     */
    toggleMobileNavbarOpen?: () => void
    /**
     *
     */
    toggleNavbarOpen?: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    toolbarContent?: JSX.Element
}) {
    const theme = useTheme()

    return (
        <AppBar
            id="fuse-toolbar"
            className={clsx('flex relative z-20 shadow-md', props.className ? props.className : '')}
            sx={{ backgroundColor: theme.palette.background.paper }}
            color="default"
            position="static"
        >
            <Toolbar className="p-0 min-h-48 md:min-h-64">
                <div className="flex px-16">
                    <>
                        <Hidden lgDown>
                            <NavbarToggleButton
                                className="w-40 h-40 p-0 mx-0"
                                toggleMobileNavbarOpen={props.toggleMobileNavbarOpen!}
                                toggleNavbarOpen={props.toggleNavbarOpen!}
                            />
                        </Hidden>
                    </>
                </div>

                <div className="flex flex-1 items-center px-8 h-full overflow-x-auto">
                    {props.toolbarContent ? props.toolbarContent : <></>}
                </div>
            </Toolbar>
        </AppBar>
    )
}

export default ToolbarLayout1
