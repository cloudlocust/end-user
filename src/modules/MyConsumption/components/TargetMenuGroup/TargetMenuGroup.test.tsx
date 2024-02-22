import { reduxedRender } from 'src/common/react-platform-components/test'
import { metricTargetsEnum } from 'src/modules/Metrics/Metrics.d'
import TargetMenuGroup from 'src/modules/MyConsumption/components/TargetMenuGroup'

const menuButtonLabelText = 'target-menu'
const menuItemRole = 'menuitem'

describe('Unit tests for TargetMenuGroup component', () => {
    const mockAddTarget = jest.fn()
    const mockRemoveTarget = jest.fn()
    let mockHidePMax = false
    const mockActiveButton = 'reset'

    afterEach(() => {
        mockHidePMax = false
    })

    test("when menu isn't open", async () => {
        const { getByLabelText, getByText } = reduxedRender(
            <TargetMenuGroup
                addTargets={mockAddTarget}
                removeTargets={mockRemoveTarget}
                hidePmax={mockHidePMax}
                activeButton={mockActiveButton}
            />,
        )

        let menuButton = getByLabelText(menuButtonLabelText)

        expect(menuButton).toBeInTheDocument()
        expect(() => getByText('Ajouter un axe sur le graphique :')).toThrow()
    })
    test('when button is clicked, menu is shown with 3 items', async () => {
        const { getByLabelText, getAllByRole } = reduxedRender(
            <TargetMenuGroup
                addTargets={mockAddTarget}
                removeTargets={mockRemoveTarget}
                hidePmax={mockHidePMax}
                activeButton={mockActiveButton}
            />,
        )

        const menuButton = getByLabelText(menuButtonLabelText)
        menuButton.focus()
        menuButton.click()

        let menuItems = getAllByRole(menuItemRole)

        expect(menuItems[0]).toHaveFocus()
        expect(menuItems).toHaveLength(4) // Including the first label that is used as a placeholder.
    })
    test('when click on a temperature menu item, targets are called', async () => {
        const { getByLabelText, getAllByRole } = reduxedRender(
            <TargetMenuGroup
                addTargets={mockAddTarget}
                removeTargets={mockRemoveTarget}
                hidePmax={mockHidePMax}
                activeButton={mockActiveButton}
            />,
        )

        const menuButton = getByLabelText(menuButtonLabelText)
        menuButton.focus()
        menuButton.click()

        let menuItems = getAllByRole(menuItemRole)

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
            <TargetMenuGroup
                addTargets={mockAddTarget}
                removeTargets={mockRemoveTarget}
                hidePmax={mockHidePMax}
                activeButton={mockActiveButton}
            />,
        )

        const menuButton = getByLabelText(menuButtonLabelText)
        menuButton.focus()
        menuButton.click()

        let menuItems = getAllByRole(menuItemRole)

        menuItems[3].click()

        expect(mockAddTarget).toBeCalledWith([metricTargetsEnum.pMax])
    })
    test('when clicked on Annuler, all targets are reset', async () => {
        const { getByLabelText, getAllByRole } = reduxedRender(
            <TargetMenuGroup
                addTargets={mockAddTarget}
                removeTargets={mockRemoveTarget}
                hidePmax={mockHidePMax}
                activeButton={mockActiveButton}
            />,
        )

        const menuButton = getByLabelText(menuButtonLabelText)
        menuButton.focus()
        menuButton.click()

        let menuItems = getAllByRole(menuItemRole)

        menuItems[1].click()

        expect(mockRemoveTarget).toBeCalled()
    })
    test('When period is daily, Pmax should not be shown', async () => {
        mockHidePMax = true

        const { getByLabelText, getAllByRole, queryByText } = reduxedRender(
            <TargetMenuGroup
                addTargets={mockAddTarget}
                removeTargets={mockRemoveTarget}
                hidePmax={mockHidePMax}
                activeButton={mockActiveButton}
            />,
        )

        const menuButton = getByLabelText(menuButtonLabelText)
        menuButton.focus()
        menuButton.click()

        expect(getAllByRole(menuItemRole).length).toBe(3)
        expect(queryByText('Pmax')).not.toBeInTheDocument()
    })
})
