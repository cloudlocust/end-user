import { render, screen } from '@testing-library/react'
import { FAQ } from 'src/modules/shared/FAQ'

describe('FAQ Component', () => {
    const items = [
        {
            title: 'Question 1',
            content: 'Answer 1',
        },
        {
            title: 'Question 2',
            content: 'Answer 2',
        },
    ]

    it('renders the FAQ component with correct title', () => {
        render(<FAQ items={items} title="Frequently Asked Questions" />)
        const titleElement = screen.getByText('Frequently Asked Questions')
        expect(titleElement).toBeInTheDocument()
    })

    it('renders the FAQ component with correct number of items', () => {
        render(<FAQ items={items} title="Frequently Asked Questions" />)
        const itemElements = screen.getAllByRole('button')
        expect(itemElements.length).toBe(items.length)
    })

    it('expands and collapses the accordion items correctly', () => {
        render(<FAQ items={items} title="Frequently Asked Questions" />)
        const itemElements = screen.getAllByRole('button')

        // Click on the first item to expand it
        itemElements[0].click()
        expect(itemElements[0].getAttribute('aria-expanded')).toBe('true')

        // Click on the first item again to collapse it
        itemElements[0].click()
        expect(itemElements[0].getAttribute('aria-expanded')).toBe('false')
    })
})
