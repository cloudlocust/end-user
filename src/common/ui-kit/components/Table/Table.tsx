import React, { useEffect, useRef } from 'react'
import FuseScrollbars from 'src/common/ui-kit/fuse/components/FuseScrollbars'
import { ITable } from 'src/common/ui-kit/components/Table/TableT'
import MobileTable from 'src/common/ui-kit/components/Table/MobileTable'
import DesktopTable from 'src/common/ui-kit/components/Table/DesktopTable'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import FuseLoading from 'src/common/ui-kit/fuse/components/FuseLoading/FuseLoading'
import { motion } from 'framer-motion'
import TypographyFormatMessage from 'src/common/ui-kit/components/TypographyFormatMessage/TypographyFormatMessage'

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
 * @param props.isRowsLoadingInProgress IsRowsLoadingInProgress Props.
 * @param props.emptyRowsElement EmptyRowsElement Props.
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
        isRowsLoadingInProgress,
        emptyRowsElement,
        MobileRowContentElement,
        MobileRowActionsElement,
    } = props
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

    /***** SORTING & Pagination Related state and function. *****/
    const [isInfiniteScrollRowsLoadingInProgress, setInfiniteScrollRowsLoadingInProgress] = React.useState(true)
    const [infiniteScrollRows, setInfiniteScrollRows] = React.useState<rowType[]>([])
    // TODO Remove useState, when refactoring all the component using Table
    const isReloadInfiniteScrollRows = useRef(true)

    /**
     * Handler to handle infinite scroll using table pagination.
     */
    const loadMoreRows = () => {
        onPageChange(pageProps + 1)
        setInfiniteScrollRowsLoadingInProgress(true)
    }

    /**
     * This useRef is used in case the onAfterDeleteUpdate and infinite scroll reload elements, so that we replace the infiniteScrollRows with the reloaded rows through this ref.
     */
    useEffect(() => {
        if (pageProps === 1) isReloadInfiniteScrollRows.current = true
        else isReloadInfiniteScrollRows.current = false
    }, [pageProps])

    /**
     * UseEffect to handle inifinite scroll when table pagination rows change.
     */
    useEffect(() => {
        if (rows) {
            if (isReloadInfiniteScrollRows.current) setInfiniteScrollRows(rows)
            else setInfiniteScrollRows((prevRows) => prevRows.concat(rows))
        }
    }, [rows])

    /**
     * UseEffect to handle infinite scroll loading in progress to be false.
     */
    useEffect(() => {
        setInfiniteScrollRowsLoadingInProgress(false)
    }, [infiniteScrollRows])

    /**
     * Handle change page table.
     *
     * @param _event Event.
     * @param newPage NewPage index value.
     */
    const handleTablePageChange = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        onPageChange(newPage + 1)
    }

    if (!rows || isRowsLoadingInProgress)
        return (
            <div className="h-full items-center flex">
                <FuseLoading />
            </div>
        )

    if (rows.length === 0)
        return (
            <>
                {emptyRowsElement ? (
                    emptyRowsElement
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.1 } }}
                        className="flex flex-1 items-center justify-center h-full"
                    >
                        <TypographyFormatMessage color="textSecondary" variant="h5">
                            Liste Vide !
                        </TypographyFormatMessage>
                    </motion.div>
                )}
            </>
        )
    return (
        <FuseScrollbars className="flex-grow overflow-x-auto">
            {isMobile ? (
                <MobileTable<rowType>
                    rows={infiniteScrollRows}
                    isRowsLoadingInProgress={isInfiniteScrollRowsLoadingInProgress}
                    loadMoreRows={loadMoreRows}
                    RowContentElement={MobileRowContentElement}
                    RowActionsElement={MobileRowActionsElement}
                    onRowClick={onRowClick}
                    totalRows={totalRows}
                />
            ) : (
                <DesktopTable<rowType>
                    cells={cells}
                    onPageChange={handleTablePageChange}
                    rows={rows}
                    totalRows={totalRows}
                    onRowClick={onRowClick}
                    sizeRowsPerPage={sizeRowsPerPage}
                    page={pageProps - 1}
                />
            )}
        </FuseScrollbars>
    )
}
export default Table
