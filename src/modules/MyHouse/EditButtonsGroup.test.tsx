import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { EditButtonsGroup } from './EditButtonsGroup'

let mockEnableForm = jest.fn()
let mockDisableForm = jest.fn()
const email = 'user@success.com'
const phone = '+33 1 23 45 67 89'
const address = {
    name: 'Apt. 556, Gwenborough. 92998-3874',
    city: 'Gwenborough',
    zip_code: '92998-3874',
    address_addition: 'testFDF',
    country: 'France',
    lat: 45.706877,
    lng: 5.011265,
    extra_data: {},
}
let mockInitialValues = { email, address, phone }
let mockIsEdit = false

let buttonEditFormProps = {
    formInitialValues: mockInitialValues,
    isEdit: mockIsEdit,
    enableForm: mockEnableForm,
    disableEdit: mockDisableForm,
}
const MODIFIER_BUTTON_TEXT = 'Modifier'
const ANNULER_BUTTON_TEXT = 'Annuler'
const ENREGISTRER_BUTTON_TEXT = 'Enregistrer'

describe('Test ButtonResetForm', () => {
    test('When clicking on Modifier form should not be disabled', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <EditButtonsGroup {...buttonEditFormProps} />
            </Router>,
        )
        expect(getByText(MODIFIER_BUTTON_TEXT)).toBeTruthy()
        expect(() => getByText(ANNULER_BUTTON_TEXT)).toThrow()
        expect(() => getByText(ENREGISTRER_BUTTON_TEXT)).toThrow()
    })
})
