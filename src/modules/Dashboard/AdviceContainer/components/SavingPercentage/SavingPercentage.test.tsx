import { render } from '@testing-library/react'
import { SavingPercentage } from 'src/modules/Dashboard/AdviceContainer/components/SavingPercentage'

describe('SavingPercentage', () => {
    it('calculates the number of icons correctly when the percentage is above 10', () => {
        const percentage = '10%'

        const { getAllByTestId } = render(<SavingPercentage percentageSaved={percentage} />)

        expect(getAllByTestId('saving-icon').length).toBe(1)
    })
    it("doesn't show saving icon when the percentage doesn't exisit", () => {
        const percentage = ''

        const { getByTestId } = render(<SavingPercentage percentageSaved={percentage} />)

        expect(() => getByTestId('saving-icon')).toThrow()
    })
})
