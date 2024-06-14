import { reduxedRender } from 'src/common/react-platform-components/test'
import { createTheme, alpha } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import userEvent from '@testing-library/user-event'
import { cleanup, waitFor } from '@testing-library/react'
import {
    SwitchConsumptionButtonLabelEnum,
    SwitchConsumptionButtonProps,
} from 'src/modules/MyConsumption/components/SwitchConsumptionButton/SwitchConsumptionButton.types'
import { SwitchConsumptionButton } from 'src/modules/MyConsumption/components/SwitchConsumptionButton'

describe('SwitchConsumptionButton', () => {
    let switchConsumptionButtonProps: SwitchConsumptionButtonProps

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

    beforeEach(() => {
        switchConsumptionButtonProps = {
            isIdleShown: true,
            isAutoConsumptionProductionShown: true,
        }
    })

    // Unmounts React trees after each test.
    afterEach(cleanup)

    test('when isAutoConsumptionProduction is not Active, Autoconsumption element button should not be shown', async () => {
        switchConsumptionButtonProps.isAutoConsumptionProductionShown = false

        const { getByText } = reduxedRender(<SwitchConsumptionButton {...switchConsumptionButtonProps} />)

        expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
        expect(() => getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).toThrow()
    })

    test('when AutoConsumptionProduction is Active, Autoconsumption element button should be shown', async () => {
        switchConsumptionButtonProps.isAutoConsumptionProductionShown = true

        const { getByText } = reduxedRender(<SwitchConsumptionButton {...switchConsumptionButtonProps} />)

        expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
        expect(getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).toBeInTheDocument()
    })

    test('when Idle is not Active, Idle element button should not be shown', async () => {
        switchConsumptionButtonProps.isIdleShown = false

        const { getByText } = reduxedRender(<SwitchConsumptionButton {...switchConsumptionButtonProps} />)

        expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
        expect(() => getByText(SwitchConsumptionButtonLabelEnum.Idle)).toThrow()
    })

    test('when Idle is Active, Idle element button should be shown', async () => {
        switchConsumptionButtonProps.isIdleShown = true

        const { getByText } = reduxedRender(<SwitchConsumptionButton {...switchConsumptionButtonProps} />)

        expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
        expect(getByText(SwitchConsumptionButtonLabelEnum.Idle)).toBeInTheDocument()
    })

    test("when any of the button is selected, it's style should change", async () => {
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchConsumptionButton {...switchConsumptionButtonProps} />
            </ThemeProvider>,
        )

        const generalButtonElement = getByText(SwitchConsumptionButtonLabelEnum.General)

        userEvent.click(generalButtonElement)
        await waitFor(() => {
            expect(generalButtonElement).toHaveStyle({
                backgroundColor: alpha(theme.palette.primary.main, 0.75),
            })
        })
    })
})
