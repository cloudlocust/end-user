import { reduxedRender } from 'src/common/react-platform-components/test'
import { HouseOverview } from 'src/modules/MyHouse/components/MyHouseOverview'
import { BrowserRouter as Router } from 'react-router-dom'
import { IHouseOverviewSectionsEnum } from 'src/modules/MyHouse/components/MyHouseOverview/HouseOverview.types'

let mockDefaultSelectedSection: IHouseOverviewSectionsEnum | undefined = undefined

// mock useLocation hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useLocation: () => ({
        state: {
            defaultSelectedSection: mockDefaultSelectedSection,
        },
        pathname: '/my-houses',
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

        expect(getByText('Mes équipements')).toHaveClass('selected')
    })
    test('when defaultSelectedSection is setted by "installation", `Mes énergies` tab is selected by default', () => {
        mockDefaultSelectedSection = IHouseOverviewSectionsEnum.INSTALLATION
        const { getByText } = reduxedRender(
            <Router>
                <HouseOverview />
            </Router>,
        )

        expect(getByText('Mes énergies')).toHaveClass('selected')
        mockDefaultSelectedSection = undefined
    })
})
