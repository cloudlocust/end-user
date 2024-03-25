import PdlVerificationForm from 'src/modules/User/AlpiqSubscription/PdlVerificationForm'
import { reduxedRender } from 'src/common/react-platform-components/test'
import userEvent from '@testing-library/user-event'
import { fireEvent, waitFor } from '@testing-library/react'
import { METER_GUID_REGEX_TEXT } from 'src/modules/MyHouse/utils/MyHouseVariables'
import { TEST_ADD_METER } from 'src/mocks/handlers/meters'
import { TEST_HOUSES } from 'src/mocks/handlers/houses'
import { applyCamelCase } from 'src/common/react-platform-components'
import { IHousing } from 'src/modules/MyHouse/components/HousingList/housing'

// List of houses to add to the redux state
const LIST_OF_HOUSES: IHousing[] = applyCamelCase(TEST_HOUSES)

const mockHandleNext = jest.fn()
const mockPdlVerificationFormProps = {
    handleNext: mockHandleNext,
}
const mockAddMeter = jest.fn()
const mockEditMeter = jest.fn()
const mockVerifyMeterEligibility = jest.fn()

const NEXT_BUTTON_TEXT = 'Continuer'
const REQUIRED_ERROR_TEXT = 'Champ obligatoire non renseigné'
const guidMeterInputQuerySelector = 'input[name="guid"]'

// Mock metersHook
jest.mock('src/modules/Meters/metersHook', () => ({
    ...jest.requireActual('src/modules/Meters/metersHook'),
    // eslint-disable-next-line jsdoc/require-jsdoc
    useMeterForHousing: () => ({
        addMeter: mockAddMeter,
        editMeter: mockEditMeter,
    }),
}))

// Mock Alpiq hook
jest.mock('src/modules/User/AlpiqSubscription/alpiqSubscriptionHooks', () => ({
    ...jest.requireActual('src/modules/User/AlpiqSubscription/alpiqSubscriptionHooks'),
    //eslint-disable-next-line jsdoc/require-jsdoc
    useAlpiqProvider: () => ({
        verifyMeterEligibility: mockVerifyMeterEligibility,
    }),
}))

describe('Test PdlVerificationForm', () => {
    test('component shows correctly', async () => {
        const { getByText } = reduxedRender(<PdlVerificationForm {...mockPdlVerificationFormProps} />)
        expect(getByText('Connectons votre compteur électrique')).toBeInTheDocument()
        expect(
            getByText(
                'Merci de renseigner votre PDL pour connecter votre compteur électrique à votre espace personnel afin de vous faire la meilleure estimation possible.',
            ),
        ).toBeInTheDocument()
        expect(
            getByText(
                "* Il est composé de 14 chiffres, il s'agit de l'identifiant de votre compteur utilisé par Enedis, vous pouvez aussi retrouver votre PDL sur votre compteur Linky en appuyant 6 fois sur la touche « + » sous le nom «NUMERO PRM»",
            ),
        ).toBeInTheDocument()
    })
    test('all fields required required', async () => {
        const { getAllByText, getByText } = reduxedRender(<PdlVerificationForm {...mockPdlVerificationFormProps} />)
        // When guid is empty
        userEvent.click(getByText(NEXT_BUTTON_TEXT))
        await waitFor(() => {
            expect(getAllByText(REQUIRED_ERROR_TEXT).length).toBe(1)
        })
    }, 20000)
    test('GUID format validation, 14 chiffres', async () => {
        const { container, getByText } = reduxedRender(<PdlVerificationForm {...mockPdlVerificationFormProps} />)
        fireEvent.input(container.querySelector(guidMeterInputQuerySelector)!, { target: { value: '123456' } })
        userEvent.click(getByText(NEXT_BUTTON_TEXT))
        await waitFor(() => {
            expect(getByText(METER_GUID_REGEX_TEXT)).toBeTruthy()
        })
        fireEvent.input(container.querySelector(guidMeterInputQuerySelector)!, {
            target: { value: '12345678912345' },
        })
        userEvent.click(getByText(NEXT_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockPdlVerificationFormProps.handleNext).not.toHaveBeenCalled()
        })
    })
    test('GUID Correct format, edit existing meter', async () => {
        const { container, getByText } = reduxedRender(<PdlVerificationForm {...mockPdlVerificationFormProps} />, {
            initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[0] } },
        })
        fireEvent.change(container.querySelector(guidMeterInputQuerySelector)! as HTMLInputElement, {
            target: { value: TEST_ADD_METER.guid },
        })

        expect(container.querySelector(guidMeterInputQuerySelector)!).toHaveValue(TEST_ADD_METER.guid)
        userEvent.click(getByText(NEXT_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockEditMeter).toHaveBeenCalledWith(LIST_OF_HOUSES[0].id, TEST_ADD_METER)
        })
        await waitFor(() => {
            expect(mockVerifyMeterEligibility).toHaveBeenCalledWith(LIST_OF_HOUSES[0].id, mockHandleNext)
        })
    })
    test('GUID Correct format, add new meter', async () => {
        const { container, getByText } = reduxedRender(<PdlVerificationForm {...mockPdlVerificationFormProps} />, {
            initialState: { housingModel: { currentHousing: LIST_OF_HOUSES[1] } },
        })
        fireEvent.change(container.querySelector(guidMeterInputQuerySelector)! as HTMLInputElement, {
            target: { value: TEST_ADD_METER.guid },
        })

        expect(container.querySelector(guidMeterInputQuerySelector)!).toHaveValue(TEST_ADD_METER.guid)
        userEvent.click(getByText(NEXT_BUTTON_TEXT))
        await waitFor(() => {
            expect(mockAddMeter).toHaveBeenCalledWith(LIST_OF_HOUSES[1].id, TEST_ADD_METER)
        })
        await waitFor(() => {
            expect(mockVerifyMeterEligibility).toHaveBeenCalledWith(LIST_OF_HOUSES[1].id, mockHandleNext)
        })
    })
    test('GUID Correct format, no current housing', async () => {
        const { container, getByText } = reduxedRender(<PdlVerificationForm {...mockPdlVerificationFormProps} />, {
            initialState: { housingModel: { currentHousing: null } },
        })
        fireEvent.change(container.querySelector(guidMeterInputQuerySelector)! as HTMLInputElement, {
            target: { value: TEST_ADD_METER.guid },
        })

        expect(container.querySelector(guidMeterInputQuerySelector)!).toHaveValue(TEST_ADD_METER.guid)
        userEvent.click(getByText(NEXT_BUTTON_TEXT))
        expect(mockAddMeter).not.toHaveBeenCalled()
        expect(mockEditMeter).not.toHaveBeenCalled()
        expect(mockVerifyMeterEligibility).not.toHaveBeenCalled()
    })
})
