import NavLinkAdapter from 'src/common/ui-kit/fuse/utils/NavLinkAdapter'
import { styled, alpha } from '@mui/material/styles'
import clsx from 'clsx'
import ListSubheader from '@mui/material/ListSubheader'
import FuseNavItem from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavItem'
import { IFuseNavigationComponentProps } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'

const Root = styled('div')(({ theme }) => ({
    height: 40,
    width: '100%',
    borderRadius: '6px',
    paddingRight: 12,
    color: alpha(theme.palette.text.primary, 0.7),
    fontWeight: 600,
    letterSpacing: '0.025em',
}))

/**
 *
 * Handle items with a type of vertical-group.
 *
 * @param props Props passed to FuseNavigation.
 * @returns JSX Element.
 */
function FuseNavVerticalGroup(props: IFuseNavigationComponentProps) {
    const { item, nestedLevel, onItemClick } = props

    const itempadding = nestedLevel && nestedLevel > 0 ? 28 + nestedLevel * 16 : 12

    return (
        <>
            <Root>
                <ListSubheader
                    disableSticky
                    className={clsx('fuse-list-subheader flex items-center', !item?.url && 'cursor-default')}
                    sx={{ paddingLeft: `${itempadding > 80 ? 80 : itempadding}` }}
                    onClick={() => onItemClick && onItemClick(item)}
                    component={item?.url ? NavLinkAdapter : 'li'}
                    to={item?.url}
                    role="button"
                >
                    <span className="fuse-list-subheader-text uppercase text-12">{item?.label}</span>
                </ListSubheader>
            </Root>
            {item?.children && (
                <>
                    {item?.children.map((_item) => (
                        <FuseNavItem
                            key={_item.id}
                            type={`vertical-${_item?.type}`}
                            item={_item}
                            nestedLevel={nestedLevel}
                            onItemClick={onItemClick}
                        />
                    ))}
                </>
            )}
        </>
    )
}

FuseNavVerticalGroup.defaultProps = {}

const NavVerticalGroup = FuseNavVerticalGroup

export default NavVerticalGroup
