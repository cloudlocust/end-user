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
    test('If value is provided, value shown', async () => {
        const { getByText } = reduxedRender(
            <Router>
                <NumberField {...propsNumberField} />
            </Router>,
        )
        expect(getByText(1)).toBeTruthy()
    })

    test('should throw error if neither iconPath, iconLabel, nor iconComponent is provided', () => {
        expect(() => {
            reduxedRender(
                <Router>
                    <NumberField labelTitle={labelTitle} />
                </Router>,
            )
        }).toThrow('iconPath or iconLabel or iconComponent prop must be provided')
    })

    test('should render iconComponent if provided', () => {
        // eslint-disable-next-line jsdoc/require-jsdoc
        const MockIconComponent = () => <svg data-testid="mock-icon"></svg>

        const { getByTestId } = reduxedRender(
            <Router>
                <NumberField {...propsNumberField} iconComponent={MockIconComponent} />
            </Router>,
        )

        expect(getByTestId('mock-icon')).toBeInTheDocument()
    })
})
