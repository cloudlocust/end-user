import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import ConnectedPlugsInformationMessage from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugsInformationMessage'
import { waitFor } from '@testing-library/react'

const CONNECTED_PLUGS_INFORMATION_MESSAGE_TEXT =
    "Renseignez vos prises connectées pour visualiser votre production. Pour ajouter, supprimer des prises et gérer les consentements, cliquez sur le bouton d'ajout."
const CONNECTED_PLUG_INFORMATION_ICON = 'ErrorOutlineIcon'

describe('ConnectedPlugsInformationMessage test', () => {
    test('when the infoIcon is given, icon is shown in the widget., and when clicking on it message is shown', async () => {
        const { getByTestId, getByText } = reduxedRender(
            <Router>
                <ConnectedPlugsInformationMessage />
            </Router>,
        )

        expect(getByTestId(CONNECTED_PLUG_INFORMATION_ICON)).toBeTruthy()
        expect(() => getByText(CONNECTED_PLUGS_INFORMATION_MESSAGE_TEXT)).toThrow()
        // Clicking on Icon should show the message
        userEvent.click(getByTestId(CONNECTED_PLUG_INFORMATION_ICON))

        await waitFor(() => {
            expect(getByText(CONNECTED_PLUGS_INFORMATION_MESSAGE_TEXT)).toBeTruthy()
        })

        // Clicking on Icon should hide the message
        userEvent.click(getByTestId(CONNECTED_PLUG_INFORMATION_ICON))
        await waitFor(() => {
            expect(() => getByText(CONNECTED_PLUGS_INFORMATION_MESSAGE_TEXT)).toThrow()
        })
    })
})
