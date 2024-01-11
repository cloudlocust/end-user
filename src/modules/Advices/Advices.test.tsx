import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Advices } from 'src/modules/Advices/Advices'

describe('Advices tests', () => {
    test('renders correctly, and show the ecogest tags screen initialy', () => {
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
    })

    test('when clicking in the tab "Réalisés", show the released ecogest list screen', async () => {
        const { getByText, getByLabelText, queryByLabelText } = reduxedRender(
            <Router>
                <Advices />
            </Router>,
        )

        userEvent.click(getByText('Réalisés'))
        await waitFor(() => {
            expect(getByLabelText('list, ecogests, cards')).toBeInTheDocument()
            expect(queryByLabelText('button, filter')).not.toBeTruthy()
        })
    })
})
