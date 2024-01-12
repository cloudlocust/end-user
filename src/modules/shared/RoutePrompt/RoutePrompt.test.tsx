import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RouterPrompt } from 'src/modules/shared/RoutePrompt'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        goBack: jest.fn(),
        block: jest.fn(),
        unblock: jest.fn(),
    }),
}))

describe('RouterPrompt', () => {
    test('should not render the prompt dialog when showPrompt is false', () => {
        render(
            <Router>
                <RouterPrompt
                    when={false}
                    onOK={() => {}}
                    onCancel={() => {}}
                    title="Prompt Title"
                    contentText="Prompt Content"
                    okText="OK"
                    cancelText="Cancel"
                />
            </Router>,
        )

        const promptDialog = screen.queryByRole('dialog')
        expect(promptDialog).not.toBeInTheDocument()
    })

    // test('should render the prompt dialog when showPrompt is true', () => {
    //     const screen = render(
    //         <Router getUserConfirmation={() => {}}>
    //             <RouterPrompt
    //                 when={true}
    //                 onOK={() => {}}
    //                 onCancel={() => {}}
    //                 title="Prompt Title"
    //                 contentText="Prompt Content"
    //                 okText="OK"
    //                 cancelText="Cancel"
    //             />
    //         </Router>,
    //     )

    //     const promptDialog = screen.getByRole('dialog')
    //     expect(promptDialog).toBeInTheDocument()
    // })

    // test('should call onOK and navigate to currentPath when OK button is clicked', () => {
    //     const onOKMock = jest.fn()
    //     const currentPath = '/example-path'

    //     render(
    //         <Router>
    //             <RouterPrompt
    //                 when={true}
    //                 onOK={onOKMock}
    //                 onCancel={() => {}}
    //                 title="Prompt Title"
    //                 contentText="Prompt Content"
    //                 okText="OK"
    //                 cancelText="Cancel"
    //             />
    //         </Router>,
    //     )

    //     const okButton = screen.getByText('OK')
    //     fireEvent.click(okButton)

    //     expect(onOKMock).toHaveBeenCalled()
    //     expect(window.location.pathname).toBe(currentPath)
    // })

    // test('should call onCancel and navigate to currentPath when Cancel button is clicked', () => {
    //     const onCancelMock = jest.fn()
    //     const currentPath = '/example-path'

    //     render(
    //         <Router>
    //             <RouterPrompt
    //                 when={true}
    //                 onOK={() => {}}
    //                 onCancel={onCancelMock}
    //                 title="Prompt Title"
    //                 contentText="Prompt Content"
    //                 okText="OK"
    //                 cancelText="Cancel"
    //             />
    //         </Router>,
    //     )

    //     const cancelButton = screen.getByText('Cancel')
    //     fireEvent.click(cancelButton)

    //     expect(onCancelMock).toHaveBeenCalled()
    //     expect(window.location.pathname).toBe(currentPath)
    // })
})
