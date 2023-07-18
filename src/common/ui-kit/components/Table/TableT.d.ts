/**
 * Cells information.
 */
export interface ICell<rowType> {
    /**
     * Id represent a field in the model of the data (for example: 'firstName' is an id for a clientModel), it helps to sort the data based on this id, in our example sorting based on firstName.
     */
    id: string
    /**
     * Header Cell Label.
     */
    headCellLabel: string
    /**
     * Each Column will have a headCellLabel above, and the rowCell is the content to be displayed in each row, other than headRow.
     * For Example: let's say we want a table of clients firstName in uppercase, we'll have data [id: 1, firstName: 'aaa'], then our rowCell will have row.firstName.toUpperCase().
     */
    rowCell: (row: rowType) => string | JSX.Element | number
}

/**
 * Mobile Table Props.
 */
interface IMobileTableProps<rowType> {
    /**
     * JSX Element of Row Content.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    RowContentElement: ({ row }: { row: rowType }) => JSX.Element
    /**
     * JSX Element of Row Actions.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    RowActionsElement?: ({ row }: { row: rowType }) => JSX.Element
    /**
     * Rows record of the table.
     */
    rows: rowType[]
    /**
     * Function to be called when load more rows.
     */
    loadMoreRows: () => void
    /**
     * Boolean indicating if rows are loading.
     */
    isRowsLoadingInProgress: boolean

    /**
     * Function to be called when clicking on a row.
     */
    onRowClick?: (row: rowType) => void
    /**
     * Total of Possible Rows.
     */
    totalRows: number
}

/**
 * Table Props.
 */
interface ITable<rowType> {
    /**
     * Cells represent how data will be shown in each cell, with its header label.
     */
    cells: ICell<rowType>[]
    /**
     * Function to be called when clicking on a row.
     */
    onRowClick?: (row: rowType) => void
    /**
     * Rows.
     */
    rows: rowType[] | null
    /**
     * Total Possible rows.
     */
    totalRows: number
    /**
     * Row JSX Element on Mobile.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    MobileRowContentElement: ({ row }: { row: rowType }) => JSX.Element
    /**
     * JSX Element of Row Content.
     */
    // eslint-disable-next-line jsdoc/require-jsdoc
    MobileRowActionsElement?: ({ row }: { row: rowType }) => JSX.Element
    /**
     * Function to be called when page change.
     */
    onPageChange: (page: number) => void
    /**
     * Boolean indicating if rows are loading.
     */
    isRowsLoadingInProgress: boolean
    /**
     * EmptyRows JSX Element.
     */
    emptyRowsElement?: JSX.Element
    /**
     * Represent the number of rows to be displayed in each page.
     */
    sizeRowsPerPage?: number
    /**
     * Represent the current page.
     */
    pageProps: number
}

/**
 * Table Props.
 */
interface ITableDesktop<rowType> {
    /**
     * Cells represent how data will be shown in each cell, with its header label.
     */
    cells: ICell<rowType>[]
    /**
     * Function to be called when clicking on a row.
     */
    onRowClick?: (row: rowType) => void
    /**
     * Rows.
     */
    rows: rowType[]
    /**
     * Total Possible rows.
     */
    totalRows: number
    /**
     * Represent the current page.
     */
    page: number
    /**
     * Function to be called when page change.
     */
    onPageChange: (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => void
    /**
     * Represent the number of rows to be displayed in each page.
     */
    sizeRowsPerPage?: number
}

/**
 *
 */
interface HeadRowTableProps<rowType> {
    /**
     *
     */
    headCells: ICell<rowType>[]
    /**
     *
     */
    onRequestSort: (event: SyntheticEvent, property: string) => void
    /**
     *
     */
    order: 'asc' | 'desc'
    /**
     *
     */
    orderBy: string
}
