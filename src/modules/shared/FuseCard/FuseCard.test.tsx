import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'

describe('FuseCard Component', () => {
    it('renders correctly with default styles', () => {
        const { container } = render(<FuseCard />)
        const cardElement = container.firstChild

        expect(cardElement).toHaveClass('rounded-20 shadow')
    })

    it('applies additional classes and styles passed as props', () => {
        const { container } = render(<FuseCard className="extra-class" sx={{ backgroundColor: 'blue' }} />)
        const cardElement = container.firstChild

        expect(cardElement).toHaveClass('extra-class')
        expect(cardElement).toHaveStyle('background-color: blue')
    })
})
