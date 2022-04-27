import { styled, ThemeProvider, useTheme } from '@mui/material/styles'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import clsx from 'clsx'
import { useState, useEffect } from 'react'
import FuseNavigation, { navbarItemType } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import FuseScrollbars from 'src/common/ui-kit/fuse/components/FuseScrollbars'
import { useLocation } from 'react-router-dom'
import { Location } from 'history'
import { selectContrastMainTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import useMediaQuery from '@mui/material/useMediaQuery'

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
}))

const StyledPanel = styled('div')</**
 *
 */
{
    /**
     *
     */
    opened: boolean
    /**
     *
     */
    option: any
}>(({ theme, opened }) => ({
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    transition: theme.transitions.create(['opacity'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shortest,
    }),
    opacity: 0,
    pointerEvents: 'none',
    ...(opened && {
        opacity: 1,
        pointerEvents: 'initial',
    }),
}))

/**
 * Check if the item needs to be opened in a verticlCollaps, based on react-router location.
 *
 * @param location Location object of useLocation.
 * @param item NavigationItemType.
 * @returns If NeedsToBeOpen;.
 */
export function needsToBeOpened(location: Location, item: navbarItemType) {
    return location && isUrlInChildren(item, location.pathname)
}

/**
 * Utility function to test if a url of a FuveNavItem is in its children to be rendered.
 *
 * @param parent Parent Item.
 * @param url Item url looking for it in.
 * @returns Returns Boolean.
 */
export function isUrlInChildren(parent: navbarItemType, url: string) {
    if (!parent.children) {
        return false
    }

    for (let i = 0; i < parent.children.length; i += 1) {
        if (parent.children[i].children && isUrlInChildren(parent.children[i], url)) {
            return true
        }

        if (parent.children[i].url === url || url.includes(parent.children[i].url!)) {
            return true
        }
    }

    return false
}

/**
 * NavbarContent UI for the style3 when it's the layout1 of Fuse.
 *
 * @param props Props.
 * @param props.navbarCloseMobile When it's navbarMobile it has a closeNavbar when it's small.
 * @param props.navbarContent Represent the content that's gonna be displayed in the navbar.
 * @returns NavbarStyle3Content UI.
 */
function NavbarStyle3Content(props: /**
 *
 */
{
    /**
     *
     */
    navbarCloseMobile?: () => void
    // eslint-disable-next-line jsdoc/require-jsdoc
    navbarContent: navbarItemType[]
}) {
    const theme = useTheme()
    const [selectedNavigation, setSelectedNavigation] = useState<navbarItemType[] | []>([])
    const mdDown = useMediaQuery(theme.breakpoints.down('lg'))
    const [panelOpen, setPanelOpen] = useState(false)
    const { navbarContent, navbarCloseMobile } = props

    const contrastTheme = selectContrastMainTheme(theme.palette.primary.main)
    const location = useLocation()

    useEffect(() => {
        navbarContent?.forEach((item) => {
            if (needsToBeOpened(location, item)) {
                setSelectedNavigation([item])
            }
        })
    }, [location, navbarContent])

    /**
     * Handler for when we click parent of item (parent means the level on top of this item) in the navbar.
     *
     * @param selected SelectedItem.
     */
    function handleParentItemClick(selected: navbarItemType) {
        /**
          If there is no child item do not set/open panel.
         */
        if (!selected.children) {
            setSelectedNavigation([])
            setPanelOpen(false)
            return
        }

        /**
         * If navigation already selected toggle panel visibility.
         */
        if (selectedNavigation[0]?.id === selected.id) {
            setPanelOpen(!panelOpen)
        } else {
            /**
             * Set navigation and open panel.
             */
            setSelectedNavigation([selected])
            setPanelOpen(true)
        }
    }

    /**
     *  Handler for when we click on an item in the navbar.
     *
     * @param selected SelectedItem.
     */
    function handleChildItemClick(selected: navbarItemType) {
        setPanelOpen(false)
        if (mdDown && navbarCloseMobile) {
            navbarCloseMobile()
        }
    }

    return (
        <ClickAwayListener onClickAway={() => setPanelOpen(false)}>
            <Root className={'flex flex-auto flex h-full'}>
                <ThemeProvider theme={contrastTheme}>
                    <div id="fuse-navbar-side-panel" className="flex flex-shrink-0 flex-col items-center">
                        <img
                            className="w-44 my-32"
                            src={`/assets/images/logos/${window._env_.REACT_APP_CLIENT_ICON_FOLDER}-on-primary.svg`}
                            alt="logo"
                        />
                        <FuseScrollbars
                            className="flex flex-1 min-h-0 justify-center w-full overflow-y-auto overflow-x-hidden"
                            option={{ suppressScrollX: true, wheelPropagation: false }}
                        >
                            <FuseNavigation
                                className={clsx('navigation')}
                                navigation={navbarContent}
                                layout="vertical-2"
                                onItemClick={handleParentItemClick}
                                selectedId={selectedNavigation[0]?.id}
                            />
                        </FuseScrollbars>
                    </div>
                </ThemeProvider>

                {selectedNavigation.length > 0 && (
                    <StyledPanel
                        id="fuse-navbar-panel"
                        opened={panelOpen}
                        className={clsx('shadow-5 overflow-y-auto overflow-x-hidden')}
                        option={{ suppressScrollX: true, wheelPropagation: false }}
                    >
                        <FuseNavigation
                            className={clsx('navigation')}
                            navigation={selectedNavigation}
                            layout="vertical"
                            onItemClick={handleChildItemClick}
                        />
                    </StyledPanel>
                )}
            </Root>
        </ClickAwayListener>
    )
}

export default NavbarStyle3Content
