import { fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { reduxedRender } from 'src/common/react-platform-components/test'
import Table from 'src/common/ui-kit/components/Table/Table'
import { ICell, ITable } from 'src/common/ui-kit/components/Table/TableT'
import { MenuItem } from '@mui/material'
import userEvent from '@testing-library/user-event'

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
 * Prettier issue...
 */
// eslint-disable-next-line prettier/prettier
type cellType = (typeof TEST_ELEMENT_LIST)[0]

/**
 * Cells represent how data will be shown in each cell.
 */
let TEST_CELLS: ICell<cellType>[] = [
    {
        id: 'id',
        headCellLabel: 'ID',
        // eslint-disable-next-line jsdoc/require-jsdoc
        rowCell: (row: cellType) => `${row.id}`,
    },
    {
        id: 'label',
        headCellLabel: 'LABEL',
        // eslint-disable-next-line jsdoc/require-jsdoc
        rowCell: (row: cellType) => `${row.label}`,
    },
]

// Mobile Row Content Elemnt
// eslint-disable-next-line jsdoc/require-jsdoc
const MockMobileRowContentElement = ({ row }: { row: cellType }) => (
    <div>
        <p>{`mobileTitle-${row.id}`}</p>
        <p>{`mobile-${row.label}`}</p>
    </div>
)

const ACTION_MENU_ITEM_TEXT = 'actionText'
const MENU_ICON_TEST_ID = 'MoreVertIcon'

// Mobile Row Actions Elemnt
// eslint-disable-next-line jsdoc/require-jsdoc
const MockMobileRowActionsElement = ({ row }: { row: cellType }) => (
    <>
        <MenuItem>
            <p>{row.id}</p>
            <p>{ACTION_MENU_ITEM_TEXT}</p>
        </MenuItem>
    </>
)

// eslint-disable-next-line jsdoc/require-jsdoc
const propsTable: ITable<cellType> = {
    cells: TEST_CELLS,
    onRowClick: jest.fn(),
    rows: TEST_ELEMENT_LIST,
    onPageChange: jest.fn(),
    totalRows: TEST_ELEMENT_LIST.length,
    sizeRowsPerPage: 2,
    pageProps: 1,
    MobileRowContentElement: MockMobileRowContentElement,
    MobileRowActionsElement: MockMobileRowActionsElement,
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

const CARD_CLASSNAME = '.MuiCard-root'

// Title
const NEXT_PAGE_BUTTON_TITLE = 'Go to next page'
const PREVIOUS_PAGE_BUTTON_TITLE = 'Go to previous page'

let mockRowClickMobile = jest.fn()
let mockIsMobile = false
// testing for mobile as default
jest.mock(
    '@mui/material/useMediaQuery',
    () => (_params: any) =>
        // eslint-disable-next-line jsdoc/require-jsdoc
        mockIsMobile,
)

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
    describe('Table Mobile', () => {
        beforeAll(() => {
            mockIsMobile = true
        })

        test('When Table given with data, Table should show Cards, with given data', async () => {
            const { getByText, container } = reduxedRender(<Table {...propsTable} />)

            expect(container.querySelectorAll(CARD_CLASSNAME)).toHaveLength(propsTable.cells.length)
            expect(getByText('mobileTitle-1')).toBeTruthy()
            expect(getByText('mobile-Arow1')).toBeTruthy()
            expect(getByText('mobileTitle-2')).toBeTruthy()
            expect(getByText('mobile-Brow2')).toBeTruthy()
        })

        test('When Table have Actions and open / close menu', async () => {
            const { getByText, getAllByTestId, getAllByRole } = reduxedRender(<Table {...propsTable} />)

            userEvent.click(getAllByTestId(MENU_ICON_TEST_ID)[0])
            await waitFor(() => {
                expect(getByText(ACTION_MENU_ITEM_TEXT)).toBeTruthy()
            })

            // Click on the backdrop
            fireEvent.click(getAllByRole('presentation')[0].firstChild as HTMLDivElement)
            await waitFor(() => {
                expect(() => getByText(ACTION_MENU_ITEM_TEXT)).toThrow()
            })
        })

        test('When Clicking on a MobileTableRow onRowClick should be called with row data', async () => {
            propsTable.onRowClick = mockRowClickMobile
            const { getAllByRole } = reduxedRender(<Table {...propsTable} />)

            const ROW1 = getAllByRole(TABLE_ROW_ROLE)[0]
            act(() => {
                fireEvent.click(ROW1)
            })

            await waitFor(() => {
                expect(mockRowClickMobile).toHaveBeenCalledWith(TEST_ELEMENT_LIST[0])
            })
        })

        afterAll(() => {
            mockIsMobile = false
        })
    })
    describe('Table Desktop', () => {
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
                    expect(mockOnPageChange).toHaveBeenCalledWith(propsTable.pageProps! + 1)
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
                    expect(mockOnPageChange).toHaveBeenCalledWith(propsTable.pageProps! - 1)
                })
            })
        })
    })
})
