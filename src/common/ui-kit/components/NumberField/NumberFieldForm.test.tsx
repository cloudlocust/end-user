import React from 'react'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { NumberFieldForm } from './NumberFieldForm'
import { fireEvent, act } from '@testing-library/react'

const handleBlur = jest.fn()

const propsNumberField = {
    name: 'computer',
    labelTitle: 'PC de bureau',
    iconLabel: 'computer',
    disableDecrement: true,
    value: 1,
    onBlur: handleBlur,
}

describe('<NumberField /> countries props', () => {
    test('props must be passed to NumberField and value shown', () => {
        const { getByText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <NumberFieldForm {...propsNumberField} />
            </Form>,
        )
        expect(getByText(1)).toBeTruthy()
    })
    test('should use correctly by NumberField', async () => {
        const handleSubmit = jest.fn()

        const { getByTestId } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <Form onSubmit={(data: { phone: string }) => handleSubmit(data)}>
                <NumberFieldForm {...propsNumberField} />
                <input type="submit" data-testid="submit" />
            </Form>,
        )

        await act(async () => {
            userEvent.click(getByTestId('submit'))
        })

        expect(handleSubmit).toHaveBeenCalledWith({ computer: 1 })
    })
    test('addition and subtraction work', async () => {
        const handleSubmit = jest.fn()
        const { getByText, getByTestId } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <Form onSubmit={(data) => handleSubmit(data)}>
                <NumberFieldForm {...propsNumberField} />
                <input type="submit" data-testid="submit" />
            </Form>,
        )

        await act(async () => {
            fireEvent.click(getByText('add'))
            fireEvent.blur(getByText('add'))
        })
        await waitFor(async () => {
            expect(getByText(2)).toBeTruthy()
        })
        await act(async () => {
            fireEvent.click(getByText('remove'))
            fireEvent.blur(getByText('remove'))
        })
        await waitFor(async () => {
            expect(getByText(1)).toBeTruthy()
        })
        act(() => {
            fireEvent.click(getByTestId('submit'))
        })
        await waitFor(async () => {
            expect(handleSubmit).toHaveBeenCalledWith({ computer: 2 })
        })
    })
})
