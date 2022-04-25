import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import { IFuseNavigationProps, navbarItemType } from '../FuseNavigation'
import FuseNavItem from '../FuseNavItem'

const StyledList = styled(List)(({ theme }) => ({
    '& .fuse-list-item': {
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,.04)',
        },
        '&:focus:not(.active)': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0,0,0,.05)',
        },
    },
    '&.active-square-list': {
        '& .fuse-list-item, & .active.fuse-list-item': {
            width: '100%',
            borderRadius: '0',
        },
    },
    '&.dense': {
        '& .fuse-list-item': {
            paddingTop: 0,
            paddingBottom: 0,
            height: 32,
        },
    },
}))

/**
 * Fuse Navigation Layout 1.
 *
 * @param props Props passed to fuse Navigation.
 * @returns JSX Element.
 */
function FuseNavVerticalLayout1(props: IFuseNavigationProps) {
    const { navigation, active, dense, className, onItemClick } = props

    // eslint-disable-next-line
    function handleItemClick(item: navbarItemType) {
        onItemClick?.(item)
    }

    return (
        <StyledList
            className={clsx('navigation whitespace-nowrap px-12', `active-${active}-list`, dense && 'dense', className)}
        >
            {navigation.map((_item) => (
                <FuseNavItem
                    key={_item.id}
                    type={`vertical-${_item.type}`}
                    item={_item}
                    nestedLevel={0}
                    onItemClick={handleItemClick}
                />
            ))}
        </StyledList>
    )
}

export default FuseNavVerticalLayout1
