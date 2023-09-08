import { reduxedRender } from 'src/common/react-platform-components/test'
import { SwitchIdleConsumption } from 'src/modules/MyConsumption/components/SwitchIdleConsumption'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import userEvent from '@testing-library/user-event'
import { SwitchIdleConsumptionProps } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { waitFor } from '@testing-library/react'

const DEFAULT_CONSUMPTION_BUTTON_TEXT = 'Général'
const IDLE_CONSUMPTION_BUTTON_TEXT = 'Veille'
const DISABLED_CLASS_NAME = 'Mui-disabled'

/**
 * Switch Idle Consumption Button Props.
 */
let switchIdleConsumptionButtonProps: SwitchIdleConsumptionProps = {
    addIdleTarget: jest.fn(),
    removeIdleTarget: jest.fn(),
    isIdleConsumptionButtonDisabled: false,
}
describe('SwitchIdleConsumption', () => {
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

    test('when SwitchIdleConsumption button is not idle by default', async () => {
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchIdleConsumption {...switchIdleConsumptionButtonProps} />
            </ThemeProvider>,
        )

        const defaultConsumptionButtonElement = getByText(DEFAULT_CONSUMPTION_BUTTON_TEXT)
        const idleConsumptionButtonElement = getByText(IDLE_CONSUMPTION_BUTTON_TEXT)

        expect(defaultConsumptionButtonElement).toBeInTheDocument()
        expect(idleConsumptionButtonElement).toBeInTheDocument()

        expect(defaultConsumptionButtonElement).toHaveStyle({
            background: theme.palette.secondary.main,
        })

        expect(idleConsumptionButtonElement).toHaveStyle({
            background: theme.palette.primary.main,
        })
    })
    test('when switching from idle to default consumption, style changes and removeIdleTarget is called', async () => {
        const mockRemoveIdleTarget = jest.fn()
        switchIdleConsumptionButtonProps.removeIdleTarget = mockRemoveIdleTarget
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchIdleConsumption {...switchIdleConsumptionButtonProps} />
            </ThemeProvider>,
        )

        const idleConsumptionButtonElement = getByText(IDLE_CONSUMPTION_BUTTON_TEXT)
        const defaultConsumptionButtonElement = getByText(DEFAULT_CONSUMPTION_BUTTON_TEXT)

        // Switching to Idle consumption
        userEvent.click(idleConsumptionButtonElement)
        await waitFor(() => {
            expect(idleConsumptionButtonElement).toHaveStyle({
                background: theme.palette.secondary.main,
            })
        })

        // Switching back to Default Consumption.
        userEvent.click(defaultConsumptionButtonElement)
        await waitFor(() => {
            expect(defaultConsumptionButtonElement).toHaveStyle({
                background: theme.palette.secondary.main,
            })
        })
        expect(idleConsumptionButtonElement).toHaveStyle({
            background: theme.palette.primary.main,
        })
        expect(mockRemoveIdleTarget).toHaveBeenCalled()
    })
    test('when idle button is clicked, style changes and addIdleTarget is called', async () => {
        const mockAddIdleTarget = jest.fn()
        switchIdleConsumptionButtonProps.addIdleTarget = mockAddIdleTarget
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchIdleConsumption {...switchIdleConsumptionButtonProps} />
            </ThemeProvider>,
        )

        const idleConsumptionButtonElement = getByText(IDLE_CONSUMPTION_BUTTON_TEXT)

        userEvent.click(idleConsumptionButtonElement)

        await waitFor(() => {
            expect(mockAddIdleTarget).toHaveBeenCalled()
        })
        expect(idleConsumptionButtonElement).toHaveStyle({
            background: theme.palette.secondary.main,
        })
    })

    test('when Idle prop is disabled idle button is disabled with icon', async () => {
        switchIdleConsumptionButtonProps.isIdleConsumptionButtonDisabled = true
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchIdleConsumption {...switchIdleConsumptionButtonProps} />
            </ThemeProvider>,
        )

        const idleConsumptionButtonElement = getByText(IDLE_CONSUMPTION_BUTTON_TEXT)

        expect(idleConsumptionButtonElement.classList.contains(DISABLED_CLASS_NAME)).toBeTruthy()
    })
})
