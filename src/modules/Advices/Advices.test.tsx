import { BrowserRouter as Router } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { Advices } from 'src/modules/Advices/Advices'

describe('Advices tests', () => {
    test('renders correctly', () => {
        const { getByText } = reduxedRender(
            <Router>
                <Advices />
            </Router>,
        )

        expect(getByText('Ecogestes')).toBeInTheDocument()
        expect(getByText('Nos conseils')).toBeInTheDocument()
        expect(getByText('Réalisés')).toBeInTheDocument()
    })
})
