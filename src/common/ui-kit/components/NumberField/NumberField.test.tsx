import { reduxedRender } from 'src/common/react-platform-components/test'
import { BrowserRouter as Router } from 'react-router-dom'
import { NumberField } from './NumberField'

// Text variables.
const labelTitle = 'PC de bureau'

const propsNumberField = {
    labelTitle: labelTitle,
    iconPath: './assets/images/content/equipment/aspirator.svg',
    disableDecrement: true,
    value: 1,
}
const propsNumberField2 = { labelTitle: labelTitle, iconLabel: 'computer', disableDecrement: true }

describe('NumberField Test', () => {
    describe('load NumberField', () => {
        test('on success loading the element, NumberField should be loaded, title shown', async () => {
            const { getByText } = reduxedRender(
                <Router>
                    <NumberField {...propsNumberField} />
                </Router>,
            )
            expect(getByText(labelTitle)).toBeTruthy()
        })
    })
    test('If no value, zero shown by default', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <NumberField {...propsNumberField2} />
            </Router>,
        )
        expect(getByText(0)).toBeTruthy()
    })
})
