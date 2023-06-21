import { Card, styled } from '@mui/material'
import { IMobileTableProps } from 'src/common/ui-kit/components/Table/TableT'

/**
 * Style for the Component.
 */
const RowCard = styled(Card)(() => ({
    padding: '15px',
    margin: '10px 15px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0px 2px 1px 1px rgba(0, 0, 0, 0.25)',
    borderRadius: '20px',
}))

/**
 * Style for the Title part of the Component.
 * The part at the top of the Card (Header).
 */
/* TODO: Remove in last PR */
// const StyledCardTitleWrapper = styled('div')(() => ({
//     display: 'flex',
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexWrap: 'wrap',
// }))

/**
 * Style for the Wrapper inside the Component (this wrap only Table content without wrapping ActionsCell).
 */
/* TODO: Remove in last PR */
// const StyledCardContentWrapper = styled('div')(() => ({
// display: 'flex',
// flexDirection: 'column',
// flex: 1,
// }))

/**
 * Style for the content of the Card.
 */
/* TODO: Remove in last PR */
// const StyledCardCell = styled('div')(() => ({
// display: 'flex',
// flexDirection: 'row',
// justifyContent: 'space-between',
// alignItems: 'center',
// margin: '5px 0px',
// flexWrap: 'wrap',
// }))

/**
 * MobileTable component.
 *
 * @param props Props.
 * @returns JSX.Element.
 */
function MobileTable<rowType>(props: IMobileTableProps<rowType>) {
    // TODO Fix on next PR
    // const { loadMoreElements, RowContentElement, RowActions, rows, onRowClick } = props
    const { RowContentElement, rows, onRowClick } = props
    return (
        <>
            {rows.map((row) => (
                <RowCard
                    role="checkbox"
                    onClick={() => {
                        onRowClick?.(row)
                    }}
                >
                    <RowContentElement row={row} />
                    {/* TODO: Remove in last PR */}
                    {/* <StyledCardContentWrapper>
                        <StyledCardTitleWrapper>{cardTitle}</StyledCardTitleWrapper>
                        {displayableCells.map((cell) =>
                            cell.mobileRowCell ? (
                                <StyledCardCell key={cell.id}>{cell.mobileRowCell(row)}</StyledCardCell>
                            ) : null,
                        )}
                    </StyledCardContentWrapper> */}
                </RowCard>
            ))}
        </>
    )
}

export default MobileTable
