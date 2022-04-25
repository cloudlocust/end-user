import React, { SyntheticEvent } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableHead from '@mui/material/TableHead'
import { HeadRowTableProps } from 'src/common/ui-kit/components/Table/TableT'

/**
 * EnhancedTableHead Component, representing the Row Head of the Table.
 *
 * @param props N/A.
 * @param props.headCells HeadCells data.
 * @param props.onRequestSort Function when clicking on icon sort of the column head cell.
 * @param props.order Order direction.
 * @param props.orderBy Indicating which column to orderBy.
 * @returns Table Head Row.
 */
function HeadRowTable<rowType>(props: HeadRowTableProps<rowType>) {
    const { order, orderBy, onRequestSort, headCells } = props
    /**
     *  Create Sort Handler for a particular column on click on its cell header.
     *
     * @param property Headcell id.
     * @returns Function to handle the onRequestSort.
     */
    const createSortHandler = (property: string) => (event: SyntheticEvent) => {
        onRequestSort(event, property)
    }

    return (
        <TableHead className="EnhancedTableHead">
            <TableRow className="h-48 sm:h-64">
                {headCells.map((headCell, index) => (
                    <TableCell
                        className="p-4 md:p-16"
                        key={index}
                        align="left"
                        sortDirection={orderBy === headCell.id ? order : false}
                        padding="normal"
                    >
                        {headCell.id && (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                className="font-semibold"
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.headCellLabel}
                            </TableSortLabel>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

export default HeadRowTable
