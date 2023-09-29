import { screen, waitFor } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { INrlinkConsent } from 'src/modules/Consents/Consents.d'
import { RevokeNrlinkConsent } from 'src/modules/MyHouse/components/RevokeNrlinkConsent'

const nrLinkConsent: INrlinkConsent = {
    meterGuid: 'meterGuid',
    nrlinkConsentState: 'CONNECTED',
    nrlinkGuid: 'nrlinkGuid',
    createdAt: 'createdAt',
}
const onAfterRevokeNRLink = jest.fn()

describe('RevokeNrlinkConsent', () => {
    test('opens the dialog when the delete button is clicked', async () => {
        reduxedRender(<RevokeNrlinkConsent nrLinkConsent={nrLinkConsent} onAfterRevokeNRLink={onAfterRevokeNRLink} />)
        const deleteButton = screen.getByRole('button')
        userEvent.click(deleteButton)
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument()
        })
    })

    test('closes the dialog when the Non button is clicked', async () => {
        reduxedRender(<RevokeNrlinkConsent nrLinkConsent={nrLinkConsent} onAfterRevokeNRLink={onAfterRevokeNRLink} />)
        const deleteButton = screen.getByRole('button')
        userEvent.click(deleteButton)
        await waitFor(async () => {
            const nonButton = screen.getByRole('button', { name: 'Annuler' })
            userEvent.click(nonButton)
            await waitFor(() => {
                expect(screen.queryByRole('dialog')).toBeNull()
            })
        })
    })
})
