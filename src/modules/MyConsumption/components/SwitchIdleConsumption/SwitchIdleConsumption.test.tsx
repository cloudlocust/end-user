import { reduxedRender } from 'src/common/react-platform-components/test'
import { SwitchIdleConsumption } from 'src/modules/MyConsumption/components/SwitchIdleConsumption'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import userEvent from '@testing-library/user-event'
import { SwitchIdleConsumptionProps } from 'src/modules/MyConsumption/myConsumptionTypes.d'
import { waitFor } from '@testing-library/react'

const DEFAULT_CONSUMPTION_BUTTON_TEXT = 'Général'
const IDLE_CONSUMPTION_BUTTON_TEXT = 'Veille'

/**
 * Switch Idle Consumption Button Props.
 */
let switchIdleConsumptionButtonProps: SwitchIdleConsumptionProps = {
    addIdleTarget: jest.fn(),
    removeIdleTarget: jest.fn(),
    isIdleConsumptionButtonDisabled: false,
    onClickIdleConsumptionDisabledInfoIcon: jest.fn(),
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

    test('when disabled idleButton styling and click should follow', async () => {
        switchIdleConsumptionButtonProps.isIdleConsumptionButtonDisabled = true
        const mockOnClickIdleConsumptionDisabledInfoIcon = jest.fn()
        switchIdleConsumptionButtonProps.onClickIdleConsumptionDisabledInfoIcon =
            mockOnClickIdleConsumptionDisabledInfoIcon
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchIdleConsumption {...switchIdleConsumptionButtonProps} />
            </ThemeProvider>,
        )

        const idleConsumptionButtonElement = getByText(IDLE_CONSUMPTION_BUTTON_TEXT)

        expect(idleConsumptionButtonElement).toHaveStyle({
            backgroundColor: theme.palette.grey[600],
        })
        userEvent.click(idleConsumptionButtonElement)
        await waitFor(() => {
            expect(mockOnClickIdleConsumptionDisabledInfoIcon).toHaveBeenCalled()
        })
    })
})
