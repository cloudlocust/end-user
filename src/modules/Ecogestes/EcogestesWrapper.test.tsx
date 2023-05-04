import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EcogestesWrapper } from './EcogestesWrapper'

describe('EcogestesWrapper tests', () => {
    test('When rendering, should render correctly', async () => {
        const { getByText, getByRole } = reduxedRender(
            <BrowserRouter>
                <EcogestesWrapper />
            </BrowserRouter>,
        )
        expect(getByText('Postes de conso')).toBeTruthy()
        expect(getByText('Pièces')).toBeTruthy()
        expect(getByRole('progressbar')).toBeTruthy()
    })
})
