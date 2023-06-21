import React, { SyntheticEvent } from 'react'
import MuiTable from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TablePagination from '@mui/material/TablePagination'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import FuseScrollbars from 'src/common/ui-kit/fuse/components/FuseScrollbars'
import { stableSort, getComparator } from 'src/modules/utils/tables'
import HeadRowTable from 'src/common/ui-kit/components/Table/HeadRowTable'
import { ITable } from 'src/common/ui-kit/components/Table/TableT'
import MobileTable from './MobileTable'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * Reusable Table Component with pagination and sorting.
 *
 * @param props N/A.
 * @param props.onRowClick Action when clicking on a row.
 * @param props.rows Data that is contained in the Table rows.
 * @param props.onPageChange OnPageChange Props.
 * @param props.totalRows TotalRows Props.
 * @param props.sizeRowsPerPage SizeRowsPerPage Props.
 * @param props.pageProps PageProps Props.
 * @param props.MobileRowContentElement MobileRowContentElement Props.
 * @param props.MobileRowActionsElement MobileRowActionsElement Props.
 * @returns Table Reusable Component, with row sorting and TablePagination.
 */
function Table<rowType>(props: ITable<rowType>) {
    const {
        onRowClick,
        rows,
        cells,
        totalRows,
        onPageChange,
        sizeRowsPerPage,
        pageProps,
        MobileRowContentElement,
        MobileRowActionsElement,
    } = props
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    /***** SORTING & Pagination Related state and function. *****/
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')
    const [orderBy, setOrderBy] = React.useState('id')
    // TODO Remove useState, when refactoring all the component using Table
    // The Zero-based index of the page, it is used for now becuz there are components that still don't pass pageProp.
    const [page, setPage] = React.useState(pageProps ? pageProps - 1 : 0)
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

    /**
     * Handle change page table.
     *
     * @param _event Event.
     * @param newPage NewPage index value.
     */
    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage)
        if (onPageChange) onPageChange(newPage + 1)
    }

    return (
        <FuseScrollbars className="flex-grow overflow-x-auto">
            {isMobile ? (
                <MobileTable<rowType>
                    rows={rows}
                    RowContentElement={MobileRowContentElement}
                    RowActionsElement={MobileRowActionsElement}
                    onRowClick={onRowClick}
                />
            ) : (
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
                        labelDisplayedRows={({ from, to, count }) => {
                            return `${from}–${to} / ${count !== -1 ? count : to}`
                        }}
                        count={totalRows ? totalRows : rows.length}
                        rowsPerPage={sizeRowsPerPage ? sizeRowsPerPage : 10}
                        page={page}
                        onPageChange={handleChangePage}
                    />
                </>
            )}
        </FuseScrollbars>
    )
}
export default Table
