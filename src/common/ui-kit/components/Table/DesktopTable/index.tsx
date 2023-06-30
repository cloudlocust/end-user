import React, { SyntheticEvent } from 'react'
import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TablePagination from '@mui/material/TablePagination'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { stableSort, getComparator } from 'src/modules/utils/tables'
import HeadRowTable from 'src/common/ui-kit/components/Table/HeadRowTable'
import { ITableDesktop } from 'src/common/ui-kit/components/Table/TableT.d'

/**
 * Reusable Table Component with pagination and sorting.
 *
 * @param props N/A.
 * @param props.onRowClick Action when clicking on a row.
 * @param props.rows Data that is contained in the Table rows.
 * @param props.handlePageChange HandlePageChange Props.
 * @param props.totalRows TotalRows Props.
 * @param props.sizeRowsPerPage SizeRowsPerPage Props.
 * @param props.cells Cells represent how data will be shown in each cell, with its header label.
 * @param props.page Page Props.
 * @returns Table Reusable Component, with row sorting and TablePagination.
 */
function DesktopTable<rowType>(props: ITableDesktop<rowType>) {
    const { onRowClick, rows, cells, totalRows, onPageChange, sizeRowsPerPage, page } = props

    /***** SORTING & Pagination Related state and function. *****/
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = React.useState('id')
    // TODO Remove useState, when refactoring all the component using Table
    // The Zero-based index of the page, it is used for now becuz there are components that still don't pass pageProp.

    /**
     * HandleRequest Sort function by Material UI.
     *
     * @param _ Click Event.
     * @param property The column head id.
     */
    const handleRequestSort = (_: SyntheticEvent, property: string) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    return (
        <>
            <MuiTable stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
                <HeadRowTable<rowType>
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    headCells={cells}
                />
                <TableBody>
                    {stableSort(rows, getComparator(order, orderBy)).map((row) => (
                        <TableRow
                            hover
                            role="checkbox"
                            className="h-72 cursor-pointer"
                            tabIndex={-1}
                            onClick={onRowClick ? () => onRowClick(row) : () => {}}
                        >
                            {cells.map((cell) => (
                                <TableCell key={cell.id} className="p-4 md:p-16" component="th" scope="row">
                                    {cell.rowCell(row)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
            <TablePagination
                rowsPerPageOptions={[sizeRowsPerPage ? sizeRowsPerPage : 10]}
                component="div"
                className="flex-shrink-0 border-t-1"
                variant="body"
                backIconButtonProps={{
                    'aria-label': 'Previous Page',
                }}
                nextIconButtonProps={{
                    'aria-label': 'Next Page',
                }}
                count={totalRows}
                labelDisplayedRows={({ from, to, count }) => {
                    return `${from}–${to} / ${count !== -1 ? count : to}`
                }}
                rowsPerPage={sizeRowsPerPage ? sizeRowsPerPage : 10}
                page={page}
                onPageChange={onPageChange}
            />
        </>
    )
}
export default DesktopTable
