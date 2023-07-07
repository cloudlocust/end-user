import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { ISolarEquipment } from 'src/modules/SolarEquipments/solarEquipments'
import { TEST_SOLAR_EQUIPMENTS } from 'src/mocks/handlers/solarEquipments'
import { SolarEquipmentMobileRowContent } from 'src/modules/SolarEquipments/components/SolarEquipmentMobileRow'
import dayjs from 'dayjs'

let mockSolarEquipment: ISolarEquipment = applyCamelCase(TEST_SOLAR_EQUIPMENTS[0])

describe('SolarEquipmentMobileRow Test', () => {
    describe('Content Test', () => {
        test('when he theader is shown', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <SolarEquipmentMobileRowContent row={mockSolarEquipment} />
                </Router>,
            )
            expect(getByText(mockSolarEquipment.reference)).toBeTruthy()
            expect(getByText(mockSolarEquipment.brand)).toBeTruthy()
            getByText(dayjs.utc(mockSolarEquipment.installedAt).local().format('DD/MM/YYYY'))
        })
    })
})
