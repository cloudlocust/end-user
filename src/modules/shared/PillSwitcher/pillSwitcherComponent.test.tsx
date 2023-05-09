import { BrowserRouter } from 'react-router-dom'
import { reduxedRender } from 'src/common/react-platform-components/test'
import { IPillSwitcherComponent, IPillSwitcherProps } from './pillSwitcher'
import { PillSwitcherMenuComponent } from './pillSwitcherComponent'
import userEvent from '@testing-library/user-event'

const TEST_ERROR_MSG = 'Une erreur est survenue'

let mockFirstComponentClickHandlerFN = jest.fn()
let mockSecondComponentClickHandlerFN = jest.fn()

let mockedActiveComponentIndex: number = 0
let mockedComponents: IPillSwitcherComponent[] = []

const mockedFirstComponent: IPillSwitcherComponent = {
    btnText: 'firstComponent',
    clickHandler: mockFirstComponentClickHandlerFN,
}

const mockedSecondComponent: IPillSwitcherComponent = {
    btnText: 'secondComponent',
    clickHandler: mockSecondComponentClickHandlerFN,
}

const mockPillSwitcherProps: IPillSwitcherProps = {
    activeComponentIndex: mockedActiveComponentIndex,
    components: mockedComponents,
}

describe('Test PillSwitcherComponent', () => {
    describe('should throw errors when passing invalid props', () => {
        test('When no components are passed should show Error', async () => {
            const { getByText } = reduxedRender(
                <BrowserRouter>
                    <PillSwitcherMenuComponent {...mockPillSwitcherProps} />
                </BrowserRouter>,
            )
            expect(getByText(TEST_ERROR_MSG)).toBeDefined()
        })

        test('When using an invalid default Index should show Error', async () => {
            mockedActiveComponentIndex = 42

            const { getByText } = reduxedRender(
                <BrowserRouter>
                    <PillSwitcherMenuComponent {...mockPillSwitcherProps} />
                </BrowserRouter>,
            )
            expect(getByText(TEST_ERROR_MSG)).toBeDefined()
        })
    })

    describe('should render correctly using index to set default Cell', () => {
        beforeAll(() => {
            mockedComponents.push(mockedFirstComponent)
            mockedComponents.push(mockedSecondComponent)
        })

        test('When using defaultValue as Index', async () => {
            const { getByText } = reduxedRender(
                <BrowserRouter>
                    <PillSwitcherMenuComponent {...mockPillSwitcherProps} />
                </BrowserRouter>,
            )

            const firstPillCell = getByText(mockedFirstComponent.btnText)
            expect(firstPillCell).toBeDefined()
            expect(firstPillCell.parentElement?.getAttribute('active-cell')).toBeDefined()

            const secondPillCell = getByText(mockedSecondComponent.btnText)
            expect(secondPillCell).toBeDefined()
            expect(secondPillCell.parentElement?.getAttribute('clickable-cell')).toBeDefined()
        })

        test('When using a default defined selected Index', async () => {
            mockedActiveComponentIndex = 1

            const { getByText } = reduxedRender(
                <BrowserRouter>
                    <PillSwitcherMenuComponent {...mockPillSwitcherProps} />
                </BrowserRouter>,
            )

            const firstPillCell = getByText(mockedFirstComponent.btnText)
            expect(firstPillCell).toBeDefined()
            expect(firstPillCell.parentElement?.getAttribute('clickable-cell')).toBeDefined()

            const secondPillCell = getByText(mockedSecondComponent.btnText)
            expect(secondPillCell).toBeDefined()
            expect(secondPillCell.parentElement?.getAttribute('active-cell')).toBeDefined()
        })
    })

    describe('should interact when we click on Component', () => {
        test('When clicking on a Cell, should call ClickHandler', async () => {
            const { getByText } = reduxedRender(
                <BrowserRouter>
                    <PillSwitcherMenuComponent {...mockPillSwitcherProps} />
                </BrowserRouter>,
            )

            userEvent.click(getByText(mockedFirstComponent.btnText))
            expect(mockFirstComponentClickHandlerFN).toHaveBeenCalled()
        })
        test('When clicking on a Cell, should update StyleSheet', async () => {
            const { getByText } = reduxedRender(
                <BrowserRouter>
                    <PillSwitcherMenuComponent {...mockPillSwitcherProps} />
                </BrowserRouter>,
            )

            userEvent.click(getByText(mockedFirstComponent.btnText))
            expect(getByText(mockedSecondComponent.btnText).parentElement).toHaveStyle('cursor: pointer')
        })

        test('When clicking twice on a Cell, should do clickHandler once', async () => {
            const { getByText } = reduxedRender(
                <BrowserRouter>
                    <PillSwitcherMenuComponent {...mockPillSwitcherProps} />
                </BrowserRouter>,
            )

            userEvent.click(getByText(mockedSecondComponent.btnText))
            userEvent.click(getByText(mockedSecondComponent.btnText))
            expect(mockSecondComponentClickHandlerFN).toHaveBeenCalledTimes(1)
        })
    })
})
