import { reduxedRender } from 'src/common/react-platform-components/test'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import {
    SwitchConsumptionButtonLabelEnum,
    SwitchConsumptionButtonProps,
    SwitchConsumptionButtonTypeEnum,
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
            isIdleConsumptionButtonDisabled: false,
            onClickIdleConsumptionDisabledInfoIcon: jest.fn(),
            period: 'daily',
            isSolarProductionConsentOff: false,
            consumptionToggleButton: SwitchConsumptionButtonTypeEnum.Consumption,
            onSwitchConsumptionButton: jest.fn(),
        }
    })

    test('when isSolarProductionConsentOff is true and period is daily, Autoconsumption button is not shown', async () => {
        switchConsumptionButtonProps.isSolarProductionConsentOff = true
        switchConsumptionButtonProps.period = 'daily'
        const { getByText } = reduxedRender(<SwitchConsumptionButton {...switchConsumptionButtonProps} />)

        expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
        expect(getByText(SwitchConsumptionButtonLabelEnum.Idle)).toBeInTheDocument()
        expect(() => getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).toThrow()
    })

    test('when isSolarProductionConsentOff is false and period is daily, Autoconsumption button is shown', async () => {
        switchConsumptionButtonProps.isSolarProductionConsentOff = false
        switchConsumptionButtonProps.period = 'daily'
        const { getByText } = reduxedRender(<SwitchConsumptionButton {...switchConsumptionButtonProps} />)

        expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
        expect(getByText(SwitchConsumptionButtonLabelEnum.Idle)).toBeInTheDocument()
        expect(getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).toBeInTheDocument()
    })

    test('when isSolarProductionConsentOff is true and period is weekly, Autoconsumption button is not shown', async () => {
        switchConsumptionButtonProps.isSolarProductionConsentOff = true
        switchConsumptionButtonProps.period = 'weekly'
        const { getByText } = reduxedRender(<SwitchConsumptionButton {...switchConsumptionButtonProps} />)

        expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
        expect(getByText(SwitchConsumptionButtonLabelEnum.Idle)).toBeInTheDocument()
        expect(() => getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).toThrow()
    })

    test('when isSolarProductionConsentOff is false and period is weekly / monthly / yearly, Autoconsumption button is not shown', async () => {
        switchConsumptionButtonProps.isSolarProductionConsentOff = false
        switchConsumptionButtonProps.period = 'weekly'
        const { getByText } = reduxedRender(<SwitchConsumptionButton {...switchConsumptionButtonProps} />)

        expect(getByText(SwitchConsumptionButtonLabelEnum.General)).toBeInTheDocument()
        expect(getByText(SwitchConsumptionButtonLabelEnum.Idle)).toBeInTheDocument()
        expect(() => getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).toThrow()

        switchConsumptionButtonProps.period = 'monthly'
        expect(() => getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).toThrow()

        switchConsumptionButtonProps.period = 'yearly'
        expect(() => getByText(SwitchConsumptionButtonLabelEnum.AutoconsmptionProduction)).toThrow()
    })

    test('when isIdleConsumptionButtonDisabled is true, clicking on idle button should call onClickIdleConsumptionDisabledInfoIcon', async () => {
        switchConsumptionButtonProps.isIdleConsumptionButtonDisabled = true
        const mockOnClickIdleConsumptionDisabledInfoIcon = jest.fn()
        switchConsumptionButtonProps.onClickIdleConsumptionDisabledInfoIcon = mockOnClickIdleConsumptionDisabledInfoIcon
        const { getByText } = reduxedRender(<SwitchConsumptionButton {...switchConsumptionButtonProps} />)

        const idleButtonElement = getByText(SwitchConsumptionButtonLabelEnum.Idle)
        userEvent.click(idleButtonElement)
        await waitFor(() => {
            expect(mockOnClickIdleConsumptionDisabledInfoIcon).toHaveBeenCalled()
        })
    })

    test('when isIdleConsumptionButtonDisabled is false, clicking on idle button should call onSwitchConsumptionButton', async () => {
        switchConsumptionButtonProps.isIdleConsumptionButtonDisabled = false
        const mockOnSwitchConsumptionButton = jest.fn()
        switchConsumptionButtonProps.onSwitchConsumptionButton = mockOnSwitchConsumptionButton
        const { getByText } = reduxedRender(<SwitchConsumptionButton {...switchConsumptionButtonProps} />)

        const idleButtonElement = getByText(SwitchConsumptionButtonLabelEnum.Idle)
        userEvent.click(idleButtonElement)
        await waitFor(() => {
            expect(mockOnSwitchConsumptionButton).toHaveBeenCalled()
        })
    })

    test('when isIdleConsumptionButtonDisabled is true, the idle button has a disabled style', async () => {
        switchConsumptionButtonProps.isIdleConsumptionButtonDisabled = true
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchConsumptionButton {...switchConsumptionButtonProps} />
            </ThemeProvider>,
        )

        const idleButtonElement = getByText(SwitchConsumptionButtonLabelEnum.Idle)
        expect(idleButtonElement).toHaveStyle({
            backgroundColor: theme.palette.grey[600],
        })
    })

    test('when isIdleConsumptionButtonDisabled is false, the idle button has a style', async () => {
        switchConsumptionButtonProps.isIdleConsumptionButtonDisabled = false
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchConsumptionButton {...switchConsumptionButtonProps} />
            </ThemeProvider>,
        )

        const idleButtonElement = getByText(SwitchConsumptionButtonLabelEnum.Idle)
        expect(idleButtonElement).toHaveStyle({
            backgroundColor: theme.palette.primary.main,
        })
    })

    test("when any of the button is selected, it's style should change", async () => {
        switchConsumptionButtonProps.isIdleConsumptionButtonDisabled = false
        switchConsumptionButtonProps.period = 'weekly'
        const { getByText } = reduxedRender(
            <ThemeProvider theme={theme}>
                <SwitchConsumptionButton {...switchConsumptionButtonProps} />
            </ThemeProvider>,
        )

        const generalButtonElement = getByText(SwitchConsumptionButtonLabelEnum.General)

        userEvent.click(generalButtonElement)
        await waitFor(() => {
            expect(generalButtonElement).toHaveStyle({
                backgroundColor: theme.palette.secondary.main,
            })
        })
    })
})
