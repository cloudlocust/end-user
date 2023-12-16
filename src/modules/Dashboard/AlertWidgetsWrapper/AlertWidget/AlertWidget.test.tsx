import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { AlertWidget } from 'src/modules/Dashboard/AlertWidgetsWrapper/AlertWidget'
import {
    AlertPeriodEnum,
    AlertTypeEnum,
    AlertWidgetProps,
} from 'src/modules/Dashboard/AlertWidgetsWrapper/AlertWidget/AlertWidget.d'

describe('AlertWidget', () => {
    let mockAlertWidgetProps: AlertWidgetProps

    beforeEach(() => {
        mockAlertWidgetProps = {
            alertType: AlertTypeEnum.PRICE,
            alertPeriod: AlertPeriodEnum.MONTHLY,
            currentValue: 10,
        }
    })

    test('When the widget content is loading, show loading circle', () => {
        mockAlertWidgetProps.isLoading = true
        const { getByRole } = reduxedRender(
            <BrowserRouter>
                <AlertWidget {...mockAlertWidgetProps} />
            </BrowserRouter>,
        )

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    test('When the widget content is not loading and alertThreshold is specified, show the elements of the AlertWidget', () => {
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
        expect(document.getElementById('gauge-chart-alert-month')).toBeDefined()
    })

    test('When the widget content is not loading and alertThreshold is not specified, show the error message', async () => {
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
