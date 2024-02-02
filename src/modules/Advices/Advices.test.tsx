import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Advices } from 'src/modules/Advices/Advices'

describe('Advices tests', () => {
    test('renders correctly, and show the ecogest tags screen initialy', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <Advices />
            </Router>,
        )

        expect(getByText('Ecogestes')).toBeInTheDocument()
        expect(getByText('Nos conseils')).toBeInTheDocument()
        expect(getByText('Réalisés')).toBeInTheDocument()
        expect(getByText('Postes de conso')).toBeInTheDocument()
        expect(getByText('Pièces')).toBeInTheDocument()
        // when clicking on the tab "Réalisés", show the realized ecogest list screen
        userEvent.click(getByText('Réalisés'))
        await waitFor(() => {
            expect(getByText('Tous les écogestes réalisés')).toBeInTheDocument()
        })
    })
})
