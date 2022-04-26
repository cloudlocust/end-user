import { reduxedRender } from 'src/common/react-platform-components/test'
import FilterButton, {
    filterDetailsTypePropertyT,
} from 'src/common/ui-kit/components/MapElementList/components/Filters/FilterButton'
import { act, waitFor, fireEvent } from '@testing-library/react'

const mockFilterList = [
    {
        label: 'Interest',
        name: 'interests',
        type: 'bool' as filterDetailsTypePropertyT,
        options: [
            {
                name: 'none',
                label: 'Aucun',
            },
            {
                name: 'installation',
                label: 'Installation',
            },
            {
                name: 'supplier',
                label: 'Fournisseur',
            },
        ],
    },
    {
        label: 'Status',
        name: 'status',
        type: 'select' as filterDetailsTypePropertyT,
        options: [
            {
                name: 'NEW',
                label: 'Nouvelle',
            },
            {
                name: 'PENDING',
                label: 'En Cours',
            },
        ],
    },
]

// Test Id
const CHECKBOX_IS_INTERESTED_BY_INSTALATION = 'checkbox-installation'
const CHECKBOX_IS_INTERESTED_BY_SUPPLIER = 'checkbox-supplier'
const CHECKBOX_NEW = 'checkbox-NEW'
const CHECKBOX_PENDING = 'checkbox-PENDING'
const CHECKBOX_NONE_OPTION = 'checkbox-none'

// Role
const MUI_MODAL_ROLE = 'presentation'

// ClassNames
const MUI_CHECKED = 'Mui-checked'

// Text
const INTEREST_FILTER_LABEL = 'Interest'
const STATUS_FILTER_LABEL = 'Status'
const INTEREST_SUPPLIER_OPTION_LABEL = 'Fournisseur'
const INTEREST_INSTALLATION_OPTION_LABEL = 'Installation'
const NONE_OPTION_LABEL = 'Aucun'
const RESET_OPTION_TEXT = 'Réinitialiser'

// OnConfirm Filter
const TEST_CONFIRM_FILTER_BOOL_ARGS = {
    installation: true,
    supplier: undefined,
}
const TEST_CONFIRM_FILTER_SELECT_ARGS = {
    status: ['NEW', 'PENDING'],
}
const mockFilterButtonProps = {
    filterDetails: mockFilterList[0],
    onConfirmFilter: jest.fn(),
}

