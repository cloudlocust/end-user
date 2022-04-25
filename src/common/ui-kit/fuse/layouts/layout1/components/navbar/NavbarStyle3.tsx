import React from 'react'
import Hidden from '@mui/material/Hidden'
import { Theme, styled, useTheme } from '@mui/material/styles'
import GlobalStyles from '@mui/material/GlobalStyles'
import { navbarItemType } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import NavbarStyle3Content from './NavbarStyle3Content'
import NavbarMobileContent from './NavbarMobileContent'

const navbarWidth = 120
const navbarWidthDense = 64
const panelWidth = 280

const StyledNavBar = styled('div')</**
 *
 */
{
    /**
     *
     */
    theme?: Theme
    /**
     *
     */
    open?: boolean
}>(({ theme, open }) => ({
    minWidth: navbarWidth,
    width: navbarWidth,
    maxWidth: navbarWidth,

    ...(!open && {
        marginLeft: -navbarWidthDense,
    }),

    ...(!open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -navbarWidth,
    }),

    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

/**
 * NavbarStyle3 Component.
 *
 * @param props Props.
 * @param props.navbarCloseMobile Handler Close navbar when (mobile devices).
 * @param props.navbarOpen Open the navbar when it's not mobile).
 * @param props.mobileNavbarOpen Open the navbar when it's mobile devices).
 * @param props.navbarContent Represent the content that's gonna be displayed in the navbar.
 * @returns NavbarStyle3 Component.
 */
function NavbarStyle3({
    navbarOpen,
    mobileNavbarOpen,
    navbarCloseMobile,
    navbarContent,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    /**
     *
     */
    navbarOpen?: boolean
    /**
     *
     */
    mobileNavbarOpen?: boolean
    /**
     *
     */
    navbarCloseMobile: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    navbarContent: navbarItemType[]
}) {
    const theme = useTheme()
    return (
        <>
            <GlobalStyles
                styles={() => ({
                    '& #fuse-navbar-side-panel': {
                        width: navbarWidth,
                        minWidth: navbarWidth,
                        maxWidth: navbarWidth,
                    },
                    '& #fuse-navbar-panel': {
                        maxWidth: '100%',
                        width: panelWidth,
                        [theme.breakpoints.up('lg')]: {
                            minWidth: panelWidth,
                            maxWidth: 'initial',
                        },
                    },
                })}
            />
            <Hidden lgDown>
                <StyledNavBar
                    open={navbarOpen!}
                    className="flex-col flex-auto sticky top-0 h-screen flex-shrink-0 z-20 shadow-5"
                >
                    <NavbarStyle3Content navbarContent={navbarContent} />
                </StyledNavBar>
            </Hidden>
            <Hidden lgUp>
                <NavbarMobileContent navbarContent={navbarContent} />
            </Hidden>
        </>
    )
}

export default NavbarStyle3
