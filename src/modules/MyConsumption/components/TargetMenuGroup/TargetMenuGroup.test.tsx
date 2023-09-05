import { reduxedRender } from 'src/common/react-platform-components/test'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import TargetMenuGroup from 'src/modules/MyConsumption/components/TargetMenuGroup'

describe('Unit tests for TargetMenuGroup component', () => {
    let mockAddTarget = jest.fn()
    let mockRemoveTarget = jest.fn()
    let mockHidePMax = false

    let buttonLabelText = 'target-menu'

    afterEach(() => {
        mockHidePMax = false
    })

    test("when menu isn't open", async () => {
        const { getByLabelText, getByText } = reduxedRender(
            <TargetMenuGroup addTarget={mockAddTarget} removeTarget={mockRemoveTarget} hidePmax={mockHidePMax} />,
        )

        let button = getByLabelText(buttonLabelText)

        expect(button).toBeInTheDocument()
        expect(() => getByText('Ajouter un axe sur le graphique :')).toThrow()
    })
    test('when button is clicked, menu is shown with 3 items', async () => {
        const { getByLabelText, getAllByRole } = reduxedRender(
            <TargetMenuGroup addTarget={mockAddTarget} removeTarget={mockRemoveTarget} hidePmax={mockHidePMax} />,
        )

        let button = getByLabelText(buttonLabelText)

        button.focus()
        button.click()

        let menuItems = getAllByRole('menuitem')

        expect(menuItems[0]).toHaveFocus()
        expect(menuItems).toHaveLength(4) // Including the first label that is used as a placeholder.
    })
    test('when click on a temperature menu item, targets are called', async () => {
        const { getByLabelText, getAllByRole } = reduxedRender(
            <TargetMenuGroup addTarget={mockAddTarget} removeTarget={mockRemoveTarget} hidePmax={mockHidePMax} />,
        )

        let button = getByLabelText(buttonLabelText)

        button.focus()
        button.click()

        let menuItems = getAllByRole('menuitem')

        menuItems.forEach((option) => {
            expect(option).toBeInTheDocument()
        })

        menuItems[2].click()

        expect(mockAddTarget).toBeCalledWith([
            metricTargetsEnum.internalTemperature,
            metricTargetsEnum.externalTemperature,
        ])
    })
    test('when clicked on Pmax menu item, pmax target is called', async () => {
        const { getByLabelText, getAllByRole } = reduxedRender(
            <TargetMenuGroup addTarget={mockAddTarget} removeTarget={mockRemoveTarget} hidePmax={mockHidePMax} />,
        )

        let button = getByLabelText(buttonLabelText)

        button.focus()
        button.click()

        let menuItems = getAllByRole('menuitem')

        menuItems[3].click()

        expect(mockAddTarget).toBeCalledWith([metricTargetsEnum.pMax])
    })
    test('when clicked on Annuler, all targets are reset', async () => {
        const { getByLabelText, getAllByRole } = reduxedRender(
            <TargetMenuGroup addTarget={mockAddTarget} removeTarget={mockRemoveTarget} hidePmax={mockHidePMax} />,
        )

        let button = getByLabelText(buttonLabelText)

        button.focus()
        button.click()

        let menuItems = getAllByRole('menuitem')

        menuItems[1].click()

        expect(mockRemoveTarget).toBeCalled()
    })
    test('when daily period is selecte, Pmax should be disabled', async () => {
        mockHidePMax = true

        const { getByLabelText, getAllByRole } = reduxedRender(
            <TargetMenuGroup addTarget={mockAddTarget} removeTarget={mockRemoveTarget} hidePmax={mockHidePMax} />,
        )

        let button = getByLabelText(buttonLabelText)

        button.focus()
        button.click()

        let menuItems = getAllByRole('menuitem')

        expect(menuItems[3].classList.contains('Mui-disabled')).toBeTruthy()
        expect(menuItems[3]).toHaveAttribute('aria-disabled', 'true')
    })
})
