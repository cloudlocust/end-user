import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import dayjs from 'dayjs'
import { TEST_CONNECTED_PLUGS } from 'src/mocks/handlers/connectedPlugs'
import {
    IConnectedPlug,
    connectedPlugConsentStateEnum,
} from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugs.d'
import ConnectedPlugsMobileRowContent from 'src/modules/MyHouse/components/ConnectedPlugs/ConnectedPlugsMobileRow'

let mockConnectedPlug: IConnectedPlug = applyCamelCase(TEST_CONNECTED_PLUGS[0])

const CONNECTED_PLUG_CONSENT_EXIST_TEXT = 'Connectée le'
const CONNECTED_PLUG_CONSENT_NOT_EXIST_TEXT = 'Non Connectée'
describe('ConnectedPlugs Mobile Row Test', () => {
    describe('Content Test', () => {
        test('when Consent Exist', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <ConnectedPlugsMobileRowContent row={mockConnectedPlug} />
                </Router>,
            )
            expect(getByText(mockConnectedPlug.deviceName)).toBeTruthy()
            expect(getByText(CONNECTED_PLUG_CONSENT_EXIST_TEXT, { exact: false })).toBeTruthy()
            expect(
                getByText(dayjs.utc(mockConnectedPlug.createdAt).local().format('DD/MM/YYYY'), { exact: false }),
            ).toBeTruthy()
        })
        test('when Consent Not Exist', async () => {
            mockConnectedPlug.consentState = connectedPlugConsentStateEnum.DENIED
            const { getByText } = reduxedRender(
                <Router>
                    <ConnectedPlugsMobileRowContent row={mockConnectedPlug} />
                </Router>,
            )
            expect(getByText(mockConnectedPlug.deviceName)).toBeTruthy()
            expect(getByText(CONNECTED_PLUG_CONSENT_NOT_EXIST_TEXT, { exact: false })).toBeTruthy()
        })
    })
})
