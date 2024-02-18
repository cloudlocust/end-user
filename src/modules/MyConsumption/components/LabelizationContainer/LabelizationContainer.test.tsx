import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { applyCamelCase } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { IEnedisSgeConsent, IEnphaseConsent, INrlinkConsent } from 'src/modules/Consents/Consents'
import LablizationContainer from 'src/modules/MyConsumption/components/LabelizationContainer'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const mockGetConsents = jest.fn()

// Nrlink Consent format
const nrLinkConsent: INrlinkConsent = {
    meterGuid: '133456',
    nrlinkConsentState: 'CONNECTED',
    nrlinkGuid: '12',
}

// Enedis Consent format
const enedisSGeConsent: IEnedisSgeConsent = {
    meterGuid: '133456',
    enedisSgeConsentState: 'CONNECTED',
    expiredAt: '',
}

// Enphase Consent default
const enphaseConsent: IEnphaseConsent = {
    meterGuid: '133456',
    enphaseConsentState: 'ACTIVE',
}

let mockNrlinkConsent: INrlinkConsent | undefined = nrLinkConsent
let mockEnedisConsent: IEnedisSgeConsent | undefined = enedisSGeConsent
let mockEnphaseConsent: IEnphaseConsent | undefined = enphaseConsent

let mockConsentsLoading: boolean = false

// Mock consentsHook
jest.mock('src/modules/Consents/consentsHook.ts', () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    useConsents: () => ({
        getConsents: mockGetConsents,
        nrlinkConsent: mockNrlinkConsent,
        enedisSgeConsent: mockEnedisConsent,
        enphaseConsent: mockEnphaseConsent,
        consentsLoading: mockConsentsLoading,
    }),
}))

const mockHistoryBackFn = jest.fn()

/**
 * Mocking the react-router-dom used in the list.
 */
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    /**
     * Mock browser History.
     *
     * @returns UseHistory.
     */
    useHistory: () => ({
        goBack: mockHistoryBackFn,
        listen: jest.fn(),
    }),
}))

describe('LablizationContainer', () => {
    beforeEach(() => {
        mockConsentsLoading = false
    })

    // TODO: fix this test when render correctly
    // test('should render correctly', async () => {
    //     const { getByText } = reduxedRender(
    //         <BrowserRouter>
    //             <LablizationContainer />
    //         </BrowserRouter>,
    //         { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
    //     )

    //     expect(getByText('Identification des activités')).toBeInTheDocument()
    //     expect(getByText('arrow_back')).toBeInTheDocument()
    //     const backButton = getByText('Retour')
    //     expect(backButton).toBeInTheDocument()
    //     userEvent.click(backButton)
    //     await waitFor(() => {
    //         expect(mockHistoryBackFn).toHaveBeenCalled()
    //     })
    // })

    test('should show progress circle when the consents is loading', async () => {
        mockConsentsLoading = true
        const { getByRole } = reduxedRender(
            <BrowserRouter>
                <LablizationContainer />
            </BrowserRouter>,
            { initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } } },
        )

        expect(getByRole('progressbar')).toBeInTheDocument()
    })

    test('should show error when there is no housing', async () => {
        const { getByText } = reduxedRender(
            <BrowserRouter>
                <LablizationContainer />
            </BrowserRouter>,
            { initialState: { housingModel: { currentHousing: null } } },
        )

        expect(getByText('error_outline_outlined')).toBeInTheDocument()
        expect(getByText("Pour voir votre consommation vous devez d'abord")).toBeInTheDocument()
        const link = getByText('enregistrer votre compteur et votre nrLINK')
        expect(link).toBeInTheDocument()
        userEvent.click(link)
        await waitFor(() => {
            expect(window.location.pathname).toBe('/nrlink-connection-steps/undefined')
        })
    })
})
