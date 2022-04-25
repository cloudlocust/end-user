import React, { useEffect, useState } from 'react'
import NavLinkAdapter from 'src/common/ui-kit/fuse/utils/NavLinkAdapter'
import { styled, ThemeProvider } from '@mui/material/styles'
import FuseNavigation, { navbarItemType } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import BottomNavigation from '@mui/material/BottomNavigation'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useLocation } from 'react-router-dom'
import { Location } from 'history'
import Icon from '@mui/material/Icon'
import clsx from 'clsx'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { selectMyemTheme } from 'src/common/ui-kit/fuse/utils/theming-generator'
import { BottomNavigationAction } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'

const Root = styled(BottomNavigation)(({ theme }) => ({
    color: theme.palette.primary.contrastText,
    position: 'fixed',
    bottom: 0,
    zIndex: 99,
    overflow: 'hidden',
    wordWrap: 'break-word',
    '& > .fuse-bottom-navigation-item': {
        textAlign: 'center',
        justifyContent: 'flex-start',
        '&.active': {
            color: theme.palette.text.primary,
            backgroundColor:
                theme.palette.mode === 'light' ? 'rgba(0, 0, 0, .05)!important' : 'rgba(255, 255, 255, .1)!important',
            pointerEvents: 'none',
        },
    },
}))

const StyledNavBarMobile = styled(SwipeableDrawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        '& #fuse-navbar-side-panel': {
            minWidth: 'auto',
            wdith: 'auto',
        },
        '& #fuse-navbar-panel': {
            opacity: '1!important',
            pointerEvents: 'initial!important',
        },
    },
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
 * Render the navbar in the bottom of the screen in mobile.
 *
 * @param props Props.
 * @param props.navbarContent Represent the content that's gonna be displayed in the navbar.
 * @returns JSX Element.
 */
function NavbarMobileContent(props: /**
 *
 */
{
    /**
     *
     */
    navbarContent: navbarItemType[]
}) {
    const [selectedNavigation, setSelectedNavigation] = useState<navbarItemType[] | []>([])
    const location = useLocation()
    const { navbarContent } = props
    const [panelOpen, setPanelOpen] = useState(false)
    const { formatMessage } = useIntl()

    const contrastTheme = selectMyemTheme()

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
    }

    return (
        <ClickAwayListener onClickAway={() => setPanelOpen(false)}>
            <>
                <ThemeProvider theme={contrastTheme}>
                    <Root
                        showLabels
                        sx={{ width: '100vw', overflowX: 'auto' }}
                        value={selectedNavigation}
                        onChange={(event, item) => handleParentItemClick(item)}
                    >
                        {navbarContent.map((item) => (
                            <BottomNavigationAction
                                component={item.url ? NavLinkAdapter : 'button'}
                                to={item!.url!}
                                className="fuse-bottom-navigation-item"
                                label={
                                    item.labelAbbreviation
                                        ? formatMessage({
                                              id: item.labelAbbreviation,
                                              defaultMessage: item.labelAbbreviation,
                                          })
                                        : formatMessage({
                                              id: item.label,
                                              defaultMessage: item.label,
                                          })
                                }
                                value={item}
                                exact={item.exact}
                                role="button"
                                icon={
                                    <Icon
                                        className={clsx(`type-${item!.type}`, 'fuse-bottom-navigation-item-icon')}
                                        color="action"
                                    >
                                        {item.iconLabel}
                                    </Icon>
                                }
                            />
                        ))}
                    </Root>
                </ThemeProvider>
                {selectedNavigation.length > 0 && (
                    <StyledNavBarMobile
                        classes={{
                            paper: 'flex-col flex-auto h-1/2 w-screen',
                        }}
                        anchor={'bottom'}
                        variant="temporary"
                        open={panelOpen}
                        onClose={() => setPanelOpen(false)}
                        onOpen={() => setPanelOpen(true)}
                        disableSwipeToOpen
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        <FuseNavigation
                            className={clsx('navigation')}
                            navigation={selectedNavigation}
                            layout="vertical"
                            onItemClick={handleChildItemClick}
                        />
                    </StyledNavBarMobile>
                )}
            </>
        </ClickAwayListener>
    )
}

export default NavbarMobileContent
