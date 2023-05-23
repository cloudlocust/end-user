import { fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { reduxedRender } from 'src/common/react-platform-components/test'
import Table from 'src/common/ui-kit/components/Table/Table'

// The data that will be displayed in the Table.
let TEST_ELEMENT_LIST = [
    {
        id: 1,
        label: 'Arow1',
    },
    {
        id: 2,
        label: 'Brow2',
    },
]

/**
 * Cells represent how data will be shown in each cell.
 */
let TEST_CELLS = [
    {
        id: 'id',
        headCellLabel: 'ID',
        // eslint-disable-next-line jsdoc/require-jsdoc
        rowCell: (row: (typeof TEST_ELEMENT_LIST)[0]) => `${row.id}`,
    },
    {
        id: 'label',
        headCellLabel: 'LABEL',
        // eslint-disable-next-line jsdoc/require-jsdoc
        rowCell: (row: (typeof TEST_ELEMENT_LIST)[0]) => `${row.label}`,
    },
]

// eslint-disable-next-line jsdoc/require-jsdoc
const propsTable = {
    cells: TEST_CELLS,
    onRowClick: jest.fn(),
    rows: TEST_ELEMENT_LIST,
    onPageChange: jest.fn(),
    totalRows: TEST_ELEMENT_LIST.length,
    sizeRowsPerPage: 2,
    pageProps: 1,
}
// Text
const ROW1_ID_CELL_CONTENT = '1'
const ROW1_LABEL_CELL_CONTENT = 'Arow1'
const ROW2_ID_CELL_CONTENT = '2'
const ROW2_LABEL_CELL_CONTENT = 'Brow2'
const LABEL_CELL_HEADER = 'LABEL'
const ID_CELL_HEADER = 'ID'

// ROLE
const TABLE_ROW_ROLE = 'checkbox'

// CSS CLASSES
const ASCENDING_ICON_CLASSNAME = 'MuiTableSortLabel-iconDirectionAsc'
const DESCENDING_ICON_CLASSNAME = 'MuiTableSortLabel-iconDirectionDesc'
const DISABLED_CLASSNAME = 'Mui-disabled'

// Title
const NEXT_PAGE_BUTTON_TITLE = 'Go to next page'
const PREVIOUS_PAGE_BUTTON_TITLE = 'Go to previous page'
/**
 * Mocking the useParams used in CustomerDetails to load the customerDetails based on url /customers/:id {id} params.
 */
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),

    /**
     * Mock react-router useHistory hook.
     *
     * @returns The react-router useHistory replace function.
     */
    useHistory: () => ({
        listen: jest.fn(),
    }),
}))

describe('Testing Table', () => {
    describe('Table Content', () => {
        test('When Table given with data, Table should be filled, with given data', async () => {
            const { getByText } = reduxedRender(<Table {...propsTable} />)

            expect(getByText(ID_CELL_HEADER)).toBeTruthy()
            expect(getByText(LABEL_CELL_HEADER)).toBeTruthy()
            expect(getByText(ROW1_ID_CELL_CONTENT)).toBeTruthy()
            expect(getByText(ROW1_LABEL_CELL_CONTENT)).toBeTruthy()
            expect(getByText(ROW2_ID_CELL_CONTENT)).toBeTruthy()
            expect(getByText(ROW2_LABEL_CELL_CONTENT)).toBeTruthy()
        })

        test('When Clicking on a TableRow onRowClick should be called with row data', async () => {
            const mockRowClick = jest.fn()
            propsTable.onRowClick = mockRowClick
            const { getAllByRole } = reduxedRender(<Table {...propsTable} />)

            const ROW1 = getAllByRole(TABLE_ROW_ROLE)[0]
            act(() => {
                fireEvent.click(ROW1)
            })

            await waitFor(() => {
                // When Clicking on Row1, it mockRowClick should be called with all the first row data.
                expect(mockRowClick).toHaveBeenCalledWith(TEST_ELEMENT_LIST[0])
            })
        })
        test('When clicking on sorting Icon of a TableHead for a chosen column, it should sort the table based on the chosen column, whether ascending or descending right icon should be shown', async () => {
            const { getAllByRole, getByText } = reduxedRender(<Table {...propsTable} />)

            const ID_HEAD_CELL_ICON = getByText(ID_CELL_HEADER).firstElementChild
            // Sorting based on ID, Descending.
            act(() => {
                fireEvent.click(getByText(ID_CELL_HEADER))
            })

            await waitFor(() => {
                expect(getAllByRole(TABLE_ROW_ROLE)[0].firstChild?.textContent).toBe(ROW2_ID_CELL_CONTENT)
            })
            expect(ID_HEAD_CELL_ICON?.classList.contains(DESCENDING_ICON_CLASSNAME)).toBeTruthy()
            expect(ID_HEAD_CELL_ICON?.classList.contains(ASCENDING_ICON_CLASSNAME)).toBeFalsy()

            // Sorting based on ID, Ascending.
            act(() => {
                fireEvent.click(getByText(ID_CELL_HEADER))
            })

            await waitFor(() => {
                expect(getAllByRole(TABLE_ROW_ROLE)[0].firstChild?.textContent).toBe(ROW1_ID_CELL_CONTENT)
            })
            expect(ID_HEAD_CELL_ICON?.classList.contains(ASCENDING_ICON_CLASSNAME)).toBeTruthy()
            expect(ID_HEAD_CELL_ICON?.classList.contains(DESCENDING_ICON_CLASSNAME)).toBeFalsy()
        })
    })
    describe('Table Pagination', () => {
        test('When giving pagination props and Clicking on nextButton or Previous, onPageChange should be called with page number', async () => {
            propsTable.sizeRowsPerPage = 1
            propsTable.pageProps = 1
            propsTable.rows = [TEST_ELEMENT_LIST[0]]
            const mockOnPageChange = jest.fn()
            propsTable.onPageChange = mockOnPageChange
            const { getByText, getByTitle } = reduxedRender(<Table {...propsTable} />)

            // Display the number of rows / total Rows
            let labelDisplayedRows = '1–1 / 2'
            expect(getByText(labelDisplayedRows)).toBeTruthy()

            // When giving first page previous button should be disabled.
            expect(getByTitle(PREVIOUS_PAGE_BUTTON_TITLE).classList.contains(DISABLED_CLASSNAME)).toBeTruthy()
            expect(getByTitle(NEXT_PAGE_BUTTON_TITLE).classList.contains(DISABLED_CLASSNAME)).toBeFalsy()
            // Clicking on next page.
            act(() => {
                fireEvent.click(getByTitle(NEXT_PAGE_BUTTON_TITLE))
            })
            await waitFor(() => {
                expect(mockOnPageChange).toHaveBeenCalledWith(propsTable.pageProps + 1)
            })

            propsTable.pageProps = 2
            propsTable.rows = [TEST_ELEMENT_LIST[1]]
            labelDisplayedRows = '2–2 / 2'
            expect(getByText(labelDisplayedRows)).toBeTruthy()

            expect(getByTitle(PREVIOUS_PAGE_BUTTON_TITLE).classList.contains(DISABLED_CLASSNAME)).toBeFalsy()
            expect(getByTitle(NEXT_PAGE_BUTTON_TITLE).classList.contains(DISABLED_CLASSNAME)).toBeTruthy()
            // Clicking on Previous Page.
            act(() => {
                fireEvent.click(getByTitle(PREVIOUS_PAGE_BUTTON_TITLE))
            })
            await waitFor(() => {
                expect(mockOnPageChange).toHaveBeenCalledWith(propsTable.pageProps - 1)
            })
        })
    })
})
