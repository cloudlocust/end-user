import { screen } from '@testing-library/react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { WeatherWidget } from 'src/modules/Dashboard/StatusWrapper/components/WeatherWidget'
import { WeatherWidgetProps } from 'src/modules/Dashboard/StatusWrapper/components/WeatherWidget/weatherWidget'

describe('WeatherWidget tests', () => {
    let defaultProps: WeatherWidgetProps
    beforeEach(() => {
        defaultProps = {
            isNrlinkPowerLoading: false,
            lastTemperatureData: {
                value: null,
                timestamp: null,
            },
        }
    })

    test('when temperature is null', async () => {
        reduxedRender(<WeatherWidget {...defaultProps} />, {
            initialState: { housingModel: { currentHousing: { address: { city: 'Paris' } } } },
        })
        expect(screen.getByText('-')).toBeInTheDocument()
        expect(screen.getByText('°C')).toBeInTheDocument()
        expect(screen.getByText('Paris')).toBeInTheDocument()
    })
    test('when there is temperature value', async () => {
        defaultProps.lastTemperatureData = {
            value: 10,
            timestamp: null,
        }
        reduxedRender(<WeatherWidget {...defaultProps} />, {
            initialState: { housingModel: { currentHousing: { address: { city: 'Paris' } } } },
        })
        expect(screen.getByText('10')).toBeInTheDocument()
        expect(screen.getByText('°C')).toBeInTheDocument()
        expect(screen.getByText('Paris')).toBeInTheDocument()
    })
})
