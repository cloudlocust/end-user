import { reduxedRender } from 'src/common/react-platform-components/test'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import Error500 from 'src/modules/Errors/Error500'

describe('test Error500 component', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
        },
    })
    test('when messages are rendered', async () => {
        const { getByText } = reduxedRender(<Error500 />)
        expect(getByText('Oops ! Une erreur est survenue !')).toBeInTheDocument()
        expect(getByText('Nous rencontrons actuellement une erreur. Veuillez réessayer plus tard')).toBeInTheDocument()
    })
    test('when the svg has the theme primaryy main color', async () => {
        const { getByTestId } = reduxedRender(
            <ThemeProvider theme={theme}>
                <Error500 />
            </ThemeProvider>,
        )
        const svg = getByTestId('react-svg')

        expect(svg).toBeInTheDocument()
    })
})