describe('FilterButton Test', () => {
    test('When mounts and clicked on a filter button, popup is displayed and checkbox not checked', async () => {
        const { getByText, getByTestId } = reduxedRender(<FilterButton {...mockFilterButtonProps} />)
        expect(getByText(INTEREST_FILTER_LABEL)).toBeTruthy()
        act(() => {
            fireEvent.click(getByText(INTEREST_FILTER_LABEL))
        })
        await waitFor(() => {
            expect(getByText(INTEREST_INSTALLATION_OPTION_LABEL)).toBeTruthy()
        })
        expect(getByText(NONE_OPTION_LABEL)).toBeTruthy()
        expect(getByText(INTEREST_SUPPLIER_OPTION_LABEL)).toBeTruthy()
        expect(getByTestId(CHECKBOX_IS_INTERESTED_BY_INSTALATION).classList.contains(MUI_CHECKED)).toBeFalsy()
        expect(getByTestId(CHECKBOX_IS_INTERESTED_BY_SUPPLIER).classList.contains(MUI_CHECKED)).toBeFalsy()
        expect(getByTestId(CHECKBOX_NONE_OPTION).classList.contains(MUI_CHECKED)).toBeFalsy()
    })
    test('When selecting an option checkbox is checked, and reset button is shown', async () => {
        const { getByText, getByTestId } = reduxedRender(<FilterButton {...mockFilterButtonProps} />)
        act(() => {
            fireEvent.click(getByText(INTEREST_FILTER_LABEL))
        })
        await waitFor(() => {
            expect(getByText(INTEREST_INSTALLATION_OPTION_LABEL)).toBeTruthy()
        })
        act(() => {
            fireEvent.click(getByTestId(CHECKBOX_IS_INTERESTED_BY_INSTALATION).firstChild as HTMLInputElement)
        })
        await waitFor(() => {
            expect(getByTestId(CHECKBOX_IS_INTERESTED_BY_INSTALATION).classList.contains(MUI_CHECKED)).toBeTruthy()
        })
        expect(getByText(RESET_OPTION_TEXT)).toBeTruthy()
    })
    test('When selecting an option and clicking on reset button, all options are unchecked', async () => {
        const { getByText, getByTestId } = reduxedRender(<FilterButton {...mockFilterButtonProps} />)
        act(() => {
            fireEvent.click(getByText(INTEREST_FILTER_LABEL))
        })
        await waitFor(() => {
            expect(getByText(INTEREST_INSTALLATION_OPTION_LABEL)).toBeTruthy()
        })
        act(() => {
            fireEvent.click(getByTestId(CHECKBOX_IS_INTERESTED_BY_INSTALATION).firstChild as HTMLInputElement)
        })
        await waitFor(() => {
            expect(getByText(RESET_OPTION_TEXT)).toBeTruthy()
        })
        expect(getByTestId(CHECKBOX_IS_INTERESTED_BY_INSTALATION).classList.contains(MUI_CHECKED)).toBeTruthy()
        act(() => {
            fireEvent.click(getByText(RESET_OPTION_TEXT))
        })
        await waitFor(() => {
            expect(getByTestId(CHECKBOX_IS_INTERESTED_BY_INSTALATION).classList.contains(MUI_CHECKED)).toBeFalsy()
        })
        expect(getByTestId(CHECKBOX_IS_INTERESTED_BY_SUPPLIER).classList.contains(MUI_CHECKED)).toBeFalsy()
        expect(getByTestId(CHECKBOX_NONE_OPTION).classList.contains(MUI_CHECKED)).toBeFalsy()
    })
    test('When closing popover clicking outside of it, its options not shown and onConfirmFilter should not be called because selectedOptions did not change', async () => {
        const mockOnConfirmUnChangedOptions = jest.fn()
        mockFilterButtonProps.onConfirmFilter = mockOnConfirmUnChangedOptions
        const { getByText, getByRole } = reduxedRender(<FilterButton {...mockFilterButtonProps} />)
        act(() => {
            fireEvent.click(getByText(INTEREST_FILTER_LABEL))
        })
        await waitFor(() => {
            expect(getByText(INTEREST_INSTALLATION_OPTION_LABEL)).toBeTruthy()
        })
        // Click on the backdrop, to close the filterMenu
        act(() => {
            fireEvent.click(getByRole(MUI_MODAL_ROLE).firstChild as HTMLDivElement)
        })
        await waitFor(() => {
            expect(() => getByText(INTEREST_INSTALLATION_OPTION_LABEL)).toThrow()
        })
        expect(() => getByText(NONE_OPTION_LABEL)).toThrow()
        expect(() => getByText(INTEREST_SUPPLIER_OPTION_LABEL)).toThrow()
        expect(mockOnConfirmUnChangedOptions).not.toHaveBeenCalled()
    })
    test('When Choosing an option of type bool, onConfirmFilter should be called with right args', async () => {
        const mockOnConfirmUnChangedOptions = jest.fn()
        mockFilterButtonProps.onConfirmFilter = mockOnConfirmUnChangedOptions
        const { getByText, getByTestId, getByRole } = reduxedRender(<FilterButton {...mockFilterButtonProps} />)
        act(() => {
            fireEvent.click(getByText(INTEREST_FILTER_LABEL))
        })
        await waitFor(() => {
            expect(getByText(INTEREST_INSTALLATION_OPTION_LABEL)).toBeTruthy()
        })
        // Chosing is_interested_by_installation option.
        act(() => {
            fireEvent.click(getByTestId(CHECKBOX_IS_INTERESTED_BY_INSTALATION).firstChild as HTMLInputElement)
        })
        await waitFor(() => {
            expect(getByTestId(CHECKBOX_IS_INTERESTED_BY_INSTALATION).classList.contains(MUI_CHECKED)).toBeTruthy()
        })
        // Click on the backdrop, to close the filterMenu
        act(() => {
            fireEvent.click(getByRole(MUI_MODAL_ROLE).firstChild as HTMLDivElement)
        })
        await waitFor(() => {
            expect(() => getByText(INTEREST_INSTALLATION_OPTION_LABEL)).toThrow()
        })
        expect(() => getByText(NONE_OPTION_LABEL)).toThrow()
        expect(() => getByText(INTEREST_SUPPLIER_OPTION_LABEL)).toThrow()
        expect(mockOnConfirmUnChangedOptions).toHaveBeenCalledWith(TEST_CONFIRM_FILTER_BOOL_ARGS)
    })
    test('When Choosing an option of type select, onConfirmFilter should be called with right args', async () => {
        mockFilterButtonProps.filterDetails = mockFilterList[1]
        const mockOnConfirmChangedOptions = jest.fn()
        mockFilterButtonProps.onConfirmFilter = mockOnConfirmChangedOptions
        const { getByText, getByTestId, getByRole } = reduxedRender(<FilterButton {...mockFilterButtonProps} />)
        act(() => {
            fireEvent.click(getByText(STATUS_FILTER_LABEL))
        })
        await waitFor(() => {
            expect(getByText(STATUS_FILTER_LABEL)).toBeTruthy()
        })
        // Chosing status option with NEW.
        act(() => {
            fireEvent.click(getByTestId(CHECKBOX_NEW).firstChild as HTMLInputElement)
        })
        await waitFor(() => {
            expect(getByTestId(CHECKBOX_NEW).classList.contains(MUI_CHECKED)).toBeTruthy()
        })
        // Chosing status option with PENDING.
        act(() => {
            fireEvent.click(getByTestId(CHECKBOX_PENDING).firstChild as HTMLInputElement)
        })
        await waitFor(() => {
            expect(getByTestId(CHECKBOX_PENDING).classList.contains(MUI_CHECKED)).toBeTruthy()
        })
        // Click on the backdrop, to close the filterMenu
        act(() => {
            fireEvent.click(getByRole(MUI_MODAL_ROLE).firstChild as HTMLDivElement)
        })
        await waitFor(() => {
            expect(() => getByText(INTEREST_INSTALLATION_OPTION_LABEL)).toThrow()
        })
        expect(() => getByText(NONE_OPTION_LABEL)).toThrow()
        expect(() => getByText(INTEREST_SUPPLIER_OPTION_LABEL)).toThrow()
        expect(mockOnConfirmChangedOptions).toHaveBeenCalledWith(TEST_CONFIRM_FILTER_SELECT_ARGS)
    })
})
