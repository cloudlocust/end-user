import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { MeterStatus } from 'src/modules/MyHouse/components/MeterStatus'

const mockMeterStatusProps = {
    houseId: '1',
    meterGuid: '12345678901234',
}

const COMPTEUR_TITLE = 'Compteur'
const NRLINK_TITLE = 'Consommation en temps réel'

describe('MeterStatus component test', () => {
    test('when the component loads', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <MeterStatus {...mockMeterStatusProps} />
            </Router>,
        )

        expect(getByText('n° 12345678901234')).toBeTruthy()
        expect(getByText(COMPTEUR_TITLE)).toBeTruthy()
        expect(getByText(NRLINK_TITLE)).toBeTruthy()
    })
})
