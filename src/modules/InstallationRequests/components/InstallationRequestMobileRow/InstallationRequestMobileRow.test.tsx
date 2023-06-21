import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_INSTALLATION_REQUESTS } from 'src/mocks/handlers/installationRequests'
import { BrowserRouter as Router } from 'react-router-dom'
import { IInstallationRequests } from 'src/modules/InstallationRequests/installationRequests'
import dayjs from 'dayjs'
import { InstallationRequestMobileRowContent } from 'src/modules/InstallationRequests/components/InstallationRequestMobileRow'

let mockInstallationRequestList: IInstallationRequests = applyCamelCase(TEST_INSTALLATION_REQUESTS)

describe('InstallationRequestMobileRow Test', () => {
    describe('Content Test', () => {
        test('when he theader is shown', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <InstallationRequestMobileRowContent row={mockInstallationRequestList[0]} />
                </Router>,
            )
            expect(
                getByText(dayjs.utc(mockInstallationRequestList[0].createdAt).local().format('DD/MM/YYYY')),
            ).toBeTruthy()
        })
    })
})
