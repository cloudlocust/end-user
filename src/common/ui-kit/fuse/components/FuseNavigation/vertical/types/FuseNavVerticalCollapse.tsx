import NavLinkAdapter from 'src/common/ui-kit/fuse/utils/NavLinkAdapter'
import { styled, alpha } from '@mui/material/styles'
import Collapse from '@mui/material/Collapse'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import FuseNavItem from '../../FuseNavItem'
import {
    IFuseNavigationComponentProps,
    navbarItemType,
} from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'

const Root = styled('ul')(({ theme }) => ({
    padding: 0,
    '&.open': {},
    '& > .fuse-list-item': {
        height: 40,
        width: '100%',
        borderRadius: '6px',
        margin: '0 0 4px 0',
        paddingRight: 12,
        color: alpha(theme.palette.text.primary, 0.7),
        '&:hover': {
            color: theme.palette.text.primary,
        },
        '& > .fuse-list-item-icon': {
            marginRight: 12,
            color: 'inherit',
        },
    },
}))

/**
 *
 * Check if the item need to be opened.
 *
 * @param location The location.
 * @param item The Item.
 * @returns JSX Element.
 */
function needsToBeOpened(location: string | undefined, item: navbarItemType | undefined) {
    if (location) {
        return isUrlInChildren(item, location)
    }
}

/**
 *
 * Check if the item's URL is in children.
 *
 * @param parent The parent item.
 * @param url The location.
 * @returns JSX Element.
 */
function isUrlInChildren(parent: navbarItemType | undefined, url: string) {
    if (!parent?.children) {
        return false
    }

    for (let i = 0; i < parent?.children?.length; i += 1) {
        if (parent?.children[i].children && isUrlInChildren(parent?.children[i], url)) {
            return true
        }

        let isUrlIncluded = false

        if (parent?.children[i]?.url !== undefined) {
            isUrlIncluded = url.includes(parent.children[i].url!)
        }
        if (isUrlIncluded || parent?.children[i].url === url) {
            return true
        }
    }

    return false
}

/**
 *
 * Handle Items with the type vertical-collapse.
 *
 * @param props Props passed for FuseNavigation.
 * @returns JSX Element.
 */
function FuseNavVerticalCollapse(props: IFuseNavigationComponentProps) {
    const [open, setOpen] = useState(() => needsToBeOpened(props.item?.url, props.item))
    const { item, nestedLevel, onItemClick } = props
    const itempadding = nestedLevel && nestedLevel > 0 ? 28 + nestedLevel * 16 : 12

    const location = useLocation()

    useEffect(() => {
        if (props.item && needsToBeOpened(location.pathname, props.item) && !open) {
            setOpen(true)
        }
        // eslint-disable-next-line
    }, [location, props.item])

    return (
        <Root className={clsx(open && 'open')}>
            <ListItem
                button
                className="fuse-list-item"
                sx={{ paddingLeft: `${itempadding > 80 ? 80 : itempadding}` }}
                onClick={() => setOpen(!open)}
                component={item?.url ? NavLinkAdapter : 'li'}
                to={item?.url}
                role="button"
            >
                {item?.label && (
                    <Icon
                        className={clsx('fuse-list-item-icon text-20 flex-shrink-0', item?.iconClassName)}
                        color="action"
                    >
                        {item?.icon}
                    </Icon>
                )}

                <ListItemText
                    className="fuse-list-item-text"
                    primary={item?.label}
                    classes={{ primary: 'text-13 font-medium' }}
                />

                <IconButton
                    disableRipple
                    className="w-40 h-40 -mx-12 p-0 focus:bg-transparent hover:bg-transparent"
                    onClick={(ev) => ev.preventDefault()}
                    size="large"
                >
                    <Icon className="text-16 arrow-icon" color="inherit">
                        {open ? 'expand_less' : 'expand_more'}
                    </Icon>
                </IconButton>
            </ListItem>

            {item?.children && (
                <Collapse in={open} className="collapse-children">
                    {item?.children.map((_item) => (
                        <FuseNavItem
                            key={_item.id}
                            type={`vertical-${_item.type}`}
                            item={_item}
                            nestedLevel={nestedLevel ? nestedLevel + 1 : 1}
                            onItemClick={onItemClick}
                        />
                    ))}
                </Collapse>
            )}
        </Root>
    )
}

FuseNavVerticalCollapse.defaultProps = {}

const NavVerticalCollapse = FuseNavVerticalCollapse

export default NavVerticalCollapse
