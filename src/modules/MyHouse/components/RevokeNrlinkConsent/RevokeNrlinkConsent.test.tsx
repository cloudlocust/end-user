import { screen, waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { INrlinkConsent } from 'src/modules/Consents/Consents.d'
import { RevokeNrlinkConsent } from 'src/modules/MyHouse/components/RevokeNrlinkConsent'
import { ConfirmProvider } from 'material-ui-confirm'

const nrLinkConsent: INrlinkConsent = {
    meterGuid: 'meterGuid',
    nrlinkConsentState: 'CONNECTED',
    nrlinkGuid: 'nrlinkGuid',
    createdAt: 'createdAt',
}
const onAfterRevokeNRLink = jest.fn()
const dialogText = 'Vous êtes sur le point de révoquer votre consentement nrLINK. Êtes-vous sûr de vouloir continuer ?'

describe('RevokeNrlinkConsent', () => {
    test('opens the dialog when the delete button is clicked', async () => {
        reduxedRender(
            <ConfirmProvider>
                <RevokeNrlinkConsent nrLinkConsent={nrLinkConsent} onAfterRevokeNRLink={onAfterRevokeNRLink} />,
            </ConfirmProvider>,
        )
        const deleteButton = screen.getByRole('button')
        userEvent.click(deleteButton)
        await waitFor(() => {
            expect(screen.getByText(dialogText)).toBeInTheDocument()
        })
    })

    test('closes the dialog when the button Annuler is clicked', async () => {
        reduxedRender(
            <ConfirmProvider>
                <RevokeNrlinkConsent nrLinkConsent={nrLinkConsent} onAfterRevokeNRLink={onAfterRevokeNRLink} />
            </ConfirmProvider>,
        )
        const deleteButton = screen.getByRole('button')
        userEvent.click(deleteButton)
        await waitFor(async () => {
            const annulerButton = screen.getByRole('button', { name: 'Annuler' })
            userEvent.click(annulerButton)
            await waitFor(() => {
                expect(screen.queryByText(dialogText)).toBeNull()
            })
        })
    })

    test('closes the dialog and call the onAfterRevokeNRLink function when the button Continuer is clicked', async () => {
        reduxedRender(
            <ConfirmProvider>
                <RevokeNrlinkConsent nrLinkConsent={nrLinkConsent} onAfterRevokeNRLink={onAfterRevokeNRLink} />
            </ConfirmProvider>,
        )
        const deleteButton = screen.getByRole('button')
        userEvent.click(deleteButton)
        await waitFor(async () => {
            const continuerButton = screen.getByRole('button', { name: 'Continuer' })
            userEvent.click(continuerButton)
            await waitFor(() => {
                expect(screen.queryByText(dialogText)).toBeNull()
                expect(onAfterRevokeNRLink).toHaveBeenCalledTimes(1)
            })
        })
    })
})
