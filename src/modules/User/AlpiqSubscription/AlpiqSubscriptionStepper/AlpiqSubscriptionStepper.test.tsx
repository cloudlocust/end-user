import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import AlpiqSubscriptionStepper, { stepsLabels } from 'src/modules/User/AlpiqSubscription/AlpiqSubscriptionStepper'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'
import { TEST_ADD_METER } from 'src/mocks/handlers/meters'
import { fireEvent, waitFor } from '@testing-library/react'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)
const guidMeterInputQuerySelector = 'input[name="guid"]'

const mockAddMeter = jest.fn()
// Mock metersHook
jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterForHousing: () => ({
        addMeter: mockAddMeter,
    }),
}))

jest.mock('src/modules/Consents/consentsHook', () => ({
    ...jest.requireActual('src/modules/Consents/consentsHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        enedisSgeConsent: { enedisSgeConsentState: 'NONEXISTANT' },
        getConsents: jest.fn(),
    }),
}))

describe('Test SgeConsentStepProps', () => {
    test('component shows correctly', async () => {
        const { getByText } = reduxedRender(<AlpiqSubscriptionStepper />, {
            initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[1] } },
        })
        stepsLabels.map((label) => expect(getByText(label)).toBeTruthy())
        expect(
            getByText('Votre souscription est sauvegardée, vous pouvez la reprendre à tout moment.'),
        ).toBeInTheDocument()
        expect(getByText('Pour toutes questions, contactez notre équipe')).toBeInTheDocument()
        expect(getByText('06.75.08.20.15')).toBeInTheDocument()
        expect(getByText('info@bowatts.fr')).toBeInTheDocument()
    })
    test('allows navigation to the next step', async () => {
        const { container, getByText } = reduxedRender(<AlpiqSubscriptionStepper />, {
            initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[1] } },
        })
        fireEvent.change(container.querySelector(guidMeterInputQuerySelector)! as HTMLInputElement, {
            target: { value: TEST_ADD_METER.guid },
        })
        userEvent.click(getByText('Continuer'))
        await waitFor(() => {
            expect(mockAddMeter).toHaveBeenCalledWith(LIST_OF_HOUSES[1].id, TEST_ADD_METER)
        })
    })
})
