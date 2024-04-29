import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { SolarInstallationRecommendationButton, URL_SOLAR_INSTALLATION_RECOMMENDATION } from './index'

describe('SolarInstallationRecommendationButton', () => {
    test('should render button with correct text', () => {
        const { getByTestId } = reduxedRender(<SolarInstallationRecommendationButton />)
        const button = getByTestId('solarInstallationRecommendationButton')
        expect(button).toBeInTheDocument()
        expect(button).toHaveTextContent('💖 Recommander mon installateur')
    })

    test('should open new tab when button is clicked', () => {
        const originalOpen = window.open
        window.open = jest.fn()
        const { getByTestId } = reduxedRender(<SolarInstallationRecommendationButton />)
        const button = getByTestId('solarInstallationRecommendationButton')
        userEvent.click(button)
        expect(window.open).toHaveBeenCalledWith(URL_SOLAR_INSTALLATION_RECOMMENDATION, '_blank', 'noopener noreferrer')
        window.open = originalOpen
    })
})
