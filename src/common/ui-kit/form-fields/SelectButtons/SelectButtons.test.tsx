import React from 'react'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from 'src/common/react-platform-components'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { fireEvent, act } from '@testing-library/react'
import { SelectButtons } from './SelectButtons'

const propsSelectButtons = {
    titleLabel: 'Type de plaques de cuisson:',
    name: 'hotplates',
    initialValue: 'other',
    formOptions: [
        {
            iconLabel: 'remove',
            label: 'electricity',
            value: 'electricity',
            buttonStyle: 'mt-16 flex flex-col mr-10',
            isDisabled: false,
        },
        {
            iconPath: '/assets/images/content/equipment/heatingOther.svg',
            label: 'induction',
            value: 'induction',
            buttonStyle: 'mt-16 flex flex-col mr-10',
            isDisabled: false,
        },
        {
            label: 'other',
            value: 'other',
            buttonStyle: 'mt-16 flex flex-col',
            isDisabled: false,
        },
    ],
}

describe('<SelectButtons /> props', () => {
    test('props must be passed to SelectButtons and value shown', () => {
        const { getByText } = reduxedRender(
            <Form onSubmit={() => {}}>
                <SelectButtons {...propsSelectButtons} />
            </Form>,
        )
        expect(getByText('Type de plaques de cuisson:')).toBeTruthy()
    })
    test('should use correctly by SelectButtons', async () => {
        const handleSubmit = jest.fn()
        const { getByTestId } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <Form onSubmit={(data) => handleSubmit(data)}>
                <SelectButtons {...propsSelectButtons} />
                <input type="submit" data-testid="submit" />
            </Form>,
        )
        await act(async () => {
            userEvent.click(getByTestId('submit'))
        })
        expect(handleSubmit).toHaveBeenCalledWith({ hotplates: 'other' })
    })
    test('value should be changed', async () => {
        const handleSubmit = jest.fn()
        const { getByText, getByTestId } = reduxedRender(
            // eslint-disable-next-line jsdoc/require-jsdoc
            <Form onSubmit={(data) => handleSubmit(data)}>
                <SelectButtons {...propsSelectButtons} />
                <input type="submit" data-testid="submit" />
            </Form>,
        )
        await act(async () => {
            fireEvent.click(getByText('induction'))
        })
        await waitFor(async () => {
            expect(getByText('induction').getAttribute('value')).toBe('induction')
        })
        act(() => {
            fireEvent.click(getByTestId('submit'))
        })
        await waitFor(async () => {
            expect(handleSubmit).toHaveBeenCalledWith({ hotplates: 'induction' })
        })
    })
})
