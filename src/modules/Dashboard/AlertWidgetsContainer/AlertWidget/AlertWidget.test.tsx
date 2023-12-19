import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { AlertWidget } from 'src/modules/Dashboard/AlertWidgetsContainer/AlertWidget'
import {
    AlertPeriodEnum,
    AlertTypeEnum,
    AlertWidgetProps,
} from 'src/modules/Dashboard/AlertWidgetsContainer/AlertWidget/AlertWidget.d'

describe('AlertWidget', () => {
    let mockAlertWidgetProps: AlertWidgetProps

    beforeEach(() => {
        mockAlertWidgetProps = {
            alertType: AlertTypeEnum.PRICE,
            alertPeriod: AlertPeriodEnum.MONTHLY,
            currentValue: 10,
        }
    })

    test('When alertThreshold is not undefined, show the elements of the AlertWidget', () => {
        mockAlertWidgetProps.alertThreshold = 25
        const { getByTestId, getByText } = reduxedRender(
            <BrowserRouter>
                <AlertWidget {...mockAlertWidgetProps} />
            </BrowserRouter>,
        )

        expect(getByTestId('NotificationsActiveIcon')).toBeInTheDocument()
        expect(getByText("Mon seuil d'alerte")).toBeInTheDocument()
        expect(getByText('mensuel')).toBeInTheDocument()
        // expect(getByText('25 €')).toBeInTheDocument()
        expect(getByTestId('gauge-chart-alert-monthly')).toBeInTheDocument()
    })

    test('When alertThreshold is undefined, show the error message', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <AlertWidget {...mockAlertWidgetProps} />
            </BrowserRouter>,
        )

        expect(getByText("Vous n'avez pas encore configuré d'alerte de consommation")).toBeInTheDocument()
        expect(getByText('mensuel')).toBeInTheDocument()
        const addAlertButton = getByText('Créer une alerte')
        expect(addAlertButton).toBeInTheDocument()
        userEvent.click(addAlertButton)
        await waitFor(() => {
            expect(window.location.pathname).toBe('/alerts')
        })
    })
})
