import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { fireEvent, act } from '@testing-library/react'
import { NumberFieldForm } from './NumberFieldForm'

// Text variables.
const labelTitle = 'PC de bureau'

const propsNumberField = { labelTitle: labelTitle, iconLabel: 'computer', disableDecrement: true, value: 1 }
const propsNumberField2 = { labelTitle: labelTitle, iconLabel: 'computer', disableDecrement: true }

describe('NumberField Test', () => {
    describe('load NumberField', () => {
        test('on success loading the element, NumberField should be loaded, title shown', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <NumberFieldForm {...propsNumberField} />
                </Router>,
            )
            expect(getByText(labelTitle)).toBeTruthy()
        })
    })
    describe('Buttons test', () => {
        test('Increment test', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <NumberFieldForm {...propsNumberField} />
                </Router>,
            )
            act(() => {
                fireEvent.click(getByText('add'))
            })
            expect(getByText(2)).toBeTruthy()
        })
        test('Decrement test', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <NumberFieldForm {...propsNumberField} />
                </Router>,
            )
            act(() => {
                fireEvent.click(getByText('remove'))
            })
            expect(getByText(0)).toBeTruthy()
        })
    })
    test('If no value, zero shown by default', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <NumberFieldForm {...propsNumberField2} />
            </Router>,
        )
        expect(getByText(0)).toBeTruthy()
    })
})
