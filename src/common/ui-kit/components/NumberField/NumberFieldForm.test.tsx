import React from 'react'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { NumberFieldForm } from './NumberFieldForm'

const propsNumberField = {
    name: 'computer',
    labelTitle: 'PC de bureau',
    iconLabel: 'computer',
    disableDecrement: true,
    value: 1,
}
const propsNumberField2 = {
    name: 'computer',
    labelTitle: 'PC de bureau',
    iconLabel: 'computer',
    disableDecrement: true,
}
const DISABLED_BUTTON_CLASS = 'Mui-disabled'
const ADD_BUTTON_TEXT = 'add'
const SUBTRACT_BUTTON_TEXT = 'remove'

describe('<NumberField /> countries props', () => {
    test('props must be passed to NumberField and value shown', () => {
        const { getByText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <NumberFieldForm {...propsNumberField} />
            </Form>,
        )
        expect(getByText(1)).toBeTruthy()
    })
    test('when Default Value in form, it should be shown', () => {
        const { getByText } = reduxedRender(
            <Form onSubmit={() => {}} defaultValues={{ computer: 20 }}>
                <NumberFieldForm {...propsNumberField2} />
            </Form>,
        )
        expect(getByText(20)).toBeTruthy()
    })
    test('If no value, zero shown by default, and subtraction is disabled', () => {
        const { getByText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <NumberFieldForm {...propsNumberField2} />
            </Form>,
        )
        expect(getByText(0)).toBeTruthy()
        expect(getByText(SUBTRACT_BUTTON_TEXT).parentElement!.classList.contains(DISABLED_BUTTON_CLASS)).toBeTruthy()
        expect(getByText(ADD_BUTTON_TEXT).parentElement!.classList.contains(DISABLED_BUTTON_CLASS)).toBeFalsy()
    })
    test('should use correctly by NumberField', async () => {
        const handleSubmit = jest.fn()

        const { getByTestId } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <Form onSubmit={(data) => handleSubmit(data)}>
                <NumberFieldForm {...propsNumberField} />
                <input type="submit" data-testid="submit" />
            </Form>,
        )

        userEvent.click(getByTestId('submit'))
        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledWith({ computer: 1 })
        })
    })
    test('addition and subtraction work, and when substraction 0 it should be disabled', async () => {
        const handleSubmit = jest.fn()
        const { getByText, getByTestId } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <Form onSubmit={(data) => handleSubmit(data)}>
                <NumberFieldForm {...propsNumberField} />
                <input type="submit" data-testid="submit" />
            </Form>,
        )

        userEvent.click(getByText(ADD_BUTTON_TEXT).parentElement!)
        await waitFor(async () => {
            expect(getByText(2)).toBeTruthy()
        })
        userEvent.click(getByText(SUBTRACT_BUTTON_TEXT).parentElement!)
        await waitFor(async () => {
            expect(getByText(1)).toBeTruthy()
        })
        userEvent.click(getByTestId('submit'))
        await waitFor(async () => {
            expect(handleSubmit).toHaveBeenCalledWith({ computer: 1 })
        })
    })
    test('When props disabled, addition and subtraction too', async () => {
        const handleSubmit = jest.fn()
        const { getByText } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <Form onSubmit={(data) => handleSubmit(data)}>
                <NumberFieldForm {...propsNumberField} disabled={true} />
                <input type="submit" data-testid="submit" />
            </Form>,
        )
        expect(getByText(SUBTRACT_BUTTON_TEXT).parentElement!.classList.contains(DISABLED_BUTTON_CLASS)).toBeTruthy()
        expect(getByText(ADD_BUTTON_TEXT).parentElement!.classList.contains(DISABLED_BUTTON_CLASS)).toBeTruthy()
    })
})
