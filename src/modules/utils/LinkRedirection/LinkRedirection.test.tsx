import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { LinkRedirection } from 'src/modules/utils/LinkRedirection'

// Mock window.open
const originalWindowOpen = window.open
beforeAll(() => {
    window.open = jest.fn()
})

afterAll(() => {
    window.open = originalWindowOpen
})

describe('LinkRedirection Component', () => {
    test('should render with default color and call preventDefault and window.open on click', () => {
        const url = 'https://example.com'
        const label = 'Click here'
        const { getByText } = render(
            <IntlProvider locale="en">
                <LinkRedirection url={url} label={label} />
            </IntlProvider>,
        )

        const linkElement = getByText(label)
        expect(linkElement).toBeTruthy()

        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
        jest.spyOn(clickEvent, 'preventDefault')

        fireEvent(linkElement, clickEvent)

        expect(clickEvent.preventDefault).toHaveBeenCalled()
        expect(window.open).toHaveBeenCalledWith(url, '_blank', 'noopener noreferrer')
    })

    test('should render with provided color and call preventDefault and window.open on click', () => {
        const url = 'https://example.com'
        const label = 'Click here'
        const color = 'secondary.main'
        const { getByText } = render(
            <IntlProvider locale="en">
                <LinkRedirection url={url} label={label} color={color} />
            </IntlProvider>,
        )

        const linkElement = getByText(label)
        expect(linkElement).toBeTruthy()

        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
        jest.spyOn(clickEvent, 'preventDefault')

        fireEvent(linkElement, clickEvent)

        expect(clickEvent.preventDefault).toHaveBeenCalled()
        expect(window.open).toHaveBeenCalledWith(url, '_blank', 'noopener noreferrer')
    })
})
