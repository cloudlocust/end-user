import NavLinkAdapter from 'src/common/ui-kit/fuse/utils/NavLinkAdapter'
import { styled, alpha } from '@mui/material/styles'
import Icon from '@mui/material/Icon'
import ListItemText from '@mui/material/ListItemText'
import ListItemButton from '@mui/material/ListItemButton'
import clsx from 'clsx'
import { IFuseNavigationComponentProps } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'

const Root = styled('div')(({ theme }) => ({
    '& > .fuse-list-item': {
        height: 40,
        width: '100%',
        borderRadius: '6px',
        margin: '0 0 4px 0',
        paddingRight: 12,
        color: alpha(theme.palette.primary.contrastText, 0.7),
        cursor: 'pointer',
        textDecoration: 'none!important',
        '&:hover': {
            color: theme.palette.primary.contrastText,
        },
        '&.active': {
            color: theme.palette.primary.contrastText,
            backgroundColor:
                theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, .05)!important' : 'rgba(255, 255, 255, .1)!important',
            pointerEvents: 'none',
            transition: 'border-radius .15s cubic-bezier(0.4,0.0,0.2,1)',
            '& > .fuse-list-item-text-primary': {
                color: 'inherit',
            },
            '& > .fuse-list-item-icon': {
                color: 'inherit',
            },
        },
        '& >.fuse-list-item-icon': {
            marginRight: 12,
            color: 'inherit',
        },
        '& > .fuse-list-item-text': {},
    },
}))

/**
 *
 * Handle items with a type of vertical-item.
 *
 * @param props Props passed to FuseNavigation.
 * @returns JSX Element.
 */
function FuseNavVerticalItem(props: IFuseNavigationComponentProps) {
    const { item, nestedLevel, onItemClick } = props

    const itempadding = nestedLevel && nestedLevel > 0 ? 28 + nestedLevel * 16 : 12

    return (
        <Root>
            <ListItemButton
                component={item!.url ? NavLinkAdapter : 'button'}
                to={item!.url}
                activeClassName="active"
                className={clsx('fuse-list-item', `pl-${itempadding > 80 ? 80 : itempadding}`)}
                onClick={() => onItemClick && onItemClick(item)}
                exact={item!.exact!}
                role="button"
            >
                {item?.icon && (
                    <Icon
                        className={clsx('fuse-list-item-icon text-20 flex-shrink-0', item.iconClassName)}
                        color="action"
                    >
                        {item?.icon}
                    </Icon>
                )}

                <ListItemText
                    className="fuse-list-item-text"
                    primary={item?.label}
                    classes={{ primary: 'text-13 font-medium fuse-list-item-text-primary' }}
                />
            </ListItemButton>
        </Root>
    )
}

FuseNavVerticalItem.defaultProps = {}

const NavVerticalItem = FuseNavVerticalItem

export default NavVerticalItem
