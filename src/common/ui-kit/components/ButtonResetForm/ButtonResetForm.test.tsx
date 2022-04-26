import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { ButtonResetForm } from 'src/common/ui-kit/components/ButtonResetForm/ButtonResetForm'
import { fireEvent, act } from '@testing-library/react'

let mockReset = jest.fn()
let onClickButtonReset = jest.fn()
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

let buttonRestFormProps = {
    initialValues: mockInitialValues,
    onClickButtonReset: onClickButtonReset,
}

/**
 * Mocking the rest.
 */
jest.mock('react-hook-form', () => ({
    ...jest.requireActual('react-hook-form'),
    /**
     * Mock the react-hook-form hooks.
     *
     * @returns The react-hook-form hook.
     */
    useFormContext: () => ({
        reset: mockReset,
    }),
}))

describe('Test ButtonResetForm', () => {
    test('when clicking on Annuler, OnClick reset and disableEditForm should fire', () => {
        const { getByText } = reduxedRender(
            <Router>
                <ButtonResetForm {...buttonRestFormProps} />
            </Router>,
        )

        act(() => {
            fireEvent.click(getByText('Annuler'))
        })

        expect(onClickButtonReset).toHaveBeenCalled()
        expect(mockReset).toHaveBeenCalled()
    })
})
