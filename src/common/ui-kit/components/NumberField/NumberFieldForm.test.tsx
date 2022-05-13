import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { fireEvent, act } from '@testing-library/react'
import { NumberFieldForm } from './NumberFieldForm'

// Text variables.
const labelTitle = 'PC de bureau'

const propsNumberField = { title: labelTitle, iconLabel: 'computer', disableDecrement: true, initialCount: 1 }

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
})
