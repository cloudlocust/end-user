import { useEffect, useState } from 'react'
import NavLinkAdapter from 'src/common/ui-kit/fuse/utils/NavLinkAdapter'
import { styled, ThemeProvider, useTheme } from '@mui/material/styles'
import FuseNavigation, { navbarItemType } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'
import BottomNavigation from '@mui/material/BottomNavigation'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { useLocation } from 'react-router-dom'
import { Location } from 'history'
import Icon from '@mui/material/Icon'
import clsx from 'clsx'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import { BottomNavigationAction } from '@mui/material'
import { useIntl } from 'src/common/react-platform-translation'
import Tooltip from '@mui/material/Tooltip'

const Root = styled(BottomNavigation)(({ theme }) => ({
    position: 'fixed',
    bottom: 'var(--safe-area-inset-bottom)',
    zIndex: 99,
    overflow: 'hidden',
    wordWrap: 'break-word',
    borderTop: `0.1px solid ${theme.palette.grey[300]}`,
    '& > div': {
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1,
        flexShrink: 1,
        background: theme.palette.common.white,
    },
    '& > div > .fuse-bottom-navigation-item': {
        textAlign: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '0px',
        minWidth: '80px',
        maxWidth: '168px',
        '& > .MuiBottomNavigationAction-label': {
            color: theme.palette.mode,
        },
        '& > .MuiIcon-root': {
            color: theme.palette.mode,
        },
        '&.active': {
            '& > .MuiBottomNavigationAction-label': {
                color: theme.palette.primary.main,
            },
            '& > .MuiIcon-root': {
                color: theme.palette.primary.main,
            },
            backgroundColor: theme.palette.common.white,
        },
        '&.disabled': {
            opacity: '0.38',
            PointerEvent: 'none!important',
        },
    },
}))

const StyledNavBarMobile = styled(SwipeableDrawer)(() => ({
    '& .MuiDrawer-paper': {
        '& #fuse-navbar-side-panel': {
            minWidth: 'auto',
            width: 'auto',
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
    const theme = useTheme()
    const { navbarContent } = props
    const [selectedNavigation, setSelectedNavigation] = useState<navbarItemType[] | []>([])
    const [selectedItem, setSelectedItem] = useState<navbarItemType>()
    const location = useLocation()
    const [panelOpen, setPanelOpen] = useState(false)
    const { formatMessage } = useIntl()

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
     * @param _selected SelectedItem.
     */
    function handleChildItemClick(_selected: navbarItemType) {
        setPanelOpen(false)
    }

    /**
     * Function that checks if the right navbar item is selected.
     *
     * @param item Navbar item.
     * @returns Boolean if the right navbar item is selected.
     */
    function isItemSelected(item: navbarItemType) {
        return selectedItem?.id === item.id
    }

    useEffect(() => {
        navbarContent?.forEach((item) => {
            if (needsToBeOpened(location, item)) {
                setSelectedNavigation([item])
            }
        })
    }, [location, navbarContent])

    useEffect(() => {
        // Find the navbar item that matches the current pathname
        // eslint-disable-next-line array-callback-return
        const activeItem = navbarContent.find((item) => {
            if (item.url) {
                return location.pathname.startsWith(item.url)
            }
        })
        // Set the found item as selected, or reset to undefined if no match is found
        if (activeItem) {
            setSelectedItem(activeItem)
        }
    }, [location.pathname, navbarContent])

    return (
        <ClickAwayListener onClickAway={() => setPanelOpen(false)}>
            <>
                <ThemeProvider theme>
                    <Root
                        showLabels
                        sx={{
                            width: '100vw',
                            overflowX: 'auto',
                            backgroundColor: theme.palette.background.default,
                        }}
                        value={selectedItem}
                        onChange={(_event, item) => handleParentItemClick(item)}
                    >
                        {navbarContent.map((item) => (
                            <Tooltip
                                arrow
                                placement="bottom-end"
                                disableHoverListener={!item.disabled}
                                title={
                                    item.disabled
                                        ? formatMessage({
                                              id: "Cette fonctionnalité n'est pas disponible sur cette version",
                                              defaultMessage:
                                                  "Cette fonctionnalité n'est pas disponible sur cette version",
                                          })
                                        : item.label ?? <></>
                                }
                            >
                                <div className={`${item?.disabled && 'cursor-not-allowed'}`}>
                                    <BottomNavigationAction
                                        component={item.url ? NavLinkAdapter : 'button'}
                                        to={item!.url!}
                                        className={`fuse-bottom-navigation-item ${item.disabled && 'disabled'}`}
                                        showLabel={true}
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
                                        value={item.id}
                                        exact={item.exact}
                                        role="button"
                                        disabled={item.disabled}
                                        icon={
                                            isItemSelected(item) ? (
                                                <Icon
                                                    className={clsx(
                                                        `type-${item!.type}`,
                                                        'fuse-bottom-navigation-item-icon',
                                                    )}
                                                >
                                                    {item.selectedIcon}
                                                </Icon>
                                            ) : (
                                                <Icon
                                                    className={clsx(
                                                        `type-${item!.type}`,
                                                        'fuse-bottom-navigation-item-icon',
                                                    )}
                                                >
                                                    {item.icon}
                                                </Icon>
                                            )
                                        }
                                    />
                                </div>
                            </Tooltip>
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
