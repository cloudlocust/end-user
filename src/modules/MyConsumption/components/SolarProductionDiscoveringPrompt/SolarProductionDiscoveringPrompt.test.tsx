import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import SolarProductionDiscoveringPrompt, {
    URL_SOLAR_INSTALLATION_DISCOVERING,
} from 'src/modules/MyConsumption/components/SolarProductionDiscoveringPrompt'

describe('SolarProductionDiscoveringPrompt', () => {
    test('renders all text components correctly', () => {
        const { getByText } = reduxedRender(<SolarProductionDiscoveringPrompt />)
        expect(getByText('Débloquer le mode solaire')).toBeInTheDocument()
        expect(getByText('Le mode solaire vous permet de :')).toBeInTheDocument()
        expect(getByText('● visualiser votre production solaire *')).toBeInTheDocument()
        expect(getByText('● et / ou visualiser votre réinjection en € **')).toBeInTheDocument()
        expect(getByText('*Production solaire')).toBeInTheDocument()
        expect(getByText('**Réinjection solaire')).toBeInTheDocument()
        expect(getByText('Découvrir l’option solaire')).toBeInTheDocument()
    })

    test('opens the correct URL when the button is clicked', async () => {
        const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)

        const { getByText } = reduxedRender(<SolarProductionDiscoveringPrompt />)

        userEvent.click(getByText('Découvrir l’option solaire'))
        await waitFor(() => {
            expect(openSpy).toHaveBeenCalledWith(URL_SOLAR_INSTALLATION_DISCOVERING, '_blank', 'noopener noreferrer')
        })

        openSpy.mockRestore()
    })
})
