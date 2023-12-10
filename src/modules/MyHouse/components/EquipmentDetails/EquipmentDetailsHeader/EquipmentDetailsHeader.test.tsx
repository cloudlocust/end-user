import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { EquipmentDetailsHeader } from 'src/modules/MyHouse/components/EquipmentDetails/EquipmentDetailsHeader'
import { myEquipmentOptions } from 'src/modules/MyHouse/utils/MyHouseVariables'

let mockHistoryGoBack = jest.fn()
let EQUIPMENT_NAME = myEquipmentOptions[0].name
let EQUIPMENT_LABEL_TITLE = myEquipmentOptions[0].labelTitle
let GO_BACK_BUTTON_TEXT = 'Retour'

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),

    // eslint-disable-next-line jsdoc/require-jsdoc
    useHistory: () => ({
        goBack: mockHistoryGoBack,
        listen: jest.fn(),
    }),
}))

describe('EquipmentDetailsHeader tests', () => {
    test('renders correctly and call history.goBack when the button Retour clicked', async () => {
        const { getByText } = reduxedRender(<EquipmentDetailsHeader equipmentName={EQUIPMENT_NAME} />)

        expect(getByText('arrow_back')).toBeInTheDocument()
        expect(getByText(EQUIPMENT_LABEL_TITLE)).toBeInTheDocument()
        const goBackButton = getByText(GO_BACK_BUTTON_TEXT)
        expect(goBackButton).toBeInTheDocument()
        userEvent.click(goBackButton)
        await waitFor(() => {
            expect(mockHistoryGoBack).toHaveBeenCalled()
        })
    })
})
