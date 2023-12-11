import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { AlertWidget } from 'src/modules/Dashboard/AlertWidget'
import { AlertPeriodEnum, AlertTypeEnum, AlertWidgetProps } from 'src/modules/Dashboard/AlertWidget/AlertWidget.d'

describe('AlertWidget', () => {
    let mockAlertWidgetProps: AlertWidgetProps

    beforeEach(() => {
        mockAlertWidgetProps = {
            alertType: AlertTypeEnum.PRICE,
            alertPeriod: AlertPeriodEnum.MONTH,
            alertThreshold: 25,
            currentValue: 10,
            isLoading: false,
        }
    })

    test('When the widget content is loading, show loading circle', () => {
        const { getByRole } = reduxedRender(
            <BrowserRouter>
                <AlertWidget {...mockAlertWidgetProps} isLoading />
            </BrowserRouter>,
        )

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    test('When the widget content is not loading, show the elements of the AlertWidget', () => {
        const { getByTestId, getByText } = reduxedRender(
            <BrowserRouter>
                <AlertWidget {...mockAlertWidgetProps} />
            </BrowserRouter>,
        )

        expect(getByTestId('NotificationsActiveIcon')).toBeInTheDocument()
        expect(getByText("Mon seuil d'alerte")).toBeInTheDocument()
        expect(getByText('mensuel')).toBeInTheDocument()
        expect(getByText('25 €')).toBeInTheDocument()
        expect(document.getElementById('gauge-chart-alert-month')).toBeDefined()
    })
})
