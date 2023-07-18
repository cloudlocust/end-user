import { reduxedRender } from 'src/common/react-platform-components/test'
import ConnectedPlugsHeader from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugsHeader'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'

// Text
const CONNECTED_PLUGS_HEADER_TITLE_TEXT = 'Prises connectées Shelly'
const ADD_CONNECTED_PLUG_BUTTON_TEXT = 'Ajouter une prise'
const circularProgressClassname = '.MuiCircularProgress-root'
const GO_BACK_TEXT = 'Retour'
const mockHistoryGoBack = jest.fn()

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),

    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        goBack: mockHistoryGoBack,
        listen: jest.fn(), // mocked for FuseScroll
    }),
}))

/**
 * Mocking props of ConnectedPlugsHeader.
 */
const mockConnectedPlugsHeaderProps = {
    isConnectedPlugListLoading: false,
    onAddClick: jest.fn(),
}

describe('Test ConnectedPlugsHeader', () => {
    test('Should go back at previous location, when user click on Back Button', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <ConnectedPlugsHeader {...mockConnectedPlugsHeaderProps} />
            </Router>,
        )

        expect(getByText(CONNECTED_PLUGS_HEADER_TITLE_TEXT)).toBeTruthy()

        userEvent.click(getByText(GO_BACK_TEXT))

        await waitFor(
            () => {
                expect(mockHistoryGoBack).toHaveBeenCalled()
            },
            { timeout: 5000 },
        )
    })

    test('When clicking on Action Button, onAddClick should be called', async () => {
        const mockOnAddClick = jest.fn()
        mockConnectedPlugsHeaderProps.onAddClick = mockOnAddClick
        const { getByText } = reduxedRender(
            <Router>
                <ConnectedPlugsHeader {...mockConnectedPlugsHeaderProps} />
            </Router>,
        )

        userEvent.click(getByText(ADD_CONNECTED_PLUG_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockOnAddClick).toHaveBeenCalled()
        })
    })

    test('When Component mount, and isConnectedPlugListLoading spinner should be shown', async () => {
        mockConnectedPlugsHeaderProps.isConnectedPlugListLoading = true
        const { container } = reduxedRender(
            <Router>
                <ConnectedPlugsHeader {...mockConnectedPlugsHeaderProps} />
            </Router>,
        )

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
})
