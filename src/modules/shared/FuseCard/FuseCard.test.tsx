import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FuseCard } from 'src/modules/shared/FuseCard/FuseCard'

describe('FuseCard Component', () => {
    it('renders correctly with default styles', async () => {
        const { container } = render(<FuseCard />)
        const cardElement = container.firstChild

        expect(cardElement).toHaveClass('rounded-20 shadow')
    })

    it('applies additional classes and styles passed as props', async () => {
        const { container } = render(<FuseCard className="extra-class" sx={{ backgroundColor: 'blue' }} />)
        const cardElement = container.firstChild

        expect(cardElement).toHaveClass('extra-class')
        expect(cardElement).toHaveStyle('background-color: blue')
    })
    it('renders circularProgress', async () => {
        const { container } = render(<FuseCard isLoading={true} />)
        const circularProgressClassname = '.MuiCircularProgress-root'
        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
})
