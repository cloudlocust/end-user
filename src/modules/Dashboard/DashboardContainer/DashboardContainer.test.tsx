import { screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { DashboardContainer } from 'src/modules/Dashboard/DashboardContainer'

jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        getConsents: jest.fn(),
    }),
}))
jest.mock('src/modules/Dashboard/StatusWrapper/nrlinkPowerHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useNrlinkMetrics: () => ({
        data: [],
    }),
}))

describe('DashboardContainer tests', () => {
    it('should render the component', async () => {
        reduxedRender(<DashboardContainer />, {
            initialState: { housingModel: { currentHousing: { id: 1, address: { city: 'Paris' } } } },
        })

        screen.getByText('Accueil')
    })
})
