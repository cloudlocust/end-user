import React from 'react'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { fireEvent, act } from '@testing-library/react'
import { NumberFieldForm } from './NumberFieldForm'
import { useIntl, IntlProvider } from 'react-intl'

// Text variables.
const labelTitle = 'PC de bureau'

const propsNumberField = { labelTitle: labelTitle, iconLabel: 'computer', disableDecrement: true, value: 1 }
const propsNumberField2 = { labelTitle: labelTitle, iconLabel: 'computer', disableDecrement: true }

// jest.mock('react-intl', () => {
//     const reactIntl = jest.requireActual('react-intl')
//     const intl = reactIntl.createIntl({
//         locale: 'en',
//     })

//     return {
//         ...reactIntl,
//         useIntl: () => intl,
//     }
// })

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
    test('Is no value', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <NumberFieldForm {...propsNumberField2} />
            </Router>,
        )
        expect(getByText(0)).toBeTruthy()
    })
    test('disabled button', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <NumberFieldForm {...propsNumberField2} />
            </Router>,
        )
        act(() => {
            fireEvent.click(getByText('remove'))
        })
    })
})
