import { useState } from 'react'
import { Button, Card, styled } from '@mui/material'
import { IMobileTableProps } from 'src/common/ui-kit/components/Table/TableT'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading/FuseLoading'

/**
 * Style for the Component.
 */
const RowCard = styled(Card)(() => ({
    padding: '15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    margin: '10px 15px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0px 2px 1px 1px rgba(0, 0, 0, 0.25)',
    borderRadius: '20px',
}))

/**
 * Style for the RowContent part of Mobile Row Card.
 */
const StyledRowContentElement = styled('div')(() => ({
    flexGrow: 1,
}))

/**
 * MobileTableActionsMenu.
 *
 * @param props N/A.
 * @param props.children Children Menu Items.
 * @returns MobileTableActions Menu.
 */
export const MobileTableActionsMenu = ({
    children,
}: // eslint-disable-next-line jsdoc/require-jsdoc
{
    // eslint-disable-next-line jsdoc/require-jsdoc
    children: JSX.Element
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const open = Boolean(anchorEl)

    /**
     * Open Menu Handler.
     *
     * @param event Event.
     */
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    /**
     * Close Menu Handler.
     */
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {children}
            </Menu>
        </div>
    )
}
/**
 * MobileTable component.
 *
 * @param props Props.
 * @returns JSX.Element.
 */
function MobileTable<rowType>(props: IMobileTableProps<rowType>) {
    const { RowContentElement, rows, onRowClick, RowActionsElement, loadMoreRows, isRowsLoadingInProgress, totalRows } =
        props

    if (isRowsLoadingInProgress)
        return (
            <div className="h-full items-center flex">
                <FuseLoading />
            </div>
        )
    return (
        <div className="h-full">
            {rows.map((row) => (
                <RowCard
                    role="checkbox"
                    onClick={() => {
                        onRowClick?.(row)
                    }}
                >
                    <StyledRowContentElement>
                        <RowContentElement row={row} />
                    </StyledRowContentElement>
                    <MobileTableActionsMenu>
                        <RowActionsElement row={row} />
                    </MobileTableActionsMenu>
                </RowCard>
            ))}
            {rows.length < totalRows && (
                <div className="flex justify-center">
                    <Button onClick={loadMoreRows} variant="contained" className="text-center mt-8">
                        <TypographyFormatMessage>Afficher Plus</TypographyFormatMessage>
                    </Button>
                </div>
            )}
            {/* Adding a Row Card as a padding bottom */}
            <RowCard />
        </div>
    )
}

export default MobileTable
