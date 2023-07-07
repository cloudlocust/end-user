import { reduxedRender } from 'src/common/react-platform-components/test'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { Maintenance } from 'src/modules/Maintenance/Maintenance'

describe('Maintenance page tests', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFEECD',
            },
        },
    })

    test('when messages are rendered', async () => {
        const { getByText } = reduxedRender(<Maintenance />)
        expect(getByText('Une maintenance est en cours. Nous revenons au plus vite.')).toBeInTheDocument()
    })
    test('when the svg has the theme primaryy main color', async () => {
        const { getByTestId } = reduxedRender(
            <ThemeProvider theme={theme}>
                <Maintenance />
            </ThemeProvider>,
        )
        const svg = getByTestId('react-svg')

        expect(svg).toBeInTheDocument()
    })
})
