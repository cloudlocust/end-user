import React from 'react'
import { waitFor, act } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { createMemoryHistory } from 'history'
import { MyConsumptionChart } from 'src/modules/MyConsumption'
import { fakeData } from 'src/modules/MyConsumption/utils/fakeData'

const history = createMemoryHistory()

// eslint-disable-next-line jsdoc/require-jsdoc
const propsMyConsumptionChart = {
    data: fakeData,
    chartType: 'bar',
    isMetricsLoading: false,
}
describe('Test MyConsumptionChart', () => {
    test('When component mount with data', async () => {
        const { getByText } = reduxedRender(<MyConsumptionChart {...propsMyConsumptionChart} />)

        await waitFor(() => {
            expect(getByText('Récupérez votre mot de passe')).toBeTruthy()
        })
        expect(getByText('Revenir à la connexion')).toBeTruthy()
    })
    test('When isMetricsLoading true, Circular progress should be shown', async () => {
        propsMyConsumptionChart.isMetricsLoading = true
        const { getByText } = reduxedRender(<MyConsumptionChart {...propsMyConsumptionChart} />)

        await waitFor(() => {
            expect(() => getByText('MODIFIER_BUTTON_TEXT')).toThrow()
        })
    })
})
