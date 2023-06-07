import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { TempoAlerts } from 'src/modules/Alerts/components/TempoAlerts'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

let mockIsLoadingInProgress = false
const circularProgressClassname = '.MuiCircularProgress-root'

jest.mock('src/modules/Alerts/NovuAlertPreferencesHook', () => ({
    ...jest.requireActual('src/modules/Alerts/NovuAlertPreferencesHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useNovuAlertPreferences: () => ({
        isLoadingInProgress: mockIsLoadingInProgress,
        getNovuAlertPreferences: jest.fn(),
        novuAlertPreferences: {
            isEmailTempo: false,
            isPushTempo: false,
        },
    }),
}))

describe('TempoAlerts tests', () => {
    test('when isLoadingInProgress is true', async () => {
        mockIsLoadingInProgress = true
        const { container } = reduxedRender(<TempoAlerts />, {
            initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
        })

        expect(container.querySelector(circularProgressClassname)).toBeInTheDocument()
    })
    test('when isLoadingInProgress in false and tempo alerts are showns', async () => {
        mockIsLoadingInProgress = false

        const { getByText } = reduxedRender(<TempoAlerts />, {
            initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
        })

        expect(getByText('Tempo :')).toBeInTheDocument()
        expect(getByText('Les alertes tempo jour blanc ou rouge')).toBeInTheDocument()
        expect(getByText('Mail')).toBeInTheDocument()
        expect(getByText('Push')).toBeInTheDocument()
    })
})
