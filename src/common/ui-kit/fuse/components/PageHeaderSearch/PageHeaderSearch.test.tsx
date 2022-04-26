import { reduxedRender } from 'src/common/react-platform-components/test'
import PageHeaderSearch from 'src/common/ui-kit/fuse/components/PageHeaderSearch/PageHeaderSearch'
import { act, fireEvent, waitFor } from '@testing-library/react'

// Text
const INPUT_PLACEHOLDER_TEXT = 'Recherche'
const SEARCH_ICON_TEXT = 'search'
const headerIconNameText = 'headerIconName'
const headerTitleText = 'headerTitle'
const actionText = 'actionText'
const actionIconName = 'actionIconName'
/**
 * Mocking props of AddCustomerPopup.
 */
const mockPageHeaderSearchProps = {
    headerIconName: headerIconNameText,
    headerTitle: headerTitleText,
    onSearchClick: jest.fn(),
    onActionClick: jest.fn(),
    actionText: actionText,
    actionIconName: actionIconName,
}

describe('Test PageHeaderSearch', () => {
    test('When Component mount, props text should be shown', async () => {
        const { getByText } = reduxedRender(<PageHeaderSearch {...mockPageHeaderSearchProps} />)

        expect(getByText(headerIconNameText)).toBeTruthy()
        expect(getByText(headerTitleText)).toBeTruthy()
        expect(getByText(actionIconName)).toBeTruthy()
        expect(getByText(actionText)).toBeTruthy()
    })
    test('When clicking on Action Button, onActionClick should be called', async () => {
        const mockOnActionClick = jest.fn()
        mockPageHeaderSearchProps.onActionClick = mockOnActionClick
        const { getByText } = reduxedRender(<PageHeaderSearch {...mockPageHeaderSearchProps} />)
        const ActionText = getByText(actionText).parentElement as HTMLButtonElement

        act(() => {
            // This is the selector of the Action Button
            fireEvent.click(ActionText)
        })
        await waitFor(() => {
            expect(mockOnActionClick).toHaveBeenCalled()
        })
    })
    test('When typing on input, it should change and onSearchClick should be called', async () => {
        const mockOnSearchClick = jest.fn()
        mockPageHeaderSearchProps.onSearchClick = mockOnSearchClick
        const { getByText, getByPlaceholderText } = reduxedRender(<PageHeaderSearch {...mockPageHeaderSearchProps} />)
        const inputElement = getByPlaceholderText(INPUT_PLACEHOLDER_TEXT)
        act(() => {
            fireEvent.input(inputElement, {
                target: { value: 'abc' },
            })
        })
        await waitFor(() => {
            expect(inputElement).toHaveValue('abc')
        })
        const buttonSearch = getByText(SEARCH_ICON_TEXT).parentElement!
        act(() => {
            fireEvent.click(buttonSearch)
        })
        await waitFor(() => {
            expect(mockOnSearchClick).toHaveBeenCalledWith({ search: 'abc' })
        })
    })
})
