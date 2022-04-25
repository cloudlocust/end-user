import { styled } from '@mui/material/styles'
import { useToggle } from 'react-use'
import { navbarItemType } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import NavbarStyle3 from './components/navbar/NavbarStyle3'
import ToolbarLayout1 from './components/ToolbarLayout1'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const Root = styled('div')()

/**
 * Represent the static Layout1.
 *
 * @param props Props.
 * @param props.children Children Components.
 * @param props.displayToolbar Display Toolbar.
 * @param props.displayNavbar Display navbar.
 * @param props.navbarContent Represent the content that's gonna be displayed in the navbar.
 * @param props.toolbarContent Represent the content that's gonna be displayed in the Toolbar.
 * @returns Layout1 UI Component.
 */
function Layout1({
    children,
    displayToolbar = true,
    displayNavbar = true,
    navbarContent,
    toolbarContent,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    children: JSX.Element
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayToolbar?: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    displayNavbar?: boolean
    // eslint-disable-next-line jsdoc/require-jsdoc
    navbarContent: navbarItemType[]
    // eslint-disable-next-line jsdoc/require-jsdoc
    toolbarContent?: JSX.Element
}) {
    const [mobileNavbarOpen, toggleMobileNavbarOpen] = useToggle(false)
    const [navbarOpen, toggleNavbarOpen] = useToggle(true)

    const theme = useTheme()
    const lgDown = useMediaQuery(theme.breakpoints.down('lg'))

    /**
     *  Handler for closing mobileNavbar.
     */
    function navbarCloseMobile() {
        toggleMobileNavbarOpen(false)
    }

    return (
        <Root id="fuse-layout" className="w-full flex">
            <div className="flex flex-auto min-w-0">
                {displayNavbar && (
                    <NavbarStyle3
                        navbarOpen={navbarOpen}
                        navbarContent={navbarContent}
                        mobileNavbarOpen={mobileNavbarOpen}
                        navbarCloseMobile={navbarCloseMobile}
                    />
                )}

                <main
                    id="fuse-main"
                    className="flex flex-col flex-auto min-h-screen min-w-0 relative z-10 overflow-y-auto"
                >
                    {displayToolbar && (
                        <ToolbarLayout1
                            toggleMobileNavbarOpen={toggleMobileNavbarOpen}
                            toggleNavbarOpen={toggleNavbarOpen}
                            toolbarContent={toolbarContent}
                        />
                    )}
                    <div className={`flex flex-col flex-auto min-h-0 relative z-10 ${lgDown && 'mb-60'}`}>
                        {children}
                    </div>
                </main>
            </div>
        </Root>
    )
}

export default Layout1
