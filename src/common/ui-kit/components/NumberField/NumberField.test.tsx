import React from 'react'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { NumberField } from './NumberField'
import { fireEvent, act } from '@testing-library/react'

// afterEach(cleanup)

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
    test('must pass a name into the input', () => {
        const { getByText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <NumberField {...propsNumberField} />
            </Form>,
        )
        expect(getByText(1)).toBeTruthy()
    })
    test('should use correctly by react-hook-form', async () => {
        const handleSubmit = jest.fn()

        const { getByTestId } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <Form onSubmit={(data: { phone: string }) => handleSubmit(data)}>
                <NumberField {...propsNumberField} />
                <input type="submit" data-testid="submit" />
            </Form>,
        )

        await act(async () => {
            userEvent.click(getByTestId('submit'))
        })

        expect(handleSubmit).toHaveBeenCalledWith({ computer: 1 })
    })
    test('2', async () => {
        const handleSubmit = jest.fn()
        const { getByText, getByTestId } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <Form onSubmit={(data) => handleSubmit(data)}>
                <NumberField {...propsNumberField} />
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
