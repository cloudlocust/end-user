import { reduxedRender } from 'src/common/react-platform-components/test'
import { SwitchIdleConsumptionButton } from 'src/modules/MyConsumption/components/SwitchIdleConsumptionButton'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import userEvent from '@testing-library/user-event'

const GENERAL_TEXT = 'Général'
const VEILLE_TEXT = 'Veille'

describe('SwitchIdleConsumptionButton', () => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#006970',
            },
            secondary: {
                main: '#FFC200',
            },
        },
    })

    test('when button is in general as default', async () => {
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchIdleConsumptionButton />
            </ThemeProvider>,
        )

        const generalElement = getByText(GENERAL_TEXT)
        const veilleElement = getByText(VEILLE_TEXT)

        expect(generalElement).toBeInTheDocument()
        expect(veilleElement).toBeInTheDocument()

        expect(generalElement).toHaveStyle({
            background: theme.palette.secondary.main,
        })

        expect(veilleElement).toHaveStyle({
            background: theme.palette.primary.main,
        })
    })
    test('when veille button is clicked, style changes', async () => {
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchIdleConsumptionButton />
            </ThemeProvider>,
        )

        const veilleElement = getByText(VEILLE_TEXT)

        userEvent.click(veilleElement)

        expect(veilleElement).toHaveStyle({
            background: theme.palette.secondary.main,
        })
    })
})
