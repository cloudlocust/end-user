import { render, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { RouterPrompt } from 'src/modules/shared/RoutePrompt'

describe('RouterPrompt', () => {
    let history: MemoryHistory

    let newLocation = '/new-location'

    beforeEach(() => {
        history = createMemoryHistory()
    })

    test('renders without crashing', () => {
        render(
            <Router history={history}>
                <RouterPrompt when={false} contentText="test" />
            </Router>,
        )
    })

    test('shows prompt when "when" prop is true', () => {
        const { getByText } = render(
            <Router history={history}>
                <RouterPrompt
                    when={true}
                    title="Test Title"
                    contentText="Test Content"
                    okText="OK"
                    cancelText="Cancel"
                />
            </Router>,
        )

        act(() => {
            history.push(newLocation)
        })

        expect(getByText('Test Title')).toBeInTheDocument()
        expect(getByText('Test Content')).toBeInTheDocument()
        expect(getByText('OK')).toBeInTheDocument()
        expect(getByText('Cancel')).toBeInTheDocument()
    })

    test('calls onOK and navigates when OK button is clicked', async () => {
        const onOK = jest.fn().mockResolvedValue(true)
        const { getByText } = render(
            <Router history={history}>
                <RouterPrompt
                    when={true}
                    title="Test Title"
                    contentText="Test Content"
                    okText="OK"
                    cancelText="Cancel"
                    onOK={onOK}
                />
            </Router>,
        )

        act(() => {
            history.push(newLocation)
        })

        userEvent.click(getByText('OK'))

        await act(() => Promise.resolve())

        expect(onOK).toHaveBeenCalled()
        expect(history.location.pathname).toBe('/')
    })

    test('calls onCancel and does not navigate when Cancel button is clicked', async () => {
        const onCancel = jest.fn()
        const { getByText } = render(
            <Router history={history}>
                <RouterPrompt
                    when={true}
                    title="Test Title"
                    contentText="Test Content"
                    okText="OK"
                    cancelText="Cancel"
                    onCancel={onCancel}
                />
            </Router>,
        )

        act(() => {
            history.push(newLocation)
        })

        userEvent.click(getByText('Cancel'))

        await act(() => Promise.resolve())

        expect(onCancel).toHaveBeenCalled()
        expect(history.location.pathname).toBe(newLocation)
    })
})
