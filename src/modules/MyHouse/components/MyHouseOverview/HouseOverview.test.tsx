import { reduxedRender } from 'src/common/react-platform-components/test'
import { HouseOverview } from 'src/modules/MyHouse/components/MyHouseOverview'
import { BrowserRouter as Router } from 'react-router-dom'

let mockFocusOnInstallationForm = false

// mock useLocation hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useLocation: () => ({
        state: {
            focusOnInstallationForm: mockFocusOnInstallationForm,
        },
        pathname: '/my-houses/1/information',
    }),
}))

describe('test MyHouseOverview component', () => {
    test('should render all tabs of MyHouseOverview, and `Mes équipements` Tab is selected by default', () => {
        const { getByText } = reduxedRender(
            <Router>
                <HouseOverview />
            </Router>,
        )

        expect(getByText('Mes équipements')).toBeInTheDocument()
        expect(getByText('Ma maison')).toBeInTheDocument()
        expect(getByText('Mes énergies')).toBeInTheDocument()

        expect(getByText('Mes équipements')).toHaveClass('Mui-selected')
    })
    test('when focusOnInstallationForm is true, `Mes énergies` tab is selected by default', () => {
        mockFocusOnInstallationForm = true
        const { getByText } = reduxedRender(
            <Router>
                <HouseOverview />
            </Router>,
        )

        expect(getByText('Mes énergies')).toHaveClass('Mui-selected')
        mockFocusOnInstallationForm = false
    })
})
