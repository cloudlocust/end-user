import List from '@mui/material/List'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import FuseNavVerticalTab from 'src/common/ui-kit/fuse/components/FuseNavigation/vertical/types/FuseNavVerticalTab'
import { IFuseNavigationProps, navbarItemType } from 'src/common/ui-kit/fuse/components/FuseNavigation/FuseNavigation'

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
    '&.dense': {},
}))

/**
 * Navbar VerticalLayout2 represents the VerticalTab Navigation Links.
 *
 * @param props NavVerticalL1 props.
 * @returns Render First Level navigation Items.
 */
function FuseNavVerticalLayout2(props: IFuseNavigationProps) {
    const { navigation, active, dense, className, onItemClick, firstLevel, selectedId } = props

    /**.
     * Handler props function for handling ItemClick
     *
     * @param item represent the navbarItem that is clicked.
     */
    function handleItemClick(item: navbarItemType) {
        onItemClick?.(item)
    }

    return (
        <StyledList
            className={clsx(
                'navigation whitespace-nowrap items-center flex flex-col',
                `active-${active}-list`,
                dense && 'dense',
                className,
            )}
        >
            {navigation.map((_item: navbarItemType) => (
                <FuseNavVerticalTab
                    key={_item.id}
                    type={`vertical-${_item.type}`}
                    item={_item}
                    nestedLevel={0}
                    onItemClick={handleItemClick}
                    firstLevel={firstLevel}
                    dense={dense}
                    selectedId={selectedId}
                />
            ))}
        </StyledList>
    )
}

export default FuseNavVerticalLayout2
