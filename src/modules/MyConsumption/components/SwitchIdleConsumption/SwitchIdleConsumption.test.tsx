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
    isIdleConsumptionButtonSelected: false,
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

    test('when SwitchIdleConsumption button doesnt have idle selected', async () => {
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
    test('when idle button is selected, addIdleTarget is called', async () => {
        const mockAddIdleTarget = jest.fn()
        switchIdleConsumptionButtonProps.addIdleTarget = mockAddIdleTarget
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
            expect(mockAddIdleTarget).toHaveBeenCalled()
        })

        expect(defaultConsumptionButtonElement).toHaveStyle({
            background: theme.palette.secondary.main,
        })
    })

    test('when idle is selected and switching to default consumption, removeIdleTarget is called', async () => {
        const mockRemoveIdleTarget = jest.fn()
        switchIdleConsumptionButtonProps.removeIdleTarget = mockRemoveIdleTarget
        switchIdleConsumptionButtonProps.isIdleConsumptionButtonSelected = true
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchIdleConsumption {...switchIdleConsumptionButtonProps} />
            </ThemeProvider>,
        )

        const idleConsumptionButtonElement = getByText(IDLE_CONSUMPTION_BUTTON_TEXT)
        const defaultConsumptionButtonElement = getByText(DEFAULT_CONSUMPTION_BUTTON_TEXT)
        // Idle Consumption is selected.
        expect(idleConsumptionButtonElement).toHaveStyle({
            background: theme.palette.secondary.main,
        })

        // Switching back to Default Consumption.
        userEvent.click(defaultConsumptionButtonElement)
        // Remove IdleTarget is called
        expect(mockRemoveIdleTarget).toHaveBeenCalled()
    })

    test('when disabled idleButton styling and click should follow', async () => {
        switchIdleConsumptionButtonProps.isIdleConsumptionButtonSelected = false
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
        await waitFor(
            () => {
                expect(mockOnClickIdleConsumptionDisabledInfoIcon).toHaveBeenCalled()
            },
            { timeout: 8000 },
        )
    }, 10000)
})
