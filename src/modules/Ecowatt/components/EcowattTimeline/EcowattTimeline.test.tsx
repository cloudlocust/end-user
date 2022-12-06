import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_ECOWATT_DATA } from 'src/mocks/handlers/ecowatt'
import { EcowattTimeline } from 'src/modules/Ecowatt/components/EcowattTimeline'

let mockEcowattTimelineProps = {
    hourlyValues: TEST_ECOWATT_DATA[0].hourly_values,
}

const pasInHours = ['4h', '8h', '12h', '16', '20h', '24h']

describe('EcowattTimeline tests', () => {
    test('when timeline is rendered', async () => {
        const { container } = reduxedRender(<EcowattTimeline {...mockEcowattTimelineProps} />)
        expect(container.getElementsByClassName('hour')).toHaveLength(24)
        pasInHours.forEach((pas) => {
            expect(pas).toBeTruthy()
        })
    })
})
